<template>
  <v-dialog v-model="show" width="400" persistent>
    <v-card class="primaryBack text-center">
      <v-card-title class="secondaryBack dialog-title">
        Convert {{ fromCoin }}
        <v-spacer></v-spacer>
        <v-btn text small @click="onClose">
          <v-icon size="20" color="secondaryColor">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <img class="mt-4" src="../../assets/navbar/metamask-fox-lg.svg" alt="" />
      <div class="px-8 text-center">
        <p class="info-text" v-if="error">
          An unexpected error happened
        </p>
        <p class="info-text" v-else-if="success">
          Converted {{ value }} {{ fromCoin }} ({{ fromCoin }} to {{ toCoin }})
        </p>
        <p class="info-text" v-else>
          Confirm on Metamask to convert {{ value }} {{ fromCoin }} into
          {{ toCoin }}.
        </p>
      </div>
      <div class="secondaryBack py-4 px-12">
        <div class="d-flex mt-6 align-center justify-center">
          <div class="text-block">
            <p>Convert</p>
          </div>
        </div>
        <div class="d-flex align-center">
          <v-icon size="16" color="success">
            mdi-circle
            <v-icon>mdi-check</v-icon>
          </v-icon>
          <v-progress-linear :color="progressColor"></v-progress-linear>
          <v-icon :color="finishCircle" size="16">mdi-circle</v-icon>
        </div>
        <p class="info-text mt-6" v-if="showWaitingConfirmation">
          Waiting for confirmation...
        </p>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import noop from "lodash/noop";

export default {
  props: {
    error: {
      default: false,
      type: Boolean
    },
    fromCoin: {
      type: String
    },
    onClose: {
      default: noop,
      type: Function
    },
    toCoin: {
      type: String
    },
    show: {
      default: false,
      type: Boolean
    },
    success: {
      default: false,
      type: Boolean
    },
    value: {
      default: "0",
      type: String
    }
  },
  computed: {
    finishCircle: function() {
      return this.success ? "success" : "primary";
    },
    progressColor: function() {
      return this.success ? "success" : "primary";
    },
    showWaitingConfirmation: function() {
      return !(this.success || this.error);
    }
  }
};
</script>
