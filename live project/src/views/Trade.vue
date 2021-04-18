<template>
  <div style="height: 100%">
    <InstrumentTabs />
    <v-container fluid>
      <v-row dense>
        <v-col cols="12" :md="chartOnFullscreen ? 9 : 7">
          <market-chart
            :symbol="symbol"
            :instruments="instruments"
            :timeframe="timeframe"
            :compression="compression"
            :pairData="pairData"
            @updateTimeframe="updateTimeframe"
            @updateCompression="updateCompression"
            @updateChartsize="updateChartsize"
          >
          </market-chart>
        </v-col>

        <v-col cols="12" :md="chartOnFullscreen ? 3 : 5">
          <v-row class="pa-0 rowFullHeight" dense>
            <v-col class="py-0" :md="chartOnFullscreen ? 12 : 7" sm="12">
              <v-card auto class="flexcard" height="100%" color="primaryBack">
                <v-spacer></v-spacer>
                <market-order-form
                  v-if="instrument"
                  :createOrderFunction="createOrder"
                  :symbol="symbol"
                ></market-order-form>

                <!--                 <market-account-report></market-account-report> -->

                <!--                 <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    small
                    color="emdxBlue"
                    class="font-weight-bold"
                    to="/holdings"
                  >
                    + add funds
                  </v-btn>
                </v-card-actions> -->
              </v-card>
            </v-col>

            <v-col
              class="py-0"
              :style="{ 'margin-top': chartOnFullscreen ? '10px' : 0 }"
              :md="chartOnFullscreen ? 12 : 5"
              sm="12"
            >
              <market-instrument-description
                :symbol="symbol"
                :instrument="instrument"
                :recentTrades="recentTrades"
                :showRecentTrades="chartOnFullscreen"
                :recentTradesList="recentTradesList"
                class="rowFullHeight"
                v-model="recentTrades"
              ></market-instrument-description>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-show="!chartOnFullscreen" dense class="mt-2">
        <v-col cols="12" md="7">
          <market-positions-and-orders-lists
            v-if="instrument"
            :userOrders="userOrders"
            :positions="positions"
            :symbol="symbol"
            :currency="instrument.quote"
            :createOrderFunction="createOrder"
            :updateOrderFunction="updateOrder"
            :cancelOrderFunction="cancelOrder"
            :showSnackbar="showSnackbar"
            :activeOrders="activeOrders"
            :filledOrders="filledOrders"
            :orderHistory="orderHistory"
            :updateMarketData="updateMarketData"
          ></market-positions-and-orders-lists>
        </v-col>

        <v-col cols="12" md="5">
          <market-order-book :orders="orderbook"> </market-order-book>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import json from "@/assets/candles.json";
import InstrumentTabs from "../components/trade/InstrumentTabs";

import MarketOrderBook from "@/components/markets/MarketOrderBook";
/* import MarketAccountReport from "@/components/markets/MarketAccountReport"; */
import MarketInstrumentDescription from "@/components/markets/MarketInstrumentDescription";
import MarketPositionsAndOrdersLists from "@/components/markets/MarketPositionsAndOrdersLists";
import MarketChart from "@/components/markets/MarketChart.vue";
import MarketOrderForm from "@/components/markets/MarketOrderForm.vue";

/* import { Orderbook } from "@0x/orderbook"; */
import { mapActions, mapState } from "vuex";

