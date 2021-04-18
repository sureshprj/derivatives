<template>
  <v-dialog v-model="show" width="400" persistent>
    <v-card class="primaryBack text-center">
      <v-card-title class="secondaryBack dialog-title">
        {{ action }} token
        <v-spacer></v-spacer>
        <v-btn text small @click="onClose">
          <v-icon size="20" color="secondaryColor">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <img class="mt-4" src="../../assets/navbar/metamask-fox-lg.svg" alt="" />
      <div class="px-8 text-center">
        <p class="info-text" v-if="error">
          {{ action | combine }} {{ symbol | uppercase }} failed
        </p>
        <p class="info-text" v-else-if="!success && unlocked">
          Locking {{ symbol | uppercase }}. You won't be able to use it for
          trading until you unlock it again
        </p>
        <p class="info-text" v-else-if="!success && !unlocked">
          Unlocking {{ symbol | uppercase }}. It will remain unlocked for future
          trades
        </p>
        <p class="info-text" v-else-if="success && unlocked">
          Locked {{ symbol | uppercase }}. You won't be able to use it for
          trading until you unlock it again
        </p>
        <p class="info-text" v-else-if="success && !unlocked">
          Unlocked {{ symbol | uppercase }}. It will remain unlocked for future
          trades
        </p>
      </div>
      <div class="secondaryBack py-4 px-12">
        <div class="d-flex mt-6 align-center justify-center">
          <div class="text-block">
            <p>{{ action | capitalize }}</p>
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
import capitalize from "lodash/capitalize";
import get from "lodash/get";
import noop from "lodash/noop";

export default {
  props: {
    error: {
      default: false,
      type: Boolean
    },
    onClose: {
      default: noop,
      type: Function
    },
    show: {
      default: false,
      type: Boolean
    },
    success: {
      default: false,
      type: Boolean
    },
    token: {
      default: () => {},
      type: Object
    }
  },
  computed: {
    action: function() {
      return this.unlocked ? "lock" : "unlock";
    },
    finishCircle: function() {
      return this.success ? "success" : "primary";
    },
    progressColor: function() {
      return this.success ? "success" : "primary";
    },
    showWaitingConfirmation: function() {
      return !(this.success || this.error);
    },
    symbol: function() {
      return get(this, "token.symbol");
    },
    unlocked: function() {
      return get(this, "token.unlocked");
    }
  },
  filters: {
    capitalize: value => capitalize(value),
    combine: (value = "") => (value === "lock" ? "Locking" : "Unlocking"),
    uppercase: (value = "") => value.toUpperCase()
  }
};
</script>
