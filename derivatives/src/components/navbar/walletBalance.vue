<template>
  <div v-if="coinbase" class="d-flex align-center ">
    <div class="text-right mx-4 wallet-balance-container">
      <p class="mb-0 wallet-balance-title">Wallet Balance</p>
      <p class="mb-0 wallet-balance">
        {{ parseFloat(ethBalance).toFixed(5) }} AVAX
      </p>
    </div>
    <v-divider vertical class="mr-4"></v-divider>
  </div>
</template>

<script>
//import { mapState } from "vuex";
export default {
  data() {
    return {
      coinbase: false,
      ethBalance: 12345,
      createWalletAddress: "0xd6aD3cA2AC745e20B97d195ee539f39Ed8c8497C",
    };
  },
};
</script>

<style scoped>
.wallet-balance-container {
  width: 100px;
}
.wallet-balance-title {
  font-size: 11px;
}
.wallet-balance {
  font-size: 12px;
  font-weight: 600;
}
</style>