export default {
  name: "Home",
  components: {
    MarketOrderBook,
    InstrumentTabs,
    MarketChart,
    MarketOrderForm,
    /*         MarketAccountReport, */
    MarketPositionsAndOrdersLists,
    MarketInstrumentDescription
  },
  data() {
    return {
      instrument: {
        base: "BTC",
        contractSize: 0.0001,
        feeMaker: 0.00025,
        feeTaker: 0.00075,
        last24hsHigh: 36700.428,
        last24hsLow: 35384.72,
        last24hsVolume: 80246,
        margin: 1000,
        marketId: "btcusd",
        maturityDate: "2021-12-30T00:00:00.000Z",
        percentChange: -3.7182942241735946,
        precision: 4,
        quote: "USD"
      },
      instruments: [
        {
          base: "BTC",
          category: "cryptocurrency",
          contractSize: 0.0001,
          createdAt: "2021-01-11T12:31:18.313Z",
          diff24hs: -1315.7079999999987,
          high24hs: 36700.428,
          info:
            "Monthly Fixed Maturity Future Contract on BTC, quoted in USD with expiration date on Nov 20th 2020, cash settled, with collateral in USD and payoff in USD stablecoin.",
          isEnabled: true,
          last24hs: 35384.72,
          low24hs: 35384.72,
          margin: 1000,
          marketId: "btcusd",
          marketPrice: 35384.72,
          maturityDate: "2021-12-30T00:00:00.000Z",
          open24hs: 36700.428,
          percentChange: -3.7182942241735946,
          symbol: "IEMDX/WETH",
          type: "future",
          updatedAt: "2021-01-11T12:31:18.313Z",
          volume24hs: 80246,
          __v: 0,
          _id: "5ffc94a92739ab4132771622"
        }
      ],
      ohlcv: json.data,
      timeframe: "5d",
      compression: "15",
      symbol: "IEMDX/WETH",
      instrumentsSeparated: [],
      instrumentsKeys: [],
      orderHistory: [],
      activeOrders: [],
      filledOrders: [],

      bid: [],
      ask: [],
      bidPorcentage: 0,
      askPorcentage: 0,
      recentTradesList: 0,

      positions: {},
      snackbars: [],
      recentTrades: [
        {
          lastPx: 19304,
          lastQty: 2330,
          size: 1350,
          date: "20-04-2020"
        }
      ],

      chartOnFullscreen: false,

      cronJob: null,

      updateOrderDialog: false
    };
  },
  computed: {
    ...mapState({
      orderbook: state => state.tradePair.orderbook,
      userOrders: state => state.user.orders,
      pairData: state => state.tradePair.data,
      tradePair: state => state.tradePair
    })
  },
  methods: {
    updateTimeframe() {},
    updateCompression() {},
    updateChartsize() {},
    createOrder() {},
    updateOrder() {},
    cancelOrder() {},
    showSnackbar() {},
    updateMarketData() {},
    ...mapActions(["SET_TRADE_PAIR"]),

    getOrdersAndOrderbookDispatch() {
      this.$store.dispatch("getOrdersAndOrderbook", {
        lgQuoteToken: this.tradePair.lgQuoteToken,
        lgBaseToken: this.tradePair.lgBaseToken
      });
    }
  },
  watch: {
    tradePair: function() {
      this.getOrdersAndOrderbookDispatch();
    }
  },
  async created() {
    // MAKE RANDOM RECENT TRADES
    this.recentTrades = [
      {
        lastPx: 1135.42,
        lastQty: 0.1322,
        size: 0.01023,
        date: 1611293099069.025
      }
    ];
    function randomNumber(minimum, maximum) {
      return Math.random() * (maximum - minimum) + minimum;
    }

    for (let i = 1; i < 18; i++) {
      this.recentTrades[0].date = new Date();
      this.recentTrades[i] = {
        lastPx: randomNumber(
          this.recentTrades[0].lastPx - 1.2,
          this.recentTrades[0].lastPx + 3.8
        ).toFixed(2),
        lastQty: randomNumber(
          this.recentTrades[0].lastQty,
          this.recentTrades[0].lastQty + 0.01
        ).toFixed(5),
        size: randomNumber(
          this.recentTrades[0].size - 0.009,
          this.recentTrades[0].size + 0.07
        ).toFixed(5),
        date: this.recentTrades[i - 1].date - 32040
      };
    }

    /*     const orderbook = Orderbook.getOrderbookForWebsocketProvider({
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
        const orders = apiOrders.map(o => o.order);
    this.userOrders = [...buyOrders, ...sellOrders];

    console.log("Ordenes: ", this.userOrders); */

    // WebSockets Connection

    /*     const wsConnection = new WebSocket("wss://apidex.emdx.io/sra/v3");

    const connectionData = {
      type: "subscribe",
      channel: "orders",
      requestId: "123e4567-e89b-12d3-a456-426655440000"
    };

    wsConnection.onopen = function() {
      wsConnection.send(JSON.stringify(connectionData));
    };

    wsConnection.onmessage = function(event) {
      let data = JSON.parse(event.data);
      console.log(data.payload[0]);
      if (data.payload[0].order.makerAddress) {
        this.userOrders = data.payload[0].order;
      } else {
        console.log("Nueva order que no es del usuario", data.payload[0].order);
      }
    }; */

    // WebSocket Connection with Library

    /* ordersChannelFactory.createWebSocketOrdersChannelAsync("wss://apidex.emdx.io/sra/v3") */
  }
};
</script>
