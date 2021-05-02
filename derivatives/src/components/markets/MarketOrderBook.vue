<template>
  <v-card class="f-20" color="primaryBack">
    <v-card-title class="card-title secondaryBack">
      <span class="font-size-14 main-title text-uppercase font-weight-bold"
        >Order book</span
      >

      <div>
        <label item-color="#fff" class="font-size-14 grey--text">Depth</label>
        <v-select
          background-color="selectBackground"
          class="font-size-14 ml-3 select-in-header"
          item-color="#fff"
          :items="[5, 10, 15, 20, 25, 50, 100]"
          :value="5"
          dense
          solo
          flat
          :full-width="false"
          hide-details
          color="emdxBlue"
        ></v-select>
      </div>
    </v-card-title>

    <div class="d-flex flex-row bookList">
      <v-simple-table
        class="primaryBack border-top"
        style="flex-basis: 100%"
        dense
        fixed-header
        height="202"
      >
        <template v-if="!loadingOrderbook" v-slot:default>
          <thead class="larger-header">
            <tr>
              <th class="orderbook-th secondaryBack text-no-wrap text-left">
                Amount (BTC)
              </th>
              <th class="orderbook-th secondaryBack text-center">
                Price (USDT)
              </th>
              <th class="orderbook-th secondaryBack text-no-wrap text-center">
                Price (USDT)
              </th>
              <th class="orderbook-th secondaryBack text-no-wrap text-right">
                Amount (BTC)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="borderless"
              v-for="(item, index) in orderbookItems"
              :key="index"
            >
              <td v-if="item.bidSize !== 0" class="text-no-wrap font-size-11">
                {{ fixedNumber(fromWei(item.bidSize)) }}
              </td>
              <td
                v-else
                class="text-no-wrap font-size-12 text-center error--text relative"
              ></td>
              <td
                v-if="item.bidSize !== 0"
                class="text-no-wrap font-size-12 text-center success--text relative"
                :style="{ cursor: 'pointer' }"
                v-on:click="setLimitPrice(item.bidPrice)"
              >
                <background-progress-bar
                  :size="bidPercentage"
                  :width="parseFloat(item.bidSize)"
                  positive
                ></background-progress-bar>
                <span class="absolute">{{ fixedNumber(item.bidPrice) }}</span>
              </td>
              <td
                v-else
                class="text-no-wrap font-size-12 text-center error--text relative"
              ></td>
              <td
                v-if="item.askSize !== 0"
                class="text-no-wrap font-size-12 text-center error--text relative"
              >
                <background-progress-bar
                  :size="askPercentage"
                  :width="parseFloat(item.askSize)"
                  left
                  negative
                ></background-progress-bar>
                <span
                  class="relative"
                  :style="{ cursor: 'pointer' }"
                  v-on:click="setLimitPrice(item.askPrice)"
                  >{{ fixedNumber(item.askPrice) }}</span
                >
              </td>
              <td
                v-else
                class="text-no-wrap font-size-12 text-center error--text relative"
              ></td>
              <td
                v-if="item.askSize !== 0"
                class="text-no-wrap font-size-12 text-right"
              >
                {{ fixedNumber(fromWei(item.askSize)) }}
              </td>
              <td
                v-else
                class="text-no-wrap font-size-12 text-center error--text relative"
              ></td>
            </tr>
          </tbody>
        </template>
        <template v-else v-slot:default>
          <div class="d-flex justify-center mt-4">
            <v-progress-circular
              indeterminate
              color="primary"
              size="50"
            ></v-progress-circular>
          </div>
        </template>
      </v-simple-table>
    </div>
  </v-card>
</template>

<script>
import Web3Utils from "web3-utils";
import BackgroundProgressBar from "@/components/markets/BackgroundProgressBar";
import { mapActions, mapState } from "vuex";
import { getNumberOfDecimalsSixChars } from "../../util/numbers";

/* import { Orderbook } from "@0x/orderbook" */

