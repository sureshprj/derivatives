<template>
  <v-card color="primaryBack">
    <v-tabs
      height="56"
      background-color="secondaryBack"
      slider-color="success"
      color="primaryColor"
      class="elevation-1"
    >
      <!-- <v-tab href="#tab-open-positions">
        <v-badge
          v-if="Object.keys(positions).length !== 0"
          offset-x="3"
          offset-y="7"
          overlap
          color="green"
          :content="Object.keys(positions).length"
          >Open Positions</v-badge
        >
        <span v-if="Object.keys(positions).length === 0">Open Positions</span>
      </v-tab> -->

      <v-tab href="#tab-active-orders" class="tab-item">
        <!--         <v-badge
          v-if="Object.keys(userOrders).length !== 0"
          offset-x="3"
          offset-y="7"
          overlap
          color="green"
          transition="scale-rotate-transition"
          :content="userOrders.length"
          >Open Orders</v-badge
        > -->
        <span class="tab-item">Open Orders</span>
        <div v-if="userOrders.length !== 0" class="badge">
          {{ userOrders.length }}
        </div>
      </v-tab>
      <v-tab href="#tab-filled-orders" class="tab-item">Filled Orders</v-tab>
      <v-tab href="#tab-order-history" class="tab-item">Order History</v-tab>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-btn class="mr-2 cancel-all-button" text x-small color="error"
          >Cancel all</v-btn
        >
      </div>

      <v-tab-item value="tab-open-positions">
        <market-position
          v-if="positions !== {}"
          :positions="positions"
          :symbol="symbol"
          :currency="currency"
          :createOrderFunction="createOrderFunction"
        ></market-position>
      </v-tab-item>

      <v-tab-item value="tab-active-orders">
        <market-active-orders-list
          :orders="userOrders"
          :updateMarketData="updateMarketData"
          :cancelOrderFunction="cancelOrderFunction"
          :updateOrderFunction="updateOrderFunction"
        ></market-active-orders-list>
      </v-tab-item>

      <v-tab-item value="tab-filled-orders">
        <market-orders-list :orders="filledOrders"></market-orders-list>
      </v-tab-item>

      <v-tab-item value="tab-order-history">
        <market-orders-list :orders="orderHistory"></market-orders-list>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import MarketActiveOrdersList from "@/components/markets/MarketActiveOrdersList";
import MarketOrdersList from "@/components/markets/MarketOrdersList";
import MarketPosition from "@/components/markets/MarketPosition";

export default {
  name: "MarketPositionsAndOrdersLists",
  props: [
    "positions",
    "symbol",
    "currency",
    "createOrderFunction",
    "updateOrderFunction",
    "cancelOrderFunction",
    "showSnackbar",
    "activeOrders",
    "filledOrders",
    "orderHistory",
    "updateMarketData",
    "userOrders"
  ],
  components: {
    MarketActiveOrdersList,
    MarketOrdersList,
    MarketPosition
  }

  /*   created: async function() {
    this.$socket.client.off("ER");
    this.$socket.client.emit("ER");
    this.$socket.client.on("ER", (data) => {
      if (data) {
        console.log("EXECUTION REPORT RECEIVED: ", data);
        let index;
        let newOrder = {
          clOrdId: data.order.header.clientOrderId,
          transactTime: data.timestamp,
          instrumentId: { symbol: data.symbol.name },
          side: data.order.header.side,
          ordType: data.order.header.type,
          price:
            data.order.header.type === "STOP_LIMIT"
              ? data.order.limitPrice
              : data.order.price,
          stopPrice:
            data.order.header.type === "STOP_LIMIT" ? data.order.stopPx : null,
          orderQty: data.order.size,
          cumQty: data.order.size - data.order.remainingSize,
          text: data.text,
          status: data.order.status,
        };

        if (data.execType == "CANCELED") {
          // Remove the order from the active list
          const clientOrderId = data.originalClientOrderId
            ? data.originalClientOrderId
            : data.order.header.clientOrderId;
          index = this.activeOrders.findIndex(
            (e) => e.clOrdId == clientOrderId
          );
          if (index >= 0) this.$delete(this.activeOrders, index);
        } else if (data.execType == "NEW") {
          // Add new order to de active list
          index = this.activeOrders.findIndex(
            (e) => e.clOrdId == data.order.header.clientOrderId
          );
          if (index === -1)
            this.$set(this.activeOrders, this.activeOrders.length, newOrder);
        } else if (data.execType == "REPLACED") {
          index = this.activeOrders.findIndex(
            (e) => e.clOrdId == data.order.header.clientOrderId
          );
          if (index >= 0) this.$delete(this.activeOrders, index);
          if (index === -1)
            this.$set(this.activeOrders, this.activeOrders.length, newOrder);
        } else if (data.execType == "TRADE") {
          // Update or delete order in active list
          index = this.activeOrders.findIndex(
            (e) => e.clOrdId == data.order.header.clientOrderId
          );

          if (data.order.filled) {
            this.$delete(this.activeOrders, index);
          } else if (index === -1) {
            this.$set(this.activeOrders, this.activeOrders.length, newOrder);
          } else {
            this.$set(this.activeOrders, index, newOrder);
          }
          // Update or create order in filled list
          index = this.filledOrders.findIndex(
            (e) => e.clOrdId == data.order.header.clientOrderId
          );
          let filledOrder = { ...newOrder };
          filledOrder.price = data.order.lastPrice;
          filledOrder.orderQty = data.order.lastSize;
          this.$set(this.filledOrders, this.filledOrders.length, filledOrder);
          // Update positions
          this.updateMarketData();
        }
        // Add entry in history list
        let historyOrder = { ...newOrder };
        historyOrder.price = data.order.lastPrice;
        historyOrder.orderQty = data.order.lastSize;
        this.$set(this.orderHistory, this.orderHistory.length, historyOrder);
        // Show notification
        this.showSnackbar(newOrder);
        this.updateMarketData();
      }
    });
  }, */
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
.tab-item {
  font-size: 13px;
  text-transform: capitalize;
  font-weight: 400;
  color: var(--v-primaryColor-base);
}
.cancel-all-button {
  border: var(--v-error-base) 0.5px solid;
  font-size: 11px;
}
.badge {
  position: absolute;
  top: 10px;
  right: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--v-success-base);
  color: var(--v-secondaryBack-base);
  font-size: 11px !important;
  font-weight: 700;
  height: 18px !important;
  width: 18px !important;
  border-radius: 100%;
}
</style>
