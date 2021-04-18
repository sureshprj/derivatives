import Vue from "vue";
import Vuex from "vuex";
import market from "./modules/market";
import wallet from "./modules/wallet";
import state from "./state";
import getWeb3 from "../util/getWeb3";
import pollWeb3 from "../util/pollWeb3";
import getContract from "../util/getContract";
import { Orderbook } from "@0x/orderbook";
import { toEther } from "../util/orders/tokens";
import { BigNumber } from "@0x/utils";
import get from "lodash/get";
const api = require("../services/api");

export const strict = false;

/* import _ from 'lodash'; */

function reduceAddress(str) {
  let firstDigits = str.slice(0, 14);
  let lastDigits = str.slice(38, 42);
  return firstDigits + "..." + lastDigits.toUpperCase();
}

Vue.use(Vuex);
export default new Vuex.Store({
  strict: true,
  state,
  modules: {
    market,
    wallet
  },
  mutations: {
    registerWeb3Instance(state, payload) {
      let result = payload;
      let web3Copy = state.web3;
      web3Copy.coinbase = result.coinbase;
      web3Copy.networkId = result.networkId;
      web3Copy.balance = parseInt(result.balance, 10);
      web3Copy.isInjected = result.injectedWeb3;
      web3Copy.web3Instance = result.web3;
      state.web3 = web3Copy;
      pollWeb3();
      fetch(
        `https://api${
          state.web3.networkId == "42" ? "-kovan" : ""
        }.etherscan.io/api?module=account&action=txlist&address=${
          state.web3.coinbase
        }&startblock=0&endblock=99999999&sort=asc&apikey=IH2ECRV4W8F6N2ZCX3M1DDUJZYGJ5BT88Y`
      )
        .then(response => response.json())
        .then(data => {
          data.result.forEach(elem => {
            /*             elem.value = web3.fromWei(elem.value, "ether"); */
            elem.fromReduced = reduceAddress(elem.from);
            elem.toReduced = reduceAddress(elem.to);
          });
          state.web3.latestTransactions = data.result;
        });
      /*       state.web3.currentAccount = web3.eth.accounts[0]; */
    },
    pollWeb3Instance(state, payload) {
      state.web3.isCheckingTransaction = false;
      state.web3.coinbase = payload.coinbase;
      state.web3.balance = parseInt(payload.balance, 10);
    },
    registerContractInstance(state, payload) {
      state.contractInstance = () => payload;
    },
    changeTransactionStatus(state, payload) {
      state.web3.isCheckingTransaction = payload;
    },
    getOrdersAndOrderbook(state, payload) {
      const { buyOrders, sellOrders } = payload;

      state.utils.loadingOrders = true;
      state.utils.loadingOrderbook = true;
      state.tradePair.orderbook.items = [];
      state.user.orders = [];

      buyOrders.forEach(elem => {
        elem.transactionType = "buy";
        elem.price = elem.order.makerAssetAmount / elem.order.takerAssetAmount;
        if (elem.order.makerAddress == state.web3.coinbase) {
          state.user.orders.push(elem);
        }
      });

      buyOrders.sort(function(b, a) {
        return (
          parseFloat(a.order.makerAssetAmount / a.order.takerAssetAmount) -
          parseFloat(b.order.makerAssetAmount / b.order.takerAssetAmount)
        );
      });

      state.tradePair.orderbook.buy = buyOrders;

      sellOrders.forEach(elem => {
        elem.transactionType = "sell";
        elem.price = elem.order.takerAssetAmount / elem.order.makerAssetAmount;
        if (elem.order.makerAddress == state.web3.coinbase) {
          state.user.orders.push(elem);
        }
      });

      sellOrders.sort(function(b, a) {
        return (
          parseFloat(a.order.makerAssetAmount / a.order.takerAssetAmount) -
          parseFloat(b.order.makerAssetAmount / b.order.takerAssetAmount)
        );
      });

      state.tradePair.orderbook.sell = sellOrders;

      state.utils.loadingOrders = false;

      let orderbookItems = [];

      function sumSellOrders(arr) {
        var result = arr.reduce(function(acc, val) {
          var o = acc
            .filter(function(obj) {
              return obj.price == val.price;
            })
            .pop() || { price: val.price, amount: 0 };

          o.amount += parseInt(
            val.metaData.remainingFillableTakerAssetAmount *
              (val.order.makerAssetAmount / val.order.takerAssetAmount)
          );
          acc.push(o);
          return acc;
        }, []);

        var finalresult = result.filter(function(itm, i, a) {
          return i == a.indexOf(itm);
        });
        return finalresult;
      }

      function sumBuyOrders(arr) {
        var result = arr.reduce(function(acc, val) {
          var o = acc
            .filter(function(obj) {
              return obj.price == val.price;
            })
            .pop() || { price: val.price, amount: 0 };

          o.amount += parseInt(val.metaData.remainingFillableTakerAssetAmount);
          acc.push(o);
          return acc;
        }, []);

        var finalresult = result.filter(function(itm, i, a) {
          return i == a.indexOf(itm);
        });
        return finalresult;
      }

      let buyOrdersForOrderbook = sumBuyOrders(buyOrders);

      let sellOrdersForOrderbook = sumSellOrders(sellOrders);

      for (
        let i = 0;
        i < buyOrdersForOrderbook.length || i < sellOrdersForOrderbook.length;
        i++
      ) {
        orderbookItems[i] = {
          bidPrice: buyOrdersForOrderbook[i]
            ? buyOrdersForOrderbook[i].price
            : 0,
          bidSize: buyOrdersForOrderbook[i]
            ? buyOrdersForOrderbook[i].amount
            : 0,
          askPrice: sellOrdersForOrderbook[i]
            ? sellOrdersForOrderbook[i].price
            : 0,
          askSize: sellOrdersForOrderbook[i]
            ? sellOrdersForOrderbook[i].amount
            : 0
        };
      }

      state.tradePair.orderbook.items = orderbookItems;

      /*       state.tradePair.orderbook.items = orderbookItems; */
      state.utils.loadingOrderbook = false;

      let bidPercentage = buyOrders.reduce((porc, record) => {
        porc += parseFloat(record.order.takerAssetAmount);
        return porc;
      }, 0);
      let askPercentage = sellOrders.reduce((porc, record) => {
        porc += parseFloat(record.order.makerAssetAmount);
        return porc;
      }, 0);
      state.tradePair.orderbook.bidPercentage = bidPercentage;
      state.tradePair.orderbook.askPercentage = askPercentage;
    },
    getRecentTrades(state, payload) {
      state.tradePair.recentTrades = payload;
    },
    TRADE_PAIR(state, payload) {
      state.tradePair.id = payload.id;
      state.tradePair.lgBaseToken = payload.lgBaseToken;
      state.tradePair.lgQuoteToken = payload.lgQuoteToken;
      state.tradePair.baseToken = payload.baseToken;
      state.tradePair.baseTokenBalance = payload.baseTokenBalance;
      state.tradePair.quoteToken = payload.quoteToken;
      state.tradePair.quoteTokenBalance = payload.quoteTokenBalance;
      state.tradePair.data = {
        name: payload.data.name,
        lastPrice: payload.data.lastPrice,
        high24hs: payload.data.high24hs,
        low24hs: payload.data.low24hs,
        vol24hs: payload.data.vol24hs,
        baseTokenName: payload.data.baseTokenName,
        quoteTokenName: payload.data.quoteTokenName
      };
    },
    changeConnectDialogStatus(state, payload) {
      state.utils.connectDialog = payload;
    },
    orderbookLoader(state, payload) {
      state.utils.loadingRecentTrades = payload;
      state.utils.loadingOrderbook = payload;
      state.utils.loadingOrders = payload;
    },
    recentTradesLoader(state, payload) {
      state.utils.loadingRecentTrades = payload;
    }
  },
  actions: {
    registerWeb3({ commit }) {
      getWeb3
        .then(result => {
          commit("registerWeb3Instance", result);
        })
        .catch(e => {
          console.log("error in action registerWeb3", e);
        });
    },
    pollWeb3({ commit }, payload) {
      commit("pollWeb3Instance", payload);
    },
    getContractInstance({ commit }) {
      getContract
        .then(result => {
          commit("registerContractInstance", result);
        })
        .catch(e => console.log(e));
    },
    async getOrdersAndOrderbook({ commit }, payload) {
      commit("orderbookLoader", true);
      const orderbook = Orderbook.getOrderbookForWebsocketProvider({
        httpEndpoint: "https://apidex.emdx.io/sra/v3/",
        websocketEndpoint: "wss://apidex.emdx.io/sra/v3"
      });

      const buyOrders = await orderbook.getOrdersAsync(
        payload.lgBaseToken,
        payload.lgQuoteToken
      );

      const sellOrders = await orderbook.getOrdersAsync(
        payload.lgQuoteToken,
        payload.lgBaseToken
      );
      commit("getOrdersAndOrderbook", { buyOrders, sellOrders });
      commit("orderbookLoader", false);
    },
    getPairRecentTrades({ commit }, payload) {
      let trades;
      commit("recentTradesLoader", true);
      api.getPairRecentTrades(payload.base, payload.quote).then(res => {
        trades = res.data.data.results;
        commit("getRecentTrades", trades);
        commit("recentTradesLoader", false);
      });
    },
    SET_TRADE_PAIR({ commit, dispatch }, pair) {
      commit("TRADE_PAIR", pair);
      dispatch("getOrdersAndOrderbook", {
        lgBaseToken: pair.lgBaseToken,
        lgQuoteToken: pair.lgQuoteToken
      });
    }
  },
  getters: {
    balance: state => {
      const balance = get(state, "web3.balance") || 0;

      return new BigNumber(balance);
    },
    balanceInEth: (state, { balance }) => toEther(balance),
    coinbase: state => state.web3.coinbase,
    web3Instance: state => state.web3.web3Instance()
  }
});
