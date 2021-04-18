<template>
  <div>
    <v-simple-table class="primaryBack" dense fixed-header height="198">
      <template v-slot:default>
        <thead class="larger-header">
          <tr>
            <th class="secondaryBack text-no-wrap">Placed</th>
            <th class="secondaryBack text-no-wrap">Instrument</th>
            <th class="secondaryBack text-no-wrap">Side</th>
            <th class="secondaryBack text-no-wrap">Type</th>
            <th class="secondaryBack text-no-wrap">Price</th>
            <th class="secondaryBack text-no-wrap">Quantity</th>
            <th class="secondaryBack text-no-wrap">Status</th>
          </tr>
        </thead>

        <tbody class="borderless">
          <tr v-for="(item, index) in orders.slice().reverse()" :key="index">
            <td class="text-no-wrap font-size-12">
              {{ format(item.transactTime) }}
            </td>
            <td
              class="text-no-wrap font-size-12"
              :style="{ cursor: 'pointer' }"
              v-on:click="goTo(`/markets/${item.instrumentId.symbol}`)"
            >
              {{ item.instrumentId.symbol }}
            </td>
            <td
              class="text-no-wrap font-size-12"
              :class="[item.side == 'BUY' ? ' success--text' : 'error--text']"
            >
              {{ item.side }}
            </td>
            <td class="text-no-wrap font-size-12">{{ item.ordType }}</td>
            <td class="text-no-wrap font-size-12">{{ item.price }}</td>
            <td class="text-no-wrap font-size-12">{{ item.orderQty }}</td>
            <td class="text-no-wrap font-size-12">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">{{ item.text }}</span>
                </template>
                <span>{{ item.status }}</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
const utils = require("../../lib/utils");

export default {
  name: "OrdersList",
  props: ["orders"],
  methods: {
    format(date) {
      if (typeof date === "number") return utils.formatTimestamp(date);
      else return utils.formatDate(date, "YYYYMMDD-HH:mm:ss");
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
</style>
