<template>
  <div class="orders-container">
    <v-container>
      <div class="d-flex align-center">
        <h2 class="page-title">{{ title }}</h2>
        <v-spacer></v-spacer>
        <v-btn class="mr-2 cancel-all-button" text small color="error"
          >Cancel all</v-btn
        >
      </div>
      <OrdersTabs />
    </v-container>
  </div>
</template>

<script>
import OrdersTabs from "../components/orders/OrdersTabs";
export default {
  components: {
    OrdersTabs
  },
  data() {
    return {
      title: "My Orders"
    };
  }
};
</script>

<style scoped>
.orders-container {
  min-height: 92vh;
  background: var(--v-background-base);
}
.cancel-all-button {
  border: var(--v-error-base) 0.5px solid;
  text-transform: capitalize;
  font-size: 14px;
}
</style>
