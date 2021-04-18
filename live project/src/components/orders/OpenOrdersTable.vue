<template>
  <v-simple-table class="primaryBack border-top" fixed-header>
    <template v-if="!loadingOrders" v-slot:default>
      <thead class="larger-header">
        <tr>
          <th class="secondaryBack orderbook-th text-no-wrap">Market</th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Side
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Price (USDT)
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Quantity
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Amount (ETH)
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Total (USDT)
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Filled
          </th>
          <th class="secondaryBack orderbook-th text-no-wrap text-center">
            Action
          </th>
        </tr>
      </thead>

      <tbody class="borderless">
        <tr
          class="text-center"
          v-for="(item, index) in userOrdersAllTokens.slice().reverse()"
          :key="index"
        >
          <td class="text-left text-uppercase">
            {{ item.base + "/" + item.quote }}
          </td>
          <td
            :class="
              item.transactionType == 'buy'
                ? 'success--text text-uppercase'
                : 'error--text text-uppercase'
            "
          >
            {{ item.transactionType }}
          </td>
          <td v-if="item.transactionType == 'buy'">
            {{
              (
                item.order.makerAssetAmount / item.order.takerAssetAmount
              ).toFixed(5)
            }}
          </td>
          <td v-else>
            {{
              (
                item.order.takerAssetAmount / item.order.makerAssetAmount
              ).toFixed(5)
            }}
          </td>
          <td v-if="item.transactionType == 'buy'">
            {{ fromWei(item.order.takerAssetAmount) }}
          </td>
          <td v-else>{{ fromWei(item.order.makerAssetAmount) }}</td>
          <td>
            {{
              fromWei(
                (item.order.makerAssetAmount / item.order.takerAssetAmount) *
                  item.order.takerAssetAmount
              ).toFixed(5)
            }}
          </td>
          <td v-if="item.transactionType == 'buy'">
            {{ parseInt(item.order.takerAssetAmount) / 1000000000000 }}
          </td>
          <td v-else>
            {{ parseInt(item.order.makerAssetAmount) / 1000000000000 }}
          </td>
          <td>
            {{
              parseFloat(
                ((item.order.takerAssetAmount -
                  item.metaData.remainingFillableTakerAssetAmount) *
                  100) /
                  item.order.takerAssetAmount
              ).toFixed(2)
            }}%
          </td>
          <td class="d-flex align-center justify-space-around">
            <v-btn @click="cancelOrder(item.order)" x-small text>
              <v-icon color="error" size="16">mdi-close</v-icon>
            </v-btn>
          </td>
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
</template>

<script>
const api = require("../../services/api");
import { mapState } from "vuex";
import Web3Utils from "web3-utils";

export default {
  data() {
    return {
      userOrdersAllTokens: [],
      loadingOrders: false
    };
  },
  computed: {
    ...mapState({
      coinbase: state => state.web3.coinbase
    })

    /*     pairUserOrders() {
        return this.$store.state.user.orders
    } */
  },
  methods: {
    fromWei(number) {
      return parseFloat(Web3Utils.fromWei(number));
    },
    getUserOrdersAllTokens() {
      this.loadingOrders = true;
      let tokens = [];
      let pairs = [];

      fetch(`./config.json`)
        .then(response => response.json())
        .then(data => {
          tokens = data.tokens;
          pairs = data.pairs;
          console.log("Pares: ", pairs);
        });

      api.getAllTokensUserOrders(this.coinbase).then(data => {
        let orders = data.data.records;
        for (let i = 0; i < orders.length; i++) {
          let orderBaseToken =
            "0x" + orders[i].order.makerAssetData.substring(34);
          let orderQuoteToken =
            "0x" + orders[i].order.takerAssetData.substring(34);

          for (let y = 0; y < tokens.length; y++) {
            if (orderBaseToken == tokens[y].addresses[42]) {
              orders[i].base = tokens[y].symbol;
            }
            if (orderQuoteToken == tokens[y].addresses[42]) {
              orders[i].quote = tokens[y].symbol;
            }
          }

          pairs.forEach(elem => {
            console.log(elem.base, orders[i].base);
            if (orders[i].base == elem.base && orders[i].quote == elem.quote) {
              orders[i].transactionType = "sell";
            } else if (
              orders[i].quote == elem.base &&
              orders[i].base == elem.quote
            ) {
              orders[i].transactionType = "buy";
              orders[i].quote = elem.quote;
              orders[i].base = elem.base;
            }
          });
        }
        this.userOrdersAllTokens = orders;
      });
      this.loadingOrders = false;
    }
  },
  watch: {
    coinbase: async function() {
      this.getUserOrdersAllTokens();
    }
  },
  mounted() {
    if (this.coinbase != null) {
      this.getUserOrdersAllTokens();
    }
  }
};
</script>

<style lang="scss" scoped></style>
