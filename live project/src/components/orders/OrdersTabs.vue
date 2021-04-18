<template>
  <v-card color="primaryBack">
    <v-tabs
      height="56"
      background-color="secondaryBack"
      slider-color="success"
      color="primaryColor"
      class="elevation-1"
      slider-size="1"
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

      <v-tab href="#tab-active-orders" class="tab-item">Active Orders</v-tab>
      <v-tab href="#tab-filled-orders" class="tab-item">Filled Orders</v-tab>
      <v-tab href="#tab-order-history" class="tab-item">Order History</v-tab>

      <v-tab-item value="tab-active-orders">
        <OpenOrdersTable />
      </v-tab-item>

      <v-tab-item value="tab-filled-orders"> </v-tab-item>

      <v-tab-item value="tab-order-history"> </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
/* import MarketActiveOrdersList from "@/components/markets/MarketActiveOrdersList";
import MarketOrdersList from "@/components/markets/MarketOrdersList";
import MarketPosition from "@/components/markets/MarketPosition"; */
import OpenOrdersTable from "../../components/orders/OpenOrdersTable";

export default {
  components: {
    OpenOrdersTable
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
