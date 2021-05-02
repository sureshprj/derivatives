<template>
  <div
    class="d-flex instrumentsList py-2 pb-0"
    grow
    background-color="background"
    height="40"
  >
    <div v-for="(item, index) in tokens" :key="index">
      <div
        :data-base="item.base.symbol"
        :data-quote="item.quote.symbol"
        @click="handlePairClick"
        class="d-flex align-center justify-space-between py-1 instrumentTab"
      >
        <div
          :class="
            item.base.symbol + '/' + item.quote.symbol ==
            $store.state.tradePair.data.baseTokenName +
              '/' +
              $store.state.tradePair.data.quoteTokenName
              ? 'instrumentActiveSuccess px-5 py-1 pl-8'
              : 'px-5 py-1 pl-8'
          "
        >
          <span class="instrumentList">{{ item.base.symbol }}</span>
          <span class="instrumentList grey--text"
            >/{{ item.quote.symbol }}</span
          >
          <span class="instrumentList pl-2">{{ item.price }}</span>
          <span class="instrumentList pl-2">
            <styled-percentage
              :number="item.percentChange"
              :up="up(item.percentChange)"
            ></styled-percentage>
          </span>
        </div>
        <!-- <span class="instrumentList"
          ><styled-text :text="item.symbol"></styled-text
        ></span> -->

        <v-divider
          v-if="tokens.indexOf(item) !== tokens.length - 1"
          vertical
        ></v-divider>
      </div>
    </div>
  </div>
</template>

<script>
// import { assetDataUtils } from "@0x/order-utils";
// import { CHAIN_ID as chainId } from "../../util/constants/main";
//import { getContractWrappers } from "../../services/contract_wrappers";
import { getPairs } from "../../services/api";
//import { getWeb3Wrapper } from "../../services/web3_wrapper";
import { mapActions, mapState } from "vuex";
//import { Web3ProviderEngine, MetamaskSubprovider } from "@0x/subproviders";
import noop from "lodash/noop";
import StyledPercentage from "../utils/StyledPercentage";
//import Web3Utils from "web3-utils";

export default {
  components: {
    StyledPercentage
  },
  data() {
    return {
      tokens: []
    };
  },
  computed: {
    ...mapState({
      pairData: state => state.tradePair.data,
      coinbase: state => state.web3.coinbase
    })
  },
  methods: {
    up(number) {
      switch (Math.sign(number)) {
        case 0:
        case 1:
          return true;
        case -1:
          return false;
      }
    },
    ...mapActions(["SET_TRADE_PAIR", "getPairRecentTrades"]),

    handlePairClick(event) {
      const { base, quote } = event.currentTarget.dataset;

      this.$router.push(`/${base}/${quote}`);
      //this.setTradePair(base, quote);
    },
    async setTradePair(base, quote) {
      return Promise.resolve({base,quote});
      // let baseToken;
      // let quoteToken;
      // let id;

      // this.tokens.forEach(elem => {
      //   if (elem.base.symbol == base) {
      //     baseToken = elem.base.addresses[0][chainId];
      //     /*           baseTokenAssetData = elem.base.assetData; */
      //   }
      //   if (elem.quote.symbol == quote) {
      //     quoteToken = elem.quote.addresses[0][chainId];
      //     /*           quoteTokenAssetData = elem.quote.assetData; */
      //   }
      //   if (elem.quote.symbol == quote && elem.base.symbol == base) {
      //     id = elem.id;
      //   }
      // });

      // const baseAssetData = assetDataUtils.encodeERC20AssetData(baseToken);
      // const quoteAssetData = assetDataUtils.encodeERC20AssetData(quoteToken);

      // const providerEngine = new Web3ProviderEngine();
      // const web3Wrapper = await getWeb3Wrapper();

      // providerEngine.addProvider(
      //   new MetamaskSubprovider(web3Wrapper.getProvider())
      // );
      // providerEngine.start();
      // const contractWrappers = await getContractWrappers();

      // const makerAccounts = await web3Wrapper.getAvailableAddressesAsync();
      // const coinbase = makerAccounts[0];

      // const rawBaseBalance = await contractWrappers.devUtils
      //   .getBalance(coinbase, baseAssetData)
      //   .callAsync();
      // const baseTokenBalance = Web3Utils.fromWei(String(rawBaseBalance));

      // const rawQuoteBalance = await contractWrappers.devUtils
      //   .getBalance(coinbase, quoteAssetData)
      //   .callAsync();
      // const quoteTokenBalance = Web3Utils.fromWei(String(rawQuoteBalance));

      // this.SET_TRADE_PAIR({
      //   id,
      //   baseToken,
      //   quoteToken,
      //   baseTokenBalance,
      //   quoteTokenBalance,
      //   lgBaseToken: baseAssetData,
      //   lgQuoteToken: quoteAssetData,
      //   data: {
      //     baseTokenName: base,
      //     quoteTokenName: quote,
      //     lastPrice: 30100,
      //     high24hs: 30200,
      //     low24hs: 29100,
      //     vol24hs: 540050
      //   }
      // });

      // this.getPairRecentTrades({ base, quote });
    }
  },
  created() {
    const params = this.$router.currentRoute.params;
    const base = params.base || "iemdx";
    const quote = params.quote || "weth";

    this.$router.push(`/${base}/${quote}`).catch(noop);

    getPairs().then(res => {
      this.tokens = res.data.data.results;
      this.setTradePair(base, quote);
    });
  }
};
</script>

<style scoped>
/* TABS */
.tab {
  border-right: 1px solid var(--v-primaryBack-base);
}
.tab:last-child {
  border-right: 0;
}
.instrumentList {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
}
.theme--dark.v-list {
  background-color: #1d252f;
  box-shadow: 0px 4px 20px 0px #000000 50%;
  font-weight: 600;
  padding: 0px;
}
.theme--light.v-list {
  background-color: var(--v-secondaryBack-base);
  box-shadow: 0px 4px 20px 0px #000000 50%;
  font-weight: 600;
  padding: 0px;
}
.itemList {
  border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
}
.itemList:last-child {
  border-bottom: 0px;
}

.instrumentsList {
  overflow-x: scroll;
  justify-content: center;
}
@media (max-width: 768px) {
  .instrumentsList {
    justify-content: start;
  }
}
.instrumentsList::-webkit-scrollbar {
  display: none;
}
.instrumentActiveSuccess {
  background: rgba(0, 128, 0, 0.1);
  border-bottom: 1px solid var(--v-success-base);
}
.instrumentActiveError {
  background: rgba(255, 0, 0, 0.1);
  border-bottom: 1px solid var(--v-error-base);
}
.instrumentsList {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
