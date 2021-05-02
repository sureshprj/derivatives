<template>
  <div>
    <v-card
      :class="{ 'mb-2': !showRecentTrades }"
      color="secondaryBack"
      v-if="getIndexPrice() && instrument"
    >
      <v-card-title class="card-title pb-0 pt-1">
        <span class="instrument-title-description">{{ symbol }}</span>
      </v-card-title>

      <v-list color="primaryBack" class="py-1">
        <div class="d-flex instrument-items-list">
          <b class="secondary-color">Index price:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor" v-if="getIndexPrice()">
            {{ formatNumber(getIndexPrice()) }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">Mark price:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor" v-if="getIndexPrice()">
            {{ formatNumber(getMarkPrice()) }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">Maturity date:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">{{ getMaturityDate() }}</b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">Contract value:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">
            {{ getContractValue() }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">Last Price:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">
            {{ calculateMarkerPrice() }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">24hs High:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">
            {{
              formatNumber(
                getInstrument().last24hsHigh ? getInstrument().last24hsHigh : ""
              )
            }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">24hs Low:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">
            {{ formatNumber(getInstrument().last24hsLow) }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>

        <v-divider class="divider" />

        <div class="d-flex instrument-items-list">
          <b class="secondary-color">24hs Volume:</b>
          <v-spacer></v-spacer>
          <b color="primaryColor">
            {{ formatNumber(getInstrument().last24hsVolume) }}
            <span class="secondary-color">{{ instrument.quote }}</span>
          </b>
        </div>
      </v-list>
    </v-card>

    <v-card v-show="!showRecentTrades" color="secondaryBack">
      <v-card-title class="card-title px-4 py-1">
        <span class="font-size-14 main-title text-uppercase font-weight-bold"
          >Recent Trades</span
        >
      </v-card-title>

      <v-divider></v-divider>

      <v-simple-table class="primaryBack" dense fixed-header height="480">
        <template v-slot:default>
          <thead class="larger-header">
            <tr>
              <th class="secondaryBack text-no-wrap text-center">Price</th>
              <th class="secondaryBack text-no-wrap text-center">Quantity</th>
              <th class="secondaryBack text-no-wrap text-center">Time</th>
            </tr>
          </thead>

          <tbody class="borderless">
            <tr v-for="(item, index) in recentTrades.slice()" :key="index">
              <transition v-if="index == 0" name="slide-fade" mode="out-in">
                <td
                  v-ripple="{ class: `primary--text` }"
                  :class="
                    'text-no-wrap font-size-12 text-center ' +
                      getTradeColor(item)
                  "
                  :style="{ cursor: 'pointer' }"
                  v-on:click="setLimitPrice(item.price)"
                  :key="recentTradesList"
                >
                  {{ fixedNumber(item.price) }}
                </td>
              </transition>
              <td
                v-else
                v-ripple="{ class: `primary--text` }"
                :class="
                  'text-no-wrap font-size-12 text-center ' + getTradeColor(item)
                "
                :style="{ cursor: 'pointer' }"
                v-on:click="setLimitPrice(item.price)"
                :key="recentTradesList"
              >
                {{ fixedNumber(item.price) }}
              </td>
              <td class="text-no-wrap font-size-12 text-center">
                {{ fixedNumber(fromWei(item.takerAssetFilledAmount)) }}
              </td>
              <td class="text-no-wrap font-size-12 grey--text text-center">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">{{
                      formatDateToHours(item.date ? item.date : item.createdAt)
                    }}</span>
                  </template>
                  <span class="text-center">{{
                    formatDate(item.date ? item.date : item.createdAt)
                  }}</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import Web3Utils from "web3-utils";
import { mapActions, mapGetters, mapState } from "vuex";
const utils = require("../../lib/utils");
const { formatNumber } = require("../../lib/utils");
import { getNumberOfDecimalsSixChars } from "../../util/numbers";

export default {
  name: "Dashboard",
  props: ["symbol", "instrument", "showRecentTrades", "recentTradesList"],
  data() {
    return {
      loadingRecentTrades: false
    };
  },
  computed: {
    ...mapState({
      tradePair: state => state.tradePair,
      recentTrades: state => state.tradePair.recentTrades,
      recentTradesLoader: state => state.utils.recentTradesLoader
    })
  },

  methods: {
    ...mapActions(["SET_LIMIT_PRICE"]),
    ...mapGetters([
      "getInstrument",
      "getMarkPrice",
      "getIndexPrice",
      "getMarketPrice"
    ]),
    fromWei(number) {
      return parseFloat(Web3Utils.fromWei(number));
    },
    fixedNumber(number) {
      return number.toFixed(getNumberOfDecimalsSixChars(number));
    },
    formatDateToHours(date) {
      // FIXME: Ugly fix until feeC get trades from redis
      if (typeof date === "number") {
        return utils.formatTimestamp(date, "HH:mm:ss");
      } else {
        return utils.formatDate(date, "YYYY-MM-DDTHH:mm:ss.000Z", "HH:mm:ss");
      }
    },
    formatDate(date) {
      // FIXME: Ugly fix until feeC get trades from redis
      if (typeof date === "number") {
        return utils.formatTimestamp(date, "MM-DD-YYYY");
      } else {
        return utils.formatDate(date, "YYYY-MM-DDTHH:mm:ss.000Z", "MM-DD-YYYY");
      }
    },

    formatNumber(number, type) {
      return utils.formatNumber(number, type);
    },
    getMaturityDate() {
      return utils.formatDate(
        this.getInstrument().maturityDate,
        "YYYY-MM-DDTHH:mm:ss",
        "MM-DD-YYYY"
      );
    },
    getContractValue() {
      return this.formatNumber(
        this.getMarkPrice() * this.getInstrument().contractSize
      );
    },
    setLimitPrice(price) {
      this.SET_LIMIT_PRICE(price);
    },
    getTradePrice(item) {
      return item.lastPx ? item.lastPx : item.price;
    },
    getTradeColor(item) {
      return item.side == "buy" ? "success--text" : "error--text";
    },
    calculateMarkerPrice() {
      return this.getMarketPrice()
        ? formatNumber(this.getMarketPrice().price)
        : formatNumber(this.getIndexPrice());
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

/* select min width */
.select-in-header {
  display: inline-block;
  width: min-content;
}

/* CARDS */
.card-title {
  padding-bottom: 3px;
  padding-top: 3px;
  margin: 0;
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

.larger-header th {
  height: 38px !important;
}

.table-input-text {
  max-width: 80px;
  top: 1px;
}

.v-select__selections input {
  display: none;
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

.border-top-color {
  border-top: 1px solid var(--v-borderColor-base);
}

.border-right-color {
  border-right: 1px solid var(--v-borderColor-base);
}

.background-header-dark {
  background-color: var(--v-backgroundHeader-base) !important;
}

.background-body-dark {
  background-color: var(--v-backgroundBody-base) !important;
}

.width-auto {
  width: auto !important;
}

.width-20 {
  width: 20%;
}
</style>

<style>
.v-select__selections input {
  width: 0;
}

.menu-search-input .v-input__append-inner {
  margin-top: 4px !important;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  background-color: var(--v-primary-base);
}
.instrumentDetails {
  max-height: 250px;
  overflow-y: scroll;
}
.instrument-title-description {
  font-weight: bold;
  font-size: 16px;
  line-height: 21px;
  text-transform: uppercase;
  color: var(--v-success-base);
  padding: 0.4rem 0rem 0.4rem 0rem;
}
.instrument-items-list {
  padding: 0.4rem 1rem 0.4rem 1rem;
  font-size: 12px;
}
</style>
