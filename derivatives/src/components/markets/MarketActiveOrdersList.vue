<template>
  <div>
    <v-simple-table
      class="primaryBack border-top"
      dense
      fixed-header
      height="198"
    >
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
            v-for="(item, index) in pairUserOrders.slice().reverse()"
            :key="index"
          >
            <td class="text-left">IEMDX/WETH</td>
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
              {{ fromWei(item.order.takerAssetAmount) }}
            </td>
            <td v-else>
              {{ fromWei(item.order.makerAssetAmount) }}
            </td>
            <td>
              {{
                parseInt(
                  ((item.order.takerAssetAmount -
                    item.metaData.remainingFillableTakerAssetAmount) *
                    100) /
                    item.order.takerAssetAmount
                )
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
    <v-dialog v-model="updateOrderDialog" persistent max-width="350">
      <v-card
        class="card-rounded-0 d-flex justify-space-between align-center"
        color="primaryBack"
      >
        <v-card-title class="dialog-header">Update active order</v-card-title>

        <v-btn icon color="#888d92" @click="updateOrderDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>

      <v-card class="card-rounded-0 divider-bottom" color="lightBack px-4 py-6">
        <v-row class="px-4 py-2">
          <v-col cols="3" class="d-flex align-center pa-0">
            <span class="order-form-label">Current price</span>
          </v-col>
          <v-col cols="7" class="py-1">
            <v-text-field
              v-model.number="updatedOrder.price"
              required
              class="font-size-14 rounded-0"
              background-color="primaryBack"
              solo
              flat
              dense
              hide-details
              height="34"
              color="emdxBlue"
              readonly
              suffix="USD"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="px-4 py-2">
          <v-col cols="3" class="d-flex align-center pa-0">
            <span class="order-form-label">New price</span>
          </v-col>
          <v-col cols="7" class="py-1">
            <v-text-field
              v-model.number="updatedOrder.newPrice"
              required
              class="font-size-14 rounded-0 ml-0 mb-0"
              background-color="selectBackground"
              solo
              flat
              dense
              hide-details
              height="34"
              color="emdxBlue"
              suffix="USD"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-icon
              class="pa-1"
              size="20"
              color="secondaryColor"
              @click="plusButtonFunction(updatedOrder.newPrice, 'newPrice')"
              >mdi-plus</v-icon
            >
            <v-icon
              class="pa-1"
              size="20"
              color="secondaryColor"
              @click="minusButtonFunction(updatedOrder.newPrice, 'newPrice')"
              >mdi-minus</v-icon
            >
          </v-col>
        </v-row>
        <v-row class="px-4 py-2">
          <v-col cols="3" class="d-flex align-center pa-0">
            <span class="order-form-label">Quantity</span>
          </v-col>
          <v-col cols="7" class="py-1">
            <v-text-field
              v-model.number="updatedOrder.quantity"
              required
              class="font-size-14 rounded-0 ml-0 mb-0"
              background-color="selectBackground"
              solo
              flat
              dense
              hide-details
              height="34"
              color="emdxBlue"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center">
            <v-icon
              class="pa-1"
              size="20"
              color="secondaryColor"
              @click="plusButtonFunction(updatedOrder.quantity, 'quantity')"
              >mdi-plus</v-icon
            >
            <v-icon
              class="pa-1"
              size="20"
              color="secondaryColor"
              @click="minusButtonFunction(updatedOrder.quantity, 'quantity')"
              >mdi-minus</v-icon
            >
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>

      <v-card class="card-rounded-0 pa-4 pt-0 d-flex" color="lightBack">
        <v-btn
          color="#2d3845"
          class="flex-grow-1 btn-dialog-custom"
          @click="updateOrderDialog = false"
          >Cancel</v-btn
        >
        <v-btn
          class="flex-grow-1 ml-2 btn-dialog-custom text-uppercase"
          color="primary"
          @click="
            updateOrder(
              updatedOrder.id,
              updatedOrder.quantity,
              updatedOrder.newPrice
            )
          "
          :loading="updatingOrder"
          >Update Order</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* const api = require("../../services/api"); */
const utils = require("../../lib/utils");
import { mapState } from "vuex";
import Web3Utils from "web3-utils";

const Orders = require("../../util/orders/order-creation");

export default {
  name: "MarketActiveOrdersList",
  props: [
    "orders",
    "updateMarketData",
    "cancelOrderFunction",
    "updateOrderFunction",
    ""
  ],
  data() {
    return {
      updateOrderDialog: false,
      updatingOrder: false,
      updatedOrder: {
        id: "",
        quantity: null,
        price: null
      },
      loadingData: false
    };
  },

  methods: {
    filledPercentage(qty, cumQty) {
      const percentage = (cumQty * 100) / qty;
      return utils.formatNumber(percentage);
    },
    formatDate(date) {
      // FIXME: Ugly fix until feeC get trades from redis
      if (typeof date === "number") return utils.formatTimestamp(date);
      else return utils.formatDate(date, "YYYYMMDD-HH:mm:ss");
    },
    goTo(path) {
      this.$router.push(path);
    },
    openUpdateOrderDialog(orderId, price, quantity, newPrice) {
      this.updatedOrder = {
        id: orderId,
        price,
        quantity,
        newPrice
      };
      this.updatedOrder.newPrice = price;
      this.updateOrderDialog = true;
    },
    async updateOrder(orderId, quantity, price) {
      this.updatingOrder = true;
      await this.updateOrderFunction(orderId, quantity, price);
      setTimeout(() => {
        this.updateOrderDialog = false;
        this.updatingOrder = false;
      }, 1500);
    },

    plusButtonFunction(number, type) {
      number += number * 0.05;
      this.updatedOrder[type] = parseInt(number);
    },

    minusButtonFunction(number, type) {
      number -= number * 0.05;
      this.updatedOrder[type] = parseInt(number);
    },

    fromWei(number) {
      return parseFloat(Web3Utils.fromWei(String(number)));
    },
    async cancelOrder(order) {
      const cancelOrder = async () => await Orders.cancelSignedOrder(order);
      cancelOrder().then(res => {
        this.$store.dispatch("getOrdersAndOrderbook", {
          lgQuoteToken: this.$store.state.tradePair.lgQuoteToken,
          lgBaseToken: this.$store.state.tradePair.lgBaseToken
        });
        console.log(res);
      });
    }
  },
  computed: {
    ...mapState({
      coinbase: state => state.web3.coinbase,
      pairUserOrders: state => state.user.orders,
      loadingOrders: state => state.utils.loadingOrders
    })
  }
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

/* tabla */
.borderless td {
  border-bottom: 0 !important;
}

.table-input-text {
  max-width: 80px;
  top: 1px;
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

.secondaryBack {
  background-color: var(--v-backgroundHeader-base) !important;
}

.background-body-dark {
  background-color: var(--v-backgroundBody-base) !important;
}
.border-top {
  border: red solid 1px !important;
}
</style>
