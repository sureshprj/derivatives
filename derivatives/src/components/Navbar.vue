<template>
  <v-app-bar app color="primaryBack" class="elevation-2 app-bar">
    <img src="../assets/navbar/logo.svg" alt="" />
    <v-tabs
      class="font-weight-light ml-6"
      slider-size="1"
      slider-color="success"
      color="primaryColor"
    >
      <v-tab class="nav-bar" text :to="'/markets/'">Markets</v-tab>
      <v-tab class="nav-bar" text to="/">Trade</v-tab>
      <v-tab class="nav-bar" text :to="'/orders/'">Orders</v-tab>
      <v-tab class="nav-bar" text :to="'/markets/'">Holdings</v-tab>
    </v-tabs>
    <v-spacer></v-spacer>
    <WalletBalance />
    <ConnectWallet />
    <Notifications :notifications="notifications" />
    <div class="d-flex align-center mx-3">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <img
            src="../assets/navbar/help-icon.svg"
            alt=""
            v-bind="attrs"
            v-on="on"
          />
        </template>
        <span>Help</span>
      </v-tooltip>
    </div>

    <div class="d-flex align-center mt-2">
      <v-select
        background-color="secondaryBack"
        class="font-size-14 ml-3 d-none d-md-block"
        style="width: min-content"
        item-color="primaryColor"
        :items="['En', 'Es']"
        :value="'En'"
        dense
        solo
        flat
        :full-width="false"
        hide-details
      ></v-select>
      <v-btn
        color="secondaryBack"
        @click.stop="drawer = !drawer"
        class="d-md-none elevation-0"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
import WalletBalance from "./navbar/walletBalance";
import ConnectWallet from "./navbar/connectWallet";
import Notifications from "./navbar/notifications";

export default {
  components: {
    ConnectWallet,
    Notifications,
    WalletBalance,
  },
  data() {
    return {
      notifications: [
        {
          text: "Wallet 0x3f90...fc8Ad3 connected",
          status: "success",
          timestamp: "19-01-2021",
        },
        {
          text: "BUY Order #12345678 was canceled",
          status: "error",
          timestamp: "19-01-2021",
        },
      ],
    };
  },
};
</script>

<style scoped>
.menu-border {
  font-size: 14px;
  text-transform: uppercase;
  height: 100%;
  border-bottom: var(--v-success-base) solid 1px;
}
.app-bar {
  z-index: 99999999 !important;
}
.nav-bar {
  width: 140px;
}
</style>
