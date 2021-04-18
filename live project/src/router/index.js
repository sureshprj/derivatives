import Vue from "vue";
import VueRouter from "vue-router";
import Trade from "../views/Trade.vue";
import Orders from "../views/Orders.vue";
import Wallet from "../views/Wallet.vue";
import Markets from "../views/Markets.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/orders",
    name: "Orders",
    component: Orders
  },
  {
    path: "/markets",
    name: "Markets",
    component: Markets
  },
  {
    path: "/wallet",
    name: "Wallet",
    component: Wallet
  },
  {
    path: "/:base?/:quote?",
    name: "Home",
    component: Trade
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
