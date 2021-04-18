<template>
  <v-card class="secondaryBack">
    <v-card-title class="primaryBack">
      <h3 class="converter-title">ETH / WETH Balances</h3>
    </v-card-title>
    <v-card-text class="secondaryBack pt-4">
      <v-row class="my-1 px-6">
        <v-col cols="3" class="d-flex align-center pa-0">
          <span class="order-form-label">ETH</span>
        </v-col>
        <v-col cols="7" class="py-1">
          <v-text-field
            :max="totalBalance | toEth"
            @input="onEthValueChange($event)"
            background-color="selectBackground"
            class="font-size-14 rounded-0 ml-0 mb-0"
            color="emdxBlue"
            dense
            height="32"
            hide-details
            min="0"
            solo
            suffix="ETH"
            type="number"
            v-model.number="convertEthValue"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center justify-center">
          <v-icon
            @click="handleClick"
            class="pa-1"
            color="secondaryColor"
            data-coin="eth"
            data-operation="increment"
            size="20"
          >
            mdi-plus
          </v-icon>
          <v-icon
            @click="handleClick"
            class="pa-1"
            color="secondaryColor"
            data-coin="eth"
            data-operation="decrement"
            size="20"
          >
            mdi-minus
          </v-icon>
        </v-col>
      </v-row>

      <v-row class="my-1 px-6">
        <v-col cols="3" class="d-flex align-center pa-0">
          <span class="order-form-label">wETH</span>
        </v-col>
        <v-col cols="7" class="py-1">
          <v-text-field
            :max="totalBalance | toEth"
            @input="onWethValueChange($event)"
            background-color="selectBackground"
            class="font-size-14 rounded-0 ml-0 mb-0"
            color="emdxBlue"
            dense
            height="32"
            hide-details
            min="0"
            solo
            suffix="wETH"
            type="number"
            v-model.number="convertWethValue"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="d-flex align-center justify-center">
          <v-icon
            @click="handleClick"
            class="pa-1"
            color="secondaryColor"
            data-coin="weth"
            data-operation="increment"
            size="20"
          >
            mdi-plus
          </v-icon>
          <v-icon
            @click="handleClick"
            class="pa-1"
            color="secondaryColor"
            data-coin="weth"
            data-operation="decrement"
            size="20"
          >
            mdi-minus
          </v-icon>
        </v-col>
      </v-row>
      <div class="text-center">
        <p class="secondary-color-text mb-0 mt-2">
          Total balance:
          <span class="primary-color-text">
            {{ totalBalance | toEth }} ETH
          </span>
        </p>
      </div>
    </v-card-text>
    <v-card-actions class="primaryBack d-flex flex-column">
      <v-btn
        :disabled="isConvertButtonDisabled"
        @click="handleConvertClick"
        class="my-4"
        color="primary"
        min-width="150"
      >
        Convert
      </v-btn>
      <p class="info-converter">wETH is used for trades on 0x</p>
      <p class="info-converter">1 wETH = 1 ETH</p>
    </v-card-actions>
    <ConvertNotification
      :error="convertError"
      :from-coin="fromCoin"
      :on-close="handleModalClose"
      :show="showConvertNotificationModal"
      :success="convertSuccess"
      :to-coin="toCoin"
      :value="value | toEth"
    ></ConvertNotification>
  </v-card>
</template>

<script>
import { assetDataUtils } from "@emdx-dex/order-utils";
import { DEFAULT_GAS_PRICE, ETH_DECIMALS } from "../../util/constants";
import { getContractWrappers } from "../../services/contract_wrappers";
import { getTransactionOptions } from "../../util/orders/order-creation";
import { getWeb3Wrapper } from "../../services/web3_wrapper";
import { toEther, unitsInTokenAmount } from "../../util/orders/tokens";
import ConvertNotification from "../notifications/Convert";
import isEmpty from "lodash/isEmpty";