export default {
  name: "MarketOrderBook",
  props: ["orders"],
  components: {
    BackgroundProgressBar
  },
  data() {
    return {
      items: [],
      bidHeaders: [
        { text: "Size", value: "size" },
        { text: "Bid price", value: "price" }
      ],
      askHeaders: [
        { text: "Ask price", value: "price" },
        { text: "Size", value: "size" }
      ],
      headers: [
        { text: "Size", value: "bidSize" },
        { text: "Bid price", value: "bidPrice" },
        { text: "Ask price", value: "askPrice" },
        { text: "Size", value: "askSize" }
      ]
    };
  },

  computed: {
    ...mapState({
      orderbookItems: state => state.tradePair.orderbook.items,
      bidPercentage: state => state.tradePair.orderbook.bidPercentage,
      askPercentage: state => state.tradePair.orderbook.askPercentage,
      loadingOrderbook: state => state.utils.loadingOrderbook
    })
  },

  methods: {
    ...mapActions(["SET_LIMIT_PRICE"]),

    setLimitPrice(price) {
      this.SET_LIMIT_PRICE(price);
    },
    fromWei(number) {
      return Web3Utils.fromWei(String(number));
    },
    fixedNumber(number) {
      return parseFloat(number).toFixed(getNumberOfDecimalsSixChars(number));
    }
  }
  /*   async created() {

    const orderbook = Orderbook.getOrderbookForWebsocketProvider({
      httpEndpoint: "https://apidex.emdx.io/sra/v3/",
      websocketEndpoint: "wss://apidex.emdx.io/sra/v3"
    });

    const buyOrders = await orderbook.getOrdersAsync(
      "0xf47261b0000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c",
      "0xf47261b00000000000000000000000006fdad8993714c37e02eb929c81b93c397931fe51"
    );
    buyOrders.forEach(elem => {
      elem.transactionType = "buy";
    });
    const sellOrders = await orderbook.getOrdersAsync(
      "0xf47261b00000000000000000000000006fdad8993714c37e02eb929c81b93c397931fe51",
      "0xf47261b0000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c"
    );
    sellOrders.forEach(elem => {
      elem.transactionType = "sell";
    });

    const allOrders = [...buyOrders, ...sellOrders];

    console.log(allOrders)

        this.items = [];
        for (let i = 0; i < buyOrders.length || i < sellOrders.length; i++) {
          this.items[i] = {
            bidPrice: buyOrders[i] ? (buyOrders[i].order.makerAssetAmount / buyOrders[i].order.takerAssetAmount).toFixed(5) : 0,
            bidSize: buyOrders[i] ? buyOrders[i].order.takerAssetAmount : 0,
            askPrice: sellOrders[i] ? (sellOrders[i].order.takerAssetAmount / sellOrders[i].order.makerAssetAmount).toFixed(5) : 0,
            askSize: sellOrders[i] ? sellOrders[i].order.makerAssetAmount : 0,
          };
        }

        this.bidPorcentage = buyOrders.reduce((porc, record) => {
          porc += parseFloat(record.order.takerAssetAmount);
          return porc;
        }, 0);

        this.askPorcentage = sellOrders.reduce((porc, record) => {
          porc += parseFloat(record.order.makerAssetAmount);
          return porc;
        }, 0);
  } */
};
</script>

<style scoped>
/* overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* select min width */
.select-in-header {
  display: inline-block;
  width: min-content;
}

/* CARDS */
.card-title {
  padding-bottom: 6px;
  padding-top: 8px;
  margin: 0;
  line-height: 2em;
  display: flex;
  justify-content: space-between;
}

.card-title .main-title {
  color: var(--v-emdxBlue-base);
}

.custom-list-wrapper {
  display: flex;
  justify-content: space-between;
}

.divider {
  margin: 0 16px;
}

.larger-header th {
  height: 38px !important;
}

.table-input-text {
  max-width: 80px;
  top: 1px;
}

.v-select__selections input {
  display: none;
}

.v-data-table.v-data-table--fixed-header thead th {
  border-top: 1px solid hsla(0, 0%, 100%, 0.12);
  box-shadow: none;
  font-size: 14px;
  font-weight: normal;
}

.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover {
  background: var(--v-backgroundHeader-base) !important;
}

.border-top-color {
  border-top: 1px solid var(--v-borderColor-base);
}

.border-right-color {
  border-right: 1px solid var(--v-borderColor-base);
}

.background-header-dark {
  background-color: var(--v-backgroundHeader-base) !important;
}

.background-body-dark {
  background-color: var(--v-backgroundBody-base) !important;
}

.width-auto {
  width: auto !important;
}

.width-20 {
  width: 20%;
}
.v-select__selections input {
  width: 0;
}

.menu-search-input .v-input__append-inner {
  margin-top: 4px !important;
}
.bookList {
  overflow-x: hidden;
}
.orderbook-th {
  font-size: 11px !important;
  border-top: 1px solid var(--v-primaryBack-base) !important;
}
.border-top {
  border: red solid 1px !important;
}
</style>
