<template>
  <div>
    <v-simple-table class="primaryBack" dense fixed-header height="198">
      <template v-slot:default>
        <thead class="larger-header">
          <tr>
            <th class="secondaryBack text-no-wrap">Market</th>
            <th class="secondaryBack text-no-wrap text-center">Size</th>
            <th class="secondaryBack text-no-wrap text-center">Entry Price</th>
            <!--             <th class="secondaryBack text-no-wrap">Leverage</th>
            <th class="secondaryBack text-no-wrap">Value</th> -->
            <th class="secondaryBack text-no-wrap text-center">Liq. Price</th>
            <th class="secondaryBack text-no-wrap text-center">
              Unrealised PNL
            </th>
            <th class="secondaryBack text-no-wrap text-center">Realised PNL</th>
            <th class="secondaryBack text-no-wrap text-center">
              Close Position
            </th>
          </tr>
        </thead>

        <tbody class="borderless" v-if="positions">
          <tr
            class="text-center"
            v-for="(position, index) in positions"
            :key="index"
          >
            <td class="text-no-wrap font-size-12 text-left">
              <span
                class="text--secondary"
                :style="{ cursor: 'pointer' }"
                v-on:click="goTo(`/markets/${position.market}`)"
                >{{ position.market }}</span
              >
            </td>

            <td
              class="text-no-wrap font-size-12"
              :class="[
                position.side == 'long' ? ' success--text' : 'error--text'
              ]"
            >
              {{ formatNumber(position.size, "crypto") }}
            </td>

            <td class="text-no-wrap font-size-12">
              {{ formatNumber(position.entryPrice) }}
            </td>
            <!-- <td class="text-no-wrap font-size-12">
              {{ formatNumber(calculateLeverage(position.market)) }}x
            </td>
            <td class="text-no-wrap font-size-12">
              {{ formatNumber(position.value) }}
            </td> -->
            <td class="text-no-wrap font-size-12">
              {{ calculateLiqPrice(position.market) }}
            </td>
            <td
              class="text-no-wrap font-size-12"
              :class="[
                Math.sign(position.unrealizedPNL) == 1
                  ? ' success--text'
                  : 'error--text'
              ]"
            >
              {{ formatNumber(position.unrealizedPNL) }} USD
            </td>
            <td
              class="text-no-wrap font-size-12"
              :class="[
                Math.sign(position.realizedPNL) == 1
                  ? ' success--text'
                  : 'error--text'
              ]"
            >
              {{ formatNumber(position.realizedPNL) }} USD
            </td>
            <td
              class="text-no-wrap font-size-12 text-center"
              v-if="position.size !== 0"
            >
              <v-btn
                :loading="loadingClosePosition == true"
                class="text--secondary font-weight-bold"
                text
                small
                v-on:click="openDialog('limit', position.market)"
                >CLOSE</v-btn
              >
              <v-btn
                class="font-weight-bold"
                text
                small
                v-on:click="openDialog('market', position.market)"
                color="primary"
                >MARKET</v-btn
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialog.opened" persistent max-width="350">
      <v-card
        class="card-rounded-0 d-flex justify-space-between align-center"
        color="primaryBack"
      >
        <v-card-title class="dialog-header"
          >{{ dialog.side + " " + dialog.type }} CLOSE</v-card-title
        >

        <v-btn icon color="#888d92" @click="cancelDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>

      <v-card class="card-rounded-0 divider-bottom" color="lightBack px-4 py-6">
        <v-card-text class="d-flex justify-center align-center pa-0">
          <b class="dialog-detail-resume white--text">
            <span class="text-capitalize">{{ dialog.type }}</span> Close This
            Position?
          </b>
        </v-card-text>
      </v-card>

      <v-card class="card-rounded-0" color="primaryBack">
        <v-card-text class="d-flex justify-center align-center pa-0">
          <span
            class="text-center white--text mt-8"
            :class="dialog.type == 'limit' ? 'mb-0' : 'mb-8'"
          >
            <b
              class="text-uppercase"
              :class="[dialog.side == 'buy' ? 'green--text' : 'red--text']"
            >
              {{ dialog.side }}
            </b>
            <b>{{ `${dialog.quantity} Contracts` }}</b> of
            <b>{{ dialog.market }}</b> at

            <span class="d-block" v-if="dialog.type !== 'limit'">
              the available market price.
            </span>
          </span>
        </v-card-text>

        <v-card-text v-if="dialog.type == 'limit'">
          <v-form ref="form" v-model="dialog.valid" lazy-validation>
            <v-text-field
              v-model.number="dialog.price"
              :rules="dialog.priceRules"
              required
              :suffix="currency"
              outlined
              dense
              height="34"
              color="emdxBlue"
              background-color="selectBackground"
              class="text-right rounded-0 mt-4 mb-0"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>

      <v-card
        class="card-rounded-0 pa-4 d-flex divider-bottom"
        color="lightBack"
      >
        <v-card-text class="text-center px-0 py-4">
          This will close your entire position.
          <!--
            <br />Estimated PnL is:
            <br />
            <h2>TODO</h2>
          -->
        </v-card-text>
      </v-card>

      <v-card class="card-rounded-0 pa-4 d-flex" color="lightBack">
        <v-btn
          color="#2d3845"
          class="flex-grow-1 btn-dialog-custom"
          @click="cancelDialog()"
          >Cancel</v-btn
        >

        <v-btn
          class="flex-grow-1 ml-2 btn-dialog-custom text-uppercase"
          color="emdxBlue"
          :loading="dialog.loading"
          @click="agreeDialog()"
          >{{ dialog.type }} CLOSE</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
