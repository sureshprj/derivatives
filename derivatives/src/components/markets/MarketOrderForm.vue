<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card
        class="rounded-br-0 rounded-bl-0 elevation-0"
        color="secondaryBack"
      >
        <v-card-title class="card-title d-flex justify-center py-4 pb-6">
          <label color="secondaryColor" class="order-form-label"
            >Order type</label
          >
          <v-select
            v-model="type"
            :items="types"
            :rules="[v => !!v || 'Type is required']"
            required
            background-color="selectBackground"
            class="font-size-14 ml-3 select-in-header selectorGood"
            item-color="#fff"
            dense
            solo
            flat
            :full-width="false"
            hide-details
            @change="onChange($event)"
          ></v-select>
        </v-card-title>
        <v-card-text class="primaryBack px-3">
          <v-row v-if="type != 'stop_limit'" class="px-6 pt-2 mb-1">
            <v-col cols="3" class="d-flex align-center pa-0">
              <span class="order-form-label">Time in Force</span>
            </v-col>
            <v-col cols="9" class="pr-0 py-2">
              <v-select
                v-model="timeInForce"
                :items="
                  type && ['limit', 'stop_limit'].includes(type)
                    ? limitTimeInForces
                    : marketTimeInForces
                "
                :rules="[v => !!v || 'Time in force is required']"
                required
                item-color="#fff"
                class="font-size-14 font-size-14 rounded-0 ml-0 mb-0"
                background-color="selectBackground"
                hide-details
                solo
                dense
                flat
              ></v-select>
            </v-col>
          </v-row>

          <v-row
            class="my-1 px-6"
            v-if="!type || ['stop', 'stop_limit'].includes(type)"
          >
            <v-col cols="3" class="d-flex align-center pa-0">
              <span class="order-form-label">Trigger Price</span>
            </v-col>
            <v-col cols="7" class="py-1">
              <v-text-field
                v-model.number="stopPrice"
                :rules="stopPriceRules"
                required
                class="font-size-14 rounded-0 ml-0 mb-0"
                background-color="selectBackground"
                solo
                dense
                hide-details
                height="32"
                color="emdxBlue"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex align-center justify-center">
              <v-icon class="pa-1" size="20" color="secondaryColor"
                >mdi-plus</v-icon
              >
              <v-icon class="pa-1" size="20" color="secondaryColor"
                >mdi-minus</v-icon
              >
            </v-col>
          </v-row>

          <v-row
            class="my-1 px-6"
            v-if="!type || ['limit', 'stop_limit'].includes(type)"
          >
            <v-col cols="3" class="d-flex align-center pa-0">
              <span class="order-form-label">Limit Price</span>
            </v-col>
            <v-col cols="7" class="py-1">
              <v-text-field
                v-model="price"
                type="number"
                :rules="priceRules"
                required
                class="font-size-14 rounded-0 ml-0 mb-0"
                background-color="selectBackground"
                solo
                flat
                dense
                hide-details
                height="32"
                color="emdxBlue"
              ></v-text-field>
            </v-col>
            <v-col cols="2" class="d-flex align-center justify-center">
              <v-icon
                class="pa-1"
                size="20"
                color="secondaryColor"
                @click="plusButtonFunction(price, 'price')"
                >mdi-plus</v-icon
              >
              <v-icon
                class="pa-1"
                size="20"
                color="secondaryColor"
                @click="minusButtonFunction(price, 'price')"
                >mdi-minus</v-icon
              >
            </v-col>
          </v-row>

          <v-row class="my-1 px-6">
            <v-col cols="3" class="d-flex align-center pa-0">
              <span class="order-form-label">Quantity</span>
            </v-col>
            <v-col cols="7" class="py-1">
              <!--               <v-tooltip top>
                <template v-slot:activator="{ on, attrs }"> -->
              <v-text-field
                v-model="quantity"
                type="number"
                :rules="quantityRules"
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
              <!--                 </template>
                <span
                  >Each contract size {{ instrument.contractSize }}
                  {{ instrument.base }}</span
                >
                <br />
                <span
                  >Each contract size {{ calculateEachContractSize() }}
                  {{ instrument.quote }}</span
                >
              </v-tooltip> -->
            </v-col>
            <v-col cols="2" class="d-flex align-center justify-center">
              <v-icon
                class="pa-1"
                size="20"
                color="secondaryColor"
                @click="plusButtonFunction(quantity, 'quantity')"
                >mdi-plus</v-icon
              >
              <v-icon
                class="pa-1"
                size="20"
                color="secondaryColor"
                @click="minusButtonFunction(quantity, 'quantity')"
                >mdi-minus</v-icon
              >
            </v-col>
          </v-row>

          <v-row class="my-2 pb-2 px-6">
            <v-col class="pa-0 d-flex flex-wrap justify-space-between">
              <v-btn
                v-for="button in quantityButtons"
                :key="button.quantity"
                class="add-percentage-button elevation-0 mt-2"
                small
                @click="setQuantity(button.percentage)"
              >
                {{ button.quantity }}%
              </v-btn>
            </v-col>
          </v-row>

          <v-row class="secondaryBack px-6 pt-4 pb-2 form-balance">
            <v-col cols="6" class="pa-0 pr-2 pl-0 d-flex justify-left">
              <p>
                Fees:
                <span class="primary-color-text form-balance">{{
                  (price * quantity * 0.01).toFixed(2)
                }}</span>
                USDT
              </p>
            </v-col>

            <v-col cols="6" class="pa-0 pl-0 text-right form-balance">
              <p>
                Total:
                <span class="primary-color-text form-balance">{{
                  (price * quantity + price * 0.01).toFixed(2)
                }}</span>
                USDT
              </p>
            </v-col>

            <!--             <v-col cols="6" class="pa-0 pl-0 d-flex justify-center pb-3">
              <v-checkbox
                v-model="cancelPrevious"
                dense
                hide-details
                color="primary"
                class="ma-0"
                label="Cancel previous"
                required
                :disabled="['stop', 'stop_limit'].includes(type)"
              ></v-checkbox>
            </v-col>

            <v-col cols="6" class="py-1 pr-2 pl-0 d-flex justify-center pb-3">
              <v-checkbox
                v-model="showConfirmation"
                dense
                hide-details
                color="primary"
                class="ma-0 ml-6"
                label="Show confirmation"
                required
                @click="setConfirmationStatus()"
              ></v-checkbox>
            </v-col> -->

            <v-col cols="6" class="py-1 pr-2 pl-0">
              <v-btn
                class="mb-2 font-weight-bold success-button"
                block
                color="success"
                :loading="buyLoading"
                v-on:click="submitDexOrder(type, 'buy')"
                >buy</v-btn
              >
              <!--               <v-btn
                class="mb-2 cancelButtonBids"
                block
                x-small
                text
                color="success"
                :loading="cancelBuyLoading"
                v-on:click="cancelAll('buy')"
                >Cancel all bids</v-btn
              > -->
            </v-col>

            <v-col cols="6" class="py-1 pr-0 pl-2">
              <v-btn
                class="mb-2 font-weight-bold"
                block
                color="error"
                :loading="sellLoading"
                v-on:click="submitDexOrder(type, 'sell')"
                >sell</v-btn
              >
              <!--               <v-btn
                class="mb-2 cancelButtonOffers"
                block
                x-small
                text
                color="error"
                :loading="cancelSellLoading"
                v-on:click="cancelAll('sell')"
                >Cancel all offers</v-btn
              > -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card
        class="rounded-tr-0 rounded-tl-0 pt-2 pb-0 elevation-0"
        color="primaryBack"
      >
        <!--         <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5" clip-path="url(#clip0)">
            <path
              d="M9.1875 1.3269C6.85475 1.3269 4.375 2.03444 4.375 3.34614V4.96152C4.375 5.18444 4.571 5.36537 4.8125 5.36537C5.054 5.36537 5.25 5.18444 5.25 4.96152V4.54071C6.17838 5.08106 7.71137 5.36537 9.1875 5.36537C10.6636 5.36537 12.1966 5.08106 13.125 4.54071V4.96152C13.125 5.35648 12.0488 5.98648 10.0258 6.14237C9.786 6.16013 9.60663 6.3564 9.62675 6.57852C9.64512 6.78933 9.83675 6.94844 10.0616 6.94844C10.0747 6.94844 10.0861 6.94764 10.0992 6.94683C11.2385 6.85879 12.3734 6.5866 13.125 6.14479V6.5769C13.125 6.92179 12.3323 7.41771 10.8614 7.6576C10.6242 7.69637 10.465 7.90637 10.507 8.12525C10.5446 8.32071 10.7292 8.45883 10.9366 8.45883C10.962 8.45883 10.9882 8.45721 11.0136 8.45237C11.9035 8.30779 12.6158 8.07113 13.125 7.77067V8.19229C13.125 8.53717 12.3323 9.0331 10.8614 9.27298C10.6242 9.31175 10.465 9.52175 10.507 9.74063C10.5446 9.9361 10.7292 10.0742 10.9366 10.0742C10.962 10.0742 10.9882 10.0726 11.0136 10.0677C11.9035 9.92317 12.6158 9.68571 13.125 9.38606V9.80767C13.125 10.1526 12.3323 10.6485 10.8614 10.8884C10.6242 10.9271 10.465 11.1371 10.507 11.356C10.5446 11.5515 10.7292 11.6896 10.9366 11.6896C10.962 11.6896 10.9882 11.688 11.0136 11.6831C11.9035 11.5386 12.6158 11.3011 13.125 11.0014V11.4231C13.125 11.818 12.0488 12.448 10.0258 12.6039C9.786 12.6217 9.60663 12.8179 9.62675 13.0401C9.64512 13.2509 9.83675 13.41 10.0616 13.41C10.0747 13.41 10.0861 13.4092 10.0992 13.4084C12.0409 13.2581 14 12.5869 14 11.4231V3.34614C14 2.03444 11.5202 1.3269 9.1875 1.3269ZM9.1875 4.55767C6.78387 4.55767 5.25 3.83963 5.25 3.34614C5.25 2.85264 6.78387 2.1346 9.1875 2.1346C11.5911 2.1346 13.125 2.85264 13.125 3.34614C13.125 3.83963 11.5911 4.55767 9.1875 4.55767Z"
              fill="white"
            />
            <path
              d="M4.8125 6.17307C2.47975 6.17307 0 6.8806 0 8.1923V11.4231C0 12.7348 2.47975 13.4423 4.8125 13.4423C7.14525 13.4423 9.625 12.7348 9.625 11.4231V8.1923C9.625 6.8806 7.14525 6.17307 4.8125 6.17307ZM8.75 11.4231C8.75 11.9166 7.21613 12.6346 4.8125 12.6346C2.40887 12.6346 0.875 11.9166 0.875 11.4231V11.0023C1.80338 11.5426 3.33637 11.8269 4.8125 11.8269C6.28863 11.8269 7.82163 11.5426 8.75 11.0023V11.4231ZM8.75 9.80768C8.75 10.3012 7.21613 11.0192 4.8125 11.0192C2.40887 11.0192 0.875 10.3012 0.875 9.80768V9.38687C1.80338 9.92722 3.33637 10.2115 4.8125 10.2115C6.28863 10.2115 7.82163 9.92722 8.75 9.38687V9.80768ZM4.8125 9.40383C2.40887 9.40383 0.875 8.6858 0.875 8.1923C0.875 7.6988 2.40887 6.98076 4.8125 6.98076C7.21613 6.98076 8.75 7.6988 8.75 8.1923C8.75 8.6858 7.21613 9.40383 4.8125 9.40383Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect
                width="14"
                height="12.9231"
                fill="white"
                transform="translate(0 0.923065)"
              />
            </clipPath>
          </defs>
        </svg>
        <p class="ml-2 mb-0 form-balance">
          {{ ethBalance }} <span class="secondary-color-text">ETH</span>
        </p> -->
        <v-row class="d-flex px-6">
          <v-col cols="4" class="trade-pair-title">{{
            tradePair.data.baseTokenName
          }}</v-col>
          <v-col cols="8" class="text-right trade-pair-title">{{
            fixedNumber(tradePair.baseTokenBalance)
          }}</v-col>
        </v-row>
        <v-row class="d-flex px-6">
          <v-col cols="4" class="trade-pair-title">{{
            tradePair.data.quoteTokenName
          }}</v-col>
          <v-col cols="8" class="text-right trade-pair-title">{{
            fixedNumber(tradePair.quoteTokenBalance)
          }}</v-col>
        </v-row>
      </v-card>
      <v-overlay absolute opacity="0.86" color="#111A24" :value="!coinbase">
        <div
          class="d-flex flex-column align-center justify-center px-12 text-center"
        >
          <h2 class="mb-6">Connect or create a wallet to get started</h2>
          <img
            @click="$store.commit('changeConnectDialogStatus', true)"
            style="cursor: pointer;"
            src="../../assets/navbar/connect-wallet-button.svg"
            alt=""
          />
          <span class="my-1">or</span>
          <img
            @click="$store.commit('changeConnectDialogStatus', true)"
            style="cursor: pointer;"
            src="../../assets/navbar/create-wallet-button.svg"
            alt=""
          />
        </div>
      </v-overlay>
    </v-form>

    <v-dialog v-model="transactionDialog" width="500">
      <v-card
        v-if="!isCheckingTransaction && transactionDone"
        class="secondaryBack text-center pa-8"
      >
        <h1 class="white--text">Transaction Successful!</h1>
        <v-btn class="primary mt-4" @click="transactionDialog = false"
          >Go back</v-btn
        >
      </v-card>
      <v-card
        v-else-if="isCheckingTransaction && transactionDone"
        class="secondaryBack text-center pa-8"
      >
        <h1 class="white--text">Checking transaction</h1>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          class="mt-2"
        ></v-progress-circular>
      </v-card>
    </v-dialog>

    <v-dialog v-model="metaMaskTx.dialog" width="400">
      <v-card class="primaryBack text-center">
        <v-card-title class="secondaryBack dialog-title">
          Order Setup
          <v-spacer></v-spacer>
          <v-btn text small @click="metaMaskTx.dialog = false">
            <v-icon size="20" color="secondaryColor">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <img
          class="mt-4"
          src="../../assets/navbar/metamask-fox-lg.svg"
          alt=""
        />
        <div class="px-8 text-center">
          <h2 class="pa-2">Order Setup</h2>
          <p class="info-text">
            Confirm and sign on Metamask to setup a new order
          </p>
        </div>
        <div class="secondaryBack py-4 px-12">
          <!-- <v-range-slider
            :tick-labels="['Unlock', 'Sign', 'Done']"
            :value="[0, 1, 2]"
            min="0"
            max="2"
            ticks="always"
            tick-size="4"
            color="success"
          ></v-range-slider> -->
          <div class="d-flex mt-6 align-center">
            <v-spacer></v-spacer>
            <div class="text-block">
              <p class="success-color-text">Unlock</p>
            </div>
            <v-spacer></v-spacer>
            <div class="text-block">
              <p v-if="txIsBuy" class="secondary-color-text">Buy</p>
              <p v-else class="secondary-color-text">Sell</p>
            </div>
            <v-spacer></v-spacer>
          </div>
          <div class="d-flex align-center">
            <v-icon size="16" color="success"
              >mdi-circle <v-icon>mdi-check</v-icon>
            </v-icon>
            <v-progress-linear value="100" color="success"></v-progress-linear>
            <v-icon size="16" color="success">mdi-circle</v-icon>
            <v-progress-linear
              :value="timeToCompleteTx"
              color="success"
            ></v-progress-linear>
            <v-icon size="16">mdi-circle</v-icon>
          </div>
          <p class="info-text mt-6">Waiting for confirmation...</p>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="instrument"
      v-model="dialog.opened"
      persistent
      max-width="350"
    >
      <v-card
        class="card-rounded-0 d-flex justify-space-between align-center"
        color="primaryBack"
      >
        <v-card-title class="dialog-header">Order details</v-card-title>

        <v-btn icon color="#888d92" @click="cancelDialog()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card>

      <v-card class="card-rounded-0 divider-bottom" color="lightBack px-4 py-6">
        <v-card-text class="d-flex justify-center align-center pa-0">
          <b class="dialog-detail-resume">
            <span
              class="text-uppercase"
              :class="[side == 'buy' ? 'green--text' : 'red--text']"
              >{{ side }}</span
            >
            <span class="white--text">{{ ` ${quantity} Contracts` }}</span> of
            <span class="white--text">{{ symbol }}</span> <br />at
            <span class="text-uppercase white--text">{{ type }}</span>
          </b>
        </v-card-text>
      </v-card>

      <v-card class="card-rounded-0 orderTotal" color="primaryBack">
        <v-list color="primaryBack" class="divider-bottom py-4 px-2">
          <v-list-item dense v-if="type == 'limit'">
            <v-list-item-title class="order-list-wrapper">
              <span class="grey--text">Price</span>

              <span>
                <b>{{ formatNumber(price) }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item dense v-if="type == 'market' && marketPrice()">
            <v-list-item-title class="order-list-wrapper">
              <span class="grey--text">Price</span>

              <span>
                <b>{{ formatNumber(marketPrice()) }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item dense>
            <v-list-item-title class="order-list-wrapper">
              <span class="grey--text">Order Value</span>

              <span>
                <b>{{ calculateOrderValue() }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item dense>
            <v-list-item-title class="order-list-wrapper">
              <span class="grey--text">Required Margin</span>

              <span>
                <b>{{ formatNumber(requiredMargin) }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-list-item dense>
            <v-list-item-title class="order-list-wrapper">
              <span class="grey--text">Fee</span>

              <span>
                <b>{{ formatNumber(fee) }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>

          <v-divider class="divider" />

          <v-list-item dense>
            <v-list-item-title class="order-list-wrapper">
              <b color="secundaryColor">Total</b>

              <span>
                <b>{{ formatNumber(total) }}</b>
                <b class="grey--text">{{ instrument.quote }}</b>
              </span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
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
          :color="side == 'buy' ? 'green' : 'red'"
          @click="agreeDialog()"
          >{{ side + " " + quantity + " " + symbol }}</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { NETWORKS } from "../../util/constants/networks";
import { mapState, mapActions, mapGetters } from "vuex";
import { BigNumber } from "@0x/utils";
import { getNumberOfDecimalsSixChars } from "../../util/numbers";

const utils = require("../../lib/utils");
const Web3Utils = require("web3-utils");

/* import { HttpClient } from "@0x/connect"; */

const OrderCreation = require("../../util/orders/order-creation");

export default {
  name: "MarketOrderForm",
  props: ["createOrderFunction", "symbol"],
  data: () => ({
    transactionDialog: false,
    pending: false,
    transactionDone: false,
    buyLoading: false,
    sellLoading: false,
    cancelBuyLoading: false,
    cancelSellLoading: false,
    valid: true,
    price: null,
    stopPrice: null,
    priceRules: [
      v => !!v || "Price is required",
      v =>
        /^-?[0-9]+$/.test(v) ||
        /^[-+]?[0-9]+\.[0-9]+$/.test(v) ||
        "Price must be valid"
    ],
    stopPriceRules: [
      v => !!v || "Stop trigger is required",
      v =>
        /^-?[0-9]+$/.test(v) ||
        /^[-+]?[0-9]+\.[0-9]+$/.test(v) ||
        "Price must be valid"
    ],
    quantity: null,
    quantityRules: [
      v => !!v || "Quantity is required"
      //(v) => /^-?[0-9]+$/.test(v) || "Quantity must be integer",
    ],
    type: "limit",
    types: [
      { text: "Limit", value: "limit" },
      { text: "Market", value: "market" },
      { text: "Stop limit", value: "stop_limit" }
      //     { text: "Stop market", value: "stop" },
    ],
    timeInForce: "GTC",
    limitTimeInForces: [
      { text: "Good till cancelled", value: "GTC" },
      { text: "Immediate or Cancel", value: "IOC" },
      { text: "Fill or Kill", value: "FOK" }
    ],
    marketTimeInForces: [
      { text: "Immediate or Cancel", value: "IOC" },
      { text: "Fill or Kill", value: "FOK" }
    ],
    cancelPrevious: false,
    showConfirmation: true,
    side: "",
    fee: null,
    total: null,
    dialog: {
      opened: false,
      resolve: null
    },
    instrument: null,
    quantityButtons: [
      {
        quantity: 5,
        percentage: 0.05
      },
      {
        quantity: 10,
        percentage: 0.1
      },
      {
        quantity: 25,
        percentage: 0.25
      },
      {
        quantity: 50,
        percentage: 0.5
      },
      {
        quantity: 100,
        percentage: 1
      }
    ],
    // Dialogs
    metaMaskTx: {
      dialog: false,
      txStatus: "pending"
    },
    txIsBuy: null,
    timeToCompleteTx: 0
  }),

  created() {
    this.instrument = this.getInstrument();
    let confirmationStatus = localStorage.getItem("trade-confirmation");
    if (confirmationStatus === "false") {
      this.showConfirmation = false;
    } else {
      this.showConfirmation = true;
    }
  },

  computed: {
    limitPrice() {
      return this.$store.state.market.limitPrice;
    },
    requiredMargin: function() {
      if (this.instrument) {
        return (
          this.instrument.margin * this.instrument.contractSize * this.quantity
        );
      } else {
        return 0;
      }
    },
    ...mapState({
      coinbase: state => state.web3.coinbase,
      isCheckingTransaction: state => state.web3.isCheckingTransaction,
      ethBalance: state => {
        if (state.web3.web3Instance !== null)
          return state.web3.web3Instance().fromWei(state.web3.balance, "ether");
      },
      network: state => NETWORKS[state.web3.networkId],
      isInjected: state => state.web3.isInjected,
      latestTransactions: state => state.web3.latestTransactions,
      tradePair: state => state.tradePair
    })
  },

  watch: {
    limitPrice(newValue) {
      this.price = newValue;
    }
  },

  methods: {
    ...mapGetters([
      "getInstrument",
      "getMarketPrice",
      "getIndexPrice",
      "getLimitPrice",
      "getAccountReport"
    ]),

    ...mapActions(["getPairRecentTrades"]),

    activateMetaMask() {
      this.metaMaskConnecting = true;
      window.ethereum.enable();
    },
    fixedNumber(number) {
      return parseFloat(number).toFixed(getNumberOfDecimalsSixChars(number));
    },
    validate() {
      return this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    formatNumber(number, type) {
      return utils.formatNumber(number, type);
    },
    openDialog() {
      this.dialog.opened = true;
      return new Promise(resolve => {
        this.dialog.resolve = resolve;
      });
    },
    agreeDialog() {
      this.dialog.resolve(true);
      this.dialog.opened = false;
    },
    cancelDialog() {
      this.dialog.resolve(false);
      this.dialog.opened = false;
      this.buyLoading = false;
      this.sellLoading = false;
    },
    async submit(side) {
      if (!this.validate()) return false;
      if (side == "buy") {
        this.buyLoading = true;
      } else {
        this.sellLoading = true;
      }
      this.side = side;
      this.fee = this.calculateFee();
      this.total = this.requiredMargin + this.fee;
      let confirmed = true;
      if (this.showConfirmation) {
        confirmed = await this.openDialog();
      }
      if (confirmed) {
        return this.createOrderFunction(
          this.symbol,
          this.price,
          this.stopPrice,
          this.quantity,
          this.type,
          side,
          this.timeInForce,
          this.cancelPrevious,
          false
        ).then(res => {
          this.buyLoading = false;
          this.sellLoading = false;
          return res;
        });
      } else {
        return false;
      }
    },
    cancelAll(side) {
      if (side == "buy") {
        this.cancelBuyLoading = true;
      } else {
        this.cancelSellLoading = true;
      }
      /*       api.cancelAllOrders(this.symbol, side).then(() => {
        this.cancelBuyLoading = false;
        this.cancelSellLoading = false;
      }); */
    },
    calculateFee() {
      const marketPrice = this.marketPrice();
      if (["limit", "stop_limit"].includes(this.type) && this.price) {
        return (
          this.price *
          this.quantity *
          this.instrument.contractSize *
          this.instrument.feeMaker
        );
      } else if (marketPrice) {
        return (
          marketPrice *
          this.quantity *
          this.instrument.contractSize *
          this.instrument.feeTaker
        );
      } else {
        return 0;
      }
    },
    calculateCost() {
      if (this.quantity) {
        let fee = this.calculateFee();
        const cost = this.formatNumber(this.requiredMargin + fee);
        fee = this.formatNumber(fee);
        return `≈${cost} (fee: ${fee})`;
      } else {
        return "0.00";
      }
    },
    onChange(event) {
      if (["limit", "stop_limit"].includes(event)) {
        this.timeInForce = "GTC";
      } else {
        this.timeInForce = "IOC";
      }
    },
    marketPrice() {
      const marketPrice = this.getMarketPrice();
      return marketPrice ? marketPrice.price : this.getIndexPrice();
    },
    calculateEachContractSize() {
      const marketPrice = this.marketPrice();
      if (["limit", "stop_limit"].includes(this.type) && this.price) {
        return this.formatNumber(this.price * this.instrument.contractSize);
      } else if (marketPrice) {
        return this.formatNumber(marketPrice * this.instrument.contractSize);
      } else {
        return "0.00";
      }
    },
    calculateOrderValue() {
      const marketPrice = this.marketPrice();
      /*       let price = 0; */
      if (["limit", "stop_limit"].includes(this.type) && this.price) {
        return this.formatNumber(
          this.quantity * this.instrument.contractSize * this.price
        );
      } else if (marketPrice) {
        return this.formatNumber(
          this.quantity * this.instrument.contractSize * marketPrice
        );
      } else {
        return "0.00";
      }
    },
    setConfirmationStatus() {
      localStorage.setItem(
        "trade-confirmation",
        this.showConfirmation.toString()
      );
    },
    setQuantity(percentage) {
      this.quantity = parseFloat(
        this.tradePair.baseTokenBalance * percentage
      ).toFixed(5);
      console.log(this.quantity);
    },
    plusButtonFunction(number, type) {
      if (type == "quantity") {
        number == 0 || number == null
          ? (number = 0.1)
          : (number = parseFloat(number) * 1.05);
        this.quantity = parseFloat(number).toFixed(5);
      } else if (type == "price") {
        number = number * 1.01;
        this.price = parseFloat(number).toFixed(5);
      }
    },
    minusButtonFunction(number, type) {
      if (type == "quantity") {
        number -= number * 0.05;
        this.quantity = parseFloat(number).toFixed(5);
      } else if (type == "price") {
        number -= number * 0.01;
        this.price = parseFloat(number).toFixed(5);
      }
    },
    // MetaMask Transfer methods
    weiToEth(value) {
      return this.$store.state.web3.toWei(value, "eth");
    },
    countDownTimer() {
      if (this.timeToCompleteTx == 0) {
        setTimeout(() => {
          this.timeToCompleteTx += 1;
          this.countDownTimer();
        }, 8000);
      } else if (this.timeToCompleteTx < 100) {
        setTimeout(() => {
          this.timeToCompleteTx += 1;
          this.countDownTimer();
        }, 100);
      }
    },
    async submitDexOrder(type, side) {
      this.countDownTimer();
      console.log("Entro a submitDexOrder");
      this.txIsBuy = side === "buy";
      let quantityBN = new BigNumber(this.quantity);
      let priceBN = new BigNumber(this.price);
      const sideToMatch = side === "buy" ? "sell" : "buy";
      this.metaMaskTx.dialog = true;
      if (type == "limit") {
        await OrderCreation.createOrders(
          this.$store.state.tradePair.orderbook[sideToMatch],
          {
            ethAccount: this.coinbase,
            ethBalance: this.ethBalance,
            baseTokenName: this.$store.state.tradePair.data.baseTokenName,
            quoteTokenName: this.$store.state.tradePair.data.quoteTokenName,
            baseToken: this.$store.state.tradePair.baseToken,
            quoteToken: this.$store.state.tradePair.quoteToken,
            amount: quantityBN,
            side: side,
            price: priceBN
          }
        );
      } else if (type == "market") {
        await OrderCreation.submitMarketOrder(
          new BigNumber(Web3Utils.toWei(this.quantity.toString(), "ether")),
          side,
          {
            ethAccount: this.coinbase,
            ethBalance: this.ethBalance,
            orders: this.$store.state.tradePair.orderbook[sideToMatch],
            baseToken: this.$store.state.tradePair.data.baseTokenName,
            quoteToken: this.$store.state.tradePair.data.quoteTokenName
          }
        );
      }
      this.$store.dispatch("getOrdersAndOrderbook", {
        lgQuoteToken: this.$store.state.tradePair.lgQuoteToken,
        lgBaseToken: this.$store.state.tradePair.lgBaseToken
      });
      this.$store.dispatch("getPairRecentTrades", {
        base: this.$store.state.tradePair.data.baseToken,
        quote: this.$store.state.tradePair.data.quoteToken
      });
      this.timeToCompleteTx = 0;
      this.metaMaskTx.dialog = false;
    }
  }
};
</script>

<style>
.v-input--selection-controls__input {
  padding: 0 !important;
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
.selectorGood {
  max-width: 200px;
}
.orderTotal {
  max-height: 35vh;
  overflow-y: scroll;
}
.cancelButtonBids {
  margin-top: 15px;
  text-transform: initial;
  border: 0.5px var(--v-success-base) solid;
  letter-spacing: 0.4px;
}
.cancelButtonOffers {
  margin-top: 15px;
  text-transform: initial;
  border: 0.5px var(--v-error-base) solid;
  letter-spacing: 0.4px;
}
.v-text-field.v-text-field--enclosed.v-text-field--single-line
  .v-text-field__prefix,
.v-text-field.v-text-field--enclosed.v-text-field--single-line
  .v-text-field__suffix {
  font-size: 12px;
  color: var(--v-secondaryColor-base);
}
.add-percentage-button {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.form-balance {
  font-size: 12px;
  font-weight: 600;
}
.v-label {
  font-size: 14px;
}
.info-text {
  font-size: 14px;
  color: var(--v-secondaryColor-base);
}
.text-block {
  width: 50px;
  text-align: center;
  font-size: 12px;
}
.success-color {
  color: var(--v-success-base);
}
.trade-pair-title {
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
}
</style>
