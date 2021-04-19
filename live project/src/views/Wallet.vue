<template>
  <div class="wallet-container">
    <v-container>
      <div class="d-flex align-center">
        <h2 class="page-title">{{ title }}</h2>
        <v-btn class="ml-4 disconnect-button" text small color="error">
          <v-icon size="16" color="error" class="mr-1">mdi-close</v-icon>
          Disconnect</v-btn
        >
      </div>
      <v-row>
        <v-col class="col-8">
          <v-card class="primaryBack">
            <v-card-title class="secondaryBack">
              <h3 class="token-balances-title mr-4">Token Balances</h3>
              <v-switch dense color="primary" label="Show empty balances">
              </v-switch>
              <v-spacer></v-spacer>
              <v-text-field dense></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="tokensHeader"
              :items="tokens"
              class="primaryBack"
              hide-default-footer
            >
              <template v-slot:item.icon="{ item }">
                <img :src="`/img/${item.icon.substring(7)}`" alt="" />
              </template>
              <template v-slot:item.symbol="{ item }">
                <span class="text-uppercase">{{ item.symbol }}</span>
              </template>
              <template v-slot:item.locked="{ index, item }">
                <div
                  :data-index="index"
                  @click="handleLockClick"
                  class="d-flex align-center justify-center wallet__lock__icon"
                >
                  <v-icon v-show="!item.unlocked" size="16">mdi-lock</v-icon>
                  <v-icon
                    color="rgba(255, 255, 255, 0.3)"
                    v-show="item.unlocked"
                    size="16"
                  >
                    mdi-lock-open
                  </v-icon>
                </div>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
        <v-col class="col-4">
          <Converter></Converter>
        </v-col>
      </v-row>
    </v-container>

    <LockNotification
      :error="lockError"
      :on-close="handleModalClose"
      :show="showLockModal"
      :success="lockSuccess"
      :token="token"
    ></LockNotification>
  </div>
</template>

<script>
import { ERC20TokenContract } from "@emdx-dex/contract-wrappers";
import { assetDataUtils } from "@emdx-dex/order-utils";
import { getAddressFromWallet } from "../util/wallet";
//import { getContractWrappers } from "../services/contract_wrappers";
import { getTransactionOptions } from "../util/orders/order-creation";
//import { getWeb3Wrapper } from "../services/web3_wrapper";
import { toEther } from "../util/orders/tokens";
import {
  DEFAULT_GAS_PRICE,
  UNLIMITED_ALLOWANCE_IN_BASE_UNITS,
  ZERO
} from "../util/constants";
import Converter from "../components/wallet/Converter";
import LockNotification from "../components/notifications/Lock";

export default {
  components: {
    Converter,
    LockNotification
  },
  data() {
    return {
      contractWrappers: null,
      lockError: false,
      lockSuccess: false,
      showLockModal: false,
      title: "My Wallet",
      token: {},
      tokensHeader: [
        { text: "Icon", value: "icon", sortable: false },
        { text: "Token", value: "symbol" },
        { text: "Available Qty", value: "balance", align: "center" },
        { text: "USD Value", align: "center" },
        { text: "Change", align: "center" },
        { text: "Locked", value: "locked", align: "center", sortable: false }
      ],
      web3Wrapper: null
    };
  },
   created() {
    // this.$store.dispatch("FETCH_WALLET");
    // this.contractWrappers = await getContractWrappers();
    // this.web3Wrapper = await getWeb3Wrapper();
  },
  computed: {
    tokens: function() {
      return this.$store.getters.tokens.map(token => {
        return {
          ...token,
          balance: toEther(token.balance, token.displayDecimals),
          icon: `assets/icons/${token.symbol}.svg`
        };
      });
    }
  },
  methods: {
    handleLockClick(event) {
      this.lockError = false;
      this.lockSuccess = false;
      this.token = {};

      const { index } = event.currentTarget.dataset;
      const token = this.tokens[index];
      const ERC20Address = getAddressFromWallet(token);
      const erc20Token = new ERC20TokenContract(
        ERC20Address,
        this.contractWrappers.getProvider()
      );
      const amount = token.unlocked ? ZERO : UNLIMITED_ALLOWANCE_IN_BASE_UNITS;
      const ethAccount = this.$store.getters.coinbase;
      const web3 = this.$store.getters.web3Instance;

      this.showLockModal = true;
      this.token = token;

      erc20Token
        .approve(this.contractWrappers.contractAddresses.erc20Proxy, amount)
        .sendTransactionAsync({
          ...getTransactionOptions(DEFAULT_GAS_PRICE),
          from: ethAccount
        })
        .then(tx => {
          let interval = setInterval(() => {
            web3.eth.getTransactionReceipt(tx, (error, { blockHash } = {}) => {
              if (error) {
                clearInterval(interval);

                this.lockError = true;

                return;
              }

              if (blockHash) {
                const encodedERC20Address = assetDataUtils.encodeERC20AssetData(
                  ERC20Address
                );
                this.contractWrappers.devUtils
                  .getBalanceAndAssetProxyAllowance(
                    ethAccount,
                    encodedERC20Address
                  )
                  .callAsync()
                  .then(([balance, allowance]) => {
                    clearInterval(interval);

                    this.lockSuccess = true;

                    this.$store.dispatch("TOKEN_UPDATE", {
                      token: token.symbol,
                      update: {
                        allowance,
                        balance,
                        unlocked: allowance.isGreaterThan(0)
                      }
                    });
                  })
                  .catch(() => {
                    clearInterval(interval);

                    this.lockError = true;
                  });
              }
            });
          }, 1000);
        })
        .catch(() => {
          this.lockError = true;
        });
    },
    handleModalClose() {
      this.showLockModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.wallet-container {
  min-height: 91vh;
  background: var(--v-background-base);
}
.disconnect-button {
  border: var(--v-error-base) 0.5px solid;
  text-transform: capitalize;
  font-size: 14px;
}
.token-balances-title {
  color: var(--v-primary-base);
  font-size: 18px;
}
.v-data-table-header {
  background-color: var(--v-secondaryBack-base);
}
.wallet__lock__icon {
  cursor: pointer;
}
</style>