/* const api = require("../../services/api"); */
const utils = require("../../lib/utils");

export default {
  name: "MarketPosition",
  props: ["positions", "symbol", "currency", "createOrderFunction"],
  data: () => ({
    dialog: {
      loading: false,
      valid: true,
      opened: false,
      type: null,
      quantity: null,
      side: "",
      price: null,
      market: null,
      priceRules: [
        v => !!v || "Price is required",
        v =>
          /^-?[0-9]+$/.test(v) ||
          /^[-+]?[0-9]+\.[0-9]+$/.test(v) ||
          "Price must be valid"
      ]
    },
    loadingClosePosition: false
  }),

  methods: {
    ...mapGetters([
      "getIndexPrice",
      "getMarketPrice",
      "getMarkPrice",
      "getInstrument",
      "getAccountReport"
    ]),
    validate() {
      return this.$refs.form.validate();
    },
    async openDialog(type, market) {
      this.loadingClosePosition = true;
      if (type == "limit") {
        /*         const res = await api.getInstrumentMarkData(market); */
        /*         if (res.data && res.data.success)
          this.dialog.price = res.data.data.indexPrice;
        else 
          this.dialog.price = 0;
        this.loadingClosePosition = false; */
      }

      if (this.positions[market].size !== 0) {
        this.dialog.type = type;
        this.dialog.market = market;
        this.dialog.opened = true;
        this.dialog.quantity = Math.abs(
          this.positions[market].totalCurrentSize
        );
        this.dialog.side =
          Math.sign(this.positions[market].size) == 1 ? "sell" : "buy";
      }

      this.loadingClosePosition = false;
    },
    /*     placeOrder() {
      if (
        (this.dialog.type == "limit" && this.validate()) ||
        this.dialog.type == "market"
      ) {
        this.dialog.loading = true;
        return api
          .closePosition(
            this.dialog.market,
            this.dialog.price,
            this.dialog.type
          )
          .then((res) => {
            this.dialog.loading = false;
            return true;
          });
      } else {
        return new Promise((resolve, reject) => {
          return false;
        });
      }
    }, */
    agreeDialog() {
      this.placeOrder().then(res => {
        if (res) this.dialog.opened = false;
      });
    },
    cancelDialog() {
      this.dialog.opened = false;
    },
    calculateLeverage(market) {
      const markPrice =
        market === this.symbol
          ? this.getMarkPrice()
          : this.positions[market].marketPrice;
      let leverage = 0;
      if (markPrice && this.positions[market].size !== 0) {
        let margin = this.getAccountReport().availableToCollateral;
        //TODO: fix this is ugly thing
        if (market.includes("ARS")) margin = margin * this.getIndexPrice();
        leverage = Math.abs(
          (this.positions[market].totalCurrentSize *
            this.positions[market].contractSize *
            markPrice) /
            margin
        );
      }

      return leverage;
    },
    calculateLiqPrice(market) {
      let liqPrice = "N/A";
      const leverage = this.calculateLeverage(market);
      if (leverage && leverage >= 1 && this.positions[market].size !== 0) {
        const entryPrice = this.positions[market].entryPrice;
        const mm = 0.001;
        if (this.positions[market].side == "long") {
          liqPrice = (entryPrice * leverage) / (leverage + 1 - mm * leverage);
        } else {
          liqPrice = (entryPrice * leverage) / (leverage - 1 + mm * leverage);
        }
        liqPrice = this.formatNumber(Math.abs(liqPrice));
      }
      return liqPrice;
    },
    formatNumber(number, type) {
      return utils.formatNumber(number, type);
    },
    goTo(path) {
      this.$router.push(path);
    }
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

/* dialog styles */
.dialog-header {
  text-transform: uppercase;
  font-size: 14px !important;
  color: var(--v-emdxBlue-base);
  font-weight: 700 !important;
  padding: 8px 24px !important;
}

.dialog-detail-resume {
  font-size: 18px !important;
  line-height: 20px !important;
  margin: 0 !important;
  text-align: center;
}

.order-list-wrapper {
  display: flex;
  justify-content: space-between;
  font-size: 16px !important;
}

.divider {
  margin: 0 16px;
}

.divider-bottom {
  border-bottom: 1px solid #2a323c !important;
}

.btn-dialog-custom {
  font-size: 14px !important;
  text-transform: initial;
  letter-spacing: initial;
  font-weight: bold;
}

.card-rounded-0 {
  border-radius: 0 !important;
}
</style>