export default {
  components: {
    ConvertNotification
  },
  data() {
    return {
      contractWrappers: null,
      convertError: null,
      convertEthValue: null,
      convertSuccess: null,
      convertWethValue: null,
      fromCoin: null,
      isUpdateBalanceDisabled: false,
      showConvertNotificationModal: false,
      toCoin: null,
      value: 0,
      web3Wrapper: null
    };
  },
  computed: {
    // TODO: Add validation if values are number.
    isConvertButtonDisabled: function() {
      return this.convertWethValue == this.wethBalance;
    },
    totalBalance: function() {
      const balance = this.$store.getters.balance;
      const wethBalance = this.$store.getters.wethBalance;

      return balance.plus(wethBalance);
    },
    walletBalance: function() {
      return this.$store.getters.balanceInEth;
    },
    wethBalance: function() {
      return this.$store.getters.wethBalanceInEth;
    }
  },
  watch: {
    walletBalance: function(value) {
      this.convertEthValue = value;
    },
    wethBalance: function(value) {
      this.convertWethValue = value;
    }
  },
  filters: {
    toEth: function(value) {
      return toEther(value);
    }
  },
  created: async function() {
    const contractWrappers = await getContractWrappers();
    const web3Wrapper = await getWeb3Wrapper();

    this.contractWrappers = contractWrappers;
    this.convertEthValue = this.walletBalance;
    this.web3Wrapper = web3Wrapper;
  },
  methods: {
    handleClick(event) {
      const { coin, operation } = event.target.dataset;
      const value =
        coin === "weth" ? this.convertWethValue : this.convertEthValue;

      const add = operation === "increment" ? 1 : -1;
      const totalBalance = this.totalBalance;
      const selectedCoinInEth = unitsInTokenAmount(
        Number(value) + add,
        ETH_DECIMALS
      );
      const nextEth = totalBalance.minus(selectedCoinInEth);

      if (selectedCoinInEth.isLessThan(0) || nextEth.isLessThan(0)) return;

      if (coin === "weth") {
        this.convertWethValue = toEther(selectedCoinInEth);
        this.convertEthValue = toEther(nextEth);
      } else {
        this.convertEthValue = toEther(selectedCoinInEth);
        this.convertWethValue = toEther(nextEth);
      }
    },
    handleConvertClick() {
      this.convertError = false;
      this.convertSuccess = false;
      this.showConvertNotificationModal = true;

      const ethAccount = this.$store.getters.coinbase;
      const wethBalance = this.$store.getters.wethBalance;
      const newWethBalance = unitsInTokenAmount(
        this.convertWethValue,
        ETH_DECIMALS
      );
      const wethToken = this.contractWrappers.weth9;
      const web3 = this.$store.getters.web3Instance;

      let transaction;

      if (wethBalance.isLessThan(newWethBalance)) {
        this.fromCoin = "Eth";
        this.toCoin = "wEth";
        this.value = newWethBalance.minus(wethBalance);

        transaction = wethToken.deposit().sendTransactionAsync({
          value: newWethBalance.minus(wethBalance),
          from: ethAccount,
          ...getTransactionOptions(DEFAULT_GAS_PRICE)
        });
      } else if (wethBalance.isGreaterThan(newWethBalance)) {
        this.fromCoin = "wEth";
        this.toCoin = "Eth";
        this.value = wethBalance.minus(newWethBalance);

        transaction = wethToken
          .withdraw(wethBalance.minus(newWethBalance))
          .sendTransactionAsync({
            from: ethAccount,
            ...getTransactionOptions(DEFAULT_GAS_PRICE)
          });
      }

      transaction
        .then(tx => {
          let interval = setInterval(() => {
            web3.eth.getTransactionReceipt(tx, (error, { blockHash } = {}) => {
              if (error) {
                clearInterval(interval);

                this.convertError = true;

                return;
              }

              if (blockHash) {
                const encodedAddress = assetDataUtils.encodeERC20AssetData(
                  wethToken.address
                );
                this.contractWrappers.devUtils
                  .getBalanceAndAssetProxyAllowance(ethAccount, encodedAddress)
                  .callAsync()
                  .then(([balance, allowance]) => {
                    clearInterval(interval);

                    this.convertSuccess = true;

                    this.$store.dispatch("TOKEN_UPDATE", {
                      token: "weth",
                      update: {
                        allowance,
                        balance,
                        unlocked: allowance.isGreaterThan(0)
                      }
                    });
                  })
                  .catch(() => {
                    clearInterval(interval);

                    this.convertError = true;
                  });
              }
            });
          }, 1000);
        })
        .catch(() => {
          this.convertError = true;
        });
    },
    handleModalClose() {
      this.showConvertNotificationModal = false;
    },
    onEthValueChange(value) {
      if (!isEmpty(value)) {
        const totalBalance = this.totalBalance;
        const selectedWethInEth = unitsInTokenAmount(value, ETH_DECIMALS);
        const nextEth = totalBalance.minus(selectedWethInEth);

        this.convertWethValue = toEther(nextEth);
      }
    },
    onWethValueChange(value) {
      if (!isEmpty(value)) {
        const totalBalance = this.totalBalance;
        const selectedWethInEth = unitsInTokenAmount(value, ETH_DECIMALS);
        const nextEth = totalBalance.minus(selectedWethInEth);

        this.convertEthValue = toEther(nextEth);
      }
    }
  }
};
</script>

<style scoped>
.converter-title {
  color: var(--v-primary-base);
  font-size: 20px;
  text-transform: uppercase;
}
.info-converter {
  font-size: 12px;
  color: var(--v-secondaryColor-base);
  margin: 0px;
}
input {
  display: none !important;
}
</style>
