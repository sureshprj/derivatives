<template>
  <div class="markets">
    <v-row class="section-market max-width-screen">
      <v-col cols="12" class="our-market">
        <h2 class="page-title">MARKETS</h2>
      </v-col>
      <v-col cols="12">
        <div class="market-data-table">
          <v-row class="header border">
            <v-col cols="10" sm="10" md="6" lg="6" xl="6" class="col-hight">
              <v-tabs
                class="tab-cls"
                background-color="transparent"
                active-class="active-tab"
              >
                <v-tabs-slider color="#00D46A" height="1px"></v-tabs-slider>
                <v-tab class="normal-tab">All Markets</v-tab>
                <v-tab class="normal-tab">IEMDX</v-tab>
                <v-tab class="normal-tab">DAI</v-tab>
              </v-tabs>
            </v-col>
            <v-col cols="2" sm="2" md="6" lg="6" xl="6" class="search-box">
              <div class="grid-input">
                <v-text-field
                  class="input"
                  background-color="rgba(0, 0, 0,0.3)"
                  v-model="search"
                  label="Search"
                  single-line
                  hide-details
                >
                  <template slot="append">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.5352 12.7477L10.3141 9.52656C11.1125 8.55312 11.5938 7.30625 11.5938 5.94727C11.5938 2.83008 9.06445 0.300781 5.94727 0.300781C2.82734 0.300781 0.300781 2.83008 0.300781 5.94727C0.300781 9.06445 2.82734 11.5938 5.94727 11.5938C7.30625 11.5938 8.55039 11.1152 9.52383 10.3168L12.7449 13.5352C12.9637 13.7539 13.3164 13.7539 13.5352 13.5352C13.7539 13.3191 13.7539 12.9637 13.5352 12.7477ZM5.94727 10.4699C3.45078 10.4699 1.42188 8.44102 1.42188 5.94727C1.42188 3.45352 3.45078 1.42188 5.94727 1.42188C8.44102 1.42188 10.4727 3.45352 10.4727 5.94727C10.4727 8.44102 8.44102 10.4699 5.94727 10.4699Z"
                        fill="white"
                      />
                    </svg>
                  </template>
                </v-text-field>
              </div>
            </v-col>
          </v-row>

          <v-data-table
            :headers="getHeader"
            :items="marketsData"
            :search="search"
            class="grid-sys"
            show-expand
            itemClass="row-hieght"
            item-key="id"
          >
            <template v-slot:header.star>
              <img src="../assets/markets/star.svg" />
            </template>
            <template v-slot:header.name="{ header }">
              {{ header.text.toUpperCase() }}
            </template>

            <template v-slot:item.star>
              <div class="pad-left-10px">
                <img src="../assets/markets/star.svg" />
              </div>
            </template>
            <template v-slot:item.name="{ item }">
              <span class="first-col bold">{{
                item && item.name.split("/")[0]
              }}</span>
              <span class="split-txt"
                >/{{ item && item.name.split("/")[1] }}
              </span>
            </template>
            <template v-slot:item.change="{ item }">
              <span class="h-24-change">{{ item.change }}</span>
            </template>
            <template v-slot:item.line="{ item }">
              <div class="line-chart-grid">
                <GridLineChart :data="item"></GridLineChart>
              </div>
            </template>
            <template v-slot:item.data-table-expand="{ expand, isExpanded }">
              <img
                v-if="!isExpanded"
                src="../assets/markets/expand.svg"
                class="expand-icon pad-right-10px"
                @click="expand(!isExpanded)"
              />
              <img
                v-if="isExpanded"
                src="../assets/markets/collapse.svg"
                class="expand-icon-bright pad-right-10px"
                @click="expand(!isExpanded)"
              />
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">More info about {{ item.name }}</td>
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GridLineChart from "../components/markets/GridLineChart.vue";

/* const sortList: any = [
  {
    class: `sort-icon`,
    name: "Top Performers",
  },
]; */
export default Vue.extend({
  name: "Markets",
  components: {
    GridLineChart
  },
  data: () => ({
    search: "",
    headers: [
      {
        text: "",
        value: "star",
        align: "center",
        class: "h-txt h-padding",
        sortable: false
      },
      {
        text: "Market",
        value: "name",
        class: "h-txt"
      },
      {
        text: "Last price",
        align: "left",
        value: "lastPrice",
        class: "h-txt",
        sortable: false
      },
      {
        text: "24h High",
        align: "left",
        value: "high",
        class: "h-txt",
        sortable: false
      },
      {
        text: "24h Low",
        align: "left",
        value: "low",
        class: "h-txt",
        sortable: false
      },
      {
        text: "24h Change",
        align: "left",
        value: "change",
        class: "h-txt",
        sortable: false
      },
      {
        text: "24h Volume",
        align: "left",
        value: "volume",
        class: "h-txt",
        sortable: false
      },
      {
        text: "",
        value: "line",
        align: "left",
        sortable: false
      },
      {
        text: "",
        value: "data-table-expand",
        align: "center",
        sortable: false
      }
    ],

    marketsData: [
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        id: 1
      },
      {
        name: "LTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 2
      },
      {
        name: "ETH/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.459989,
        change: "+8.32%",
        volume: "1234.01K",
        maxLeverage: "100x",
        line: "1%",
        id: 3
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.024621,
        low: 43.459989,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 4
      },
      {
        name: "ETH/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 5
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 6
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 7
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 8
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 9
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "200x",
        id: 10
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 11
      },
      {
        name: "BTC/USDT",
        lastPrice: 9875.43,
        high: 0.02462176,
        low: 43.45998912,
        change: "+8.32%",
        volume: "1234.01K",
        line: "1%",
        maxLeverage: "100x",
        id: 12
      }
    ]
  }),
  computed: {
    getHeader: function() {
      let head = this.headers;
      if (this.$vuetify.breakpoint.xlOnly) {
        head.map(col => {
          if (col.value == "data-table-expand") {
            col["width"] = "100px";
          }
        });
      }
      if (this.$vuetify.breakpoint.lgOnly) {
        head.map(col => {
          if (col.value == "data-table-expand") {
            col["width"] = "70px";
          }
        });
      }
      if (this.$vuetify.breakpoint.mdOnly) {
        head.map(col => {
          if (col.value == "data-table-expand") {
            col["width"] = "35px";
          }
          if (col.value == "star") {
            col["width"] = "60px";
          }
        });
      }
      if (this.$vuetify.breakpoint.smAndDown) {
        head = [
          {
            text: "",
            value: "star",
            align: "center",
            class: "h-txt",
            sortable: false,
            width: "40px"
          },
          {
            text: "Market",
            value: "name",
            class: "h-txt"
          },
          {
            text: "Last price",
            align: "left",
            value: "lastPrice",
            class: "h-txt",
            sortable: false
          },
          {
            text: "24h High",
            align: "left",
            value: "high",
            class: "h-txt",
            sortable: false
          },
          {
            text: "24h Low",
            align: "left",
            value: "low",
            class: "h-txt",
            sortable: false
          },
          {
            text: "24h Change",
            align: "left",
            value: "change",
            class: "h-txt",
            sortable: false
          },
          {
            text: "24h Volume",
            align: "left",
            value: "volume",
            class: "h-txt",
            sortable: false
          },
          {
            text: "Max Leverage",
            value: "maxLeverage",
            align: "left",
            class: "h-txt",
            sortable: false
          },
          {
            text: "",
            value: "data-table-expand",
            align: "center",
            sortable: false
          }
        ];
      }

      return head;
    }
  },
  methods: {}
});
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Text&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
@import url("https://fonts.googleapis.com/css2?family=PT+Sans&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Red+Hat+Display&display=swap");
@import url("https://fonts.googleapis.com/css2?family=PT+Mono&display=swap");

.markets {
  background-color: #050e18;
  padding-bottom: 90px;
  background-size: auto, auto, auto, auto, cover;
  .data-table {
    margin: 0px 0px;
  }
  .max-width-screen {
    margin: 0px 5%;
  }
  .line-chart-section {
    padding: 34px 0px 0px 0px;
    flex-wrap: wrap;
    gap: 20px;
  }
  .head-txt {
    padding-top: 67px;
  }
  .our-market {
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 31px;
    color: #1262ff;
    padding: 0px 0px 28px 0px;
  }

  /*data table */
  .sort-icon {
    background-image: url("../assets/markets/sort_asc_icon.svg");
    width: 14px;
    height: 14px;
  }

  .market-data-table {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0px 4px 20px #000000;
    border-radius: 4px;
    .v-data-table-header {
      th {
        border-bottom: none !important;
      }
    }
    .expand-icon {
      opacity: 0.3;
      cursor: pointer;
    }
    .expand-icon-bright {
      opacity: 1;
      cursor: pointer;
    }
    .col-hight {
      padding: 0px;
      height: 59px;
      .tab-cls {
        .v-tabs-slider-wrapper {
          max-height: 1px;
        }
        .v-item-group {
          height: 60px;
        }
        .active-tab {
          font-weight: bold !important;
          text-transform: capitalize !important;
          color: var(--v-fontColor-base) !important;
        }
        .normal-tab {
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 19px;
          color: rgba(255, 255, 255);
          text-transform: none;
          padding: 0px 25px;
          letter-spacing: 0;
        }
      }
    }
    .border {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .header {
      border-radius: 4px 4px 0px 0px;
      background: rgba(0, 0, 0, 0.2);
      margin: 0px;
    }
    .v-data-table-header {
      background: rgba(0, 0, 0, 0.2);
      .active {
        color: var(--v-fontColor-base) !important;
        font-weight: bold;
      }
    }
    .grid-sys {
      font-family: "PT Sans";
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 19px !important;
      color: rgba(255, 255, 255, 0.7) !important;
      background: transparent !important;
      td {
        font-size: inherit !important;
      }
      tbody {
        color: rgba(255, 255, 255, 1) !important;
        tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
          background: rgba(0, 0, 0, 0.1) !important;
        }
      }
      .first-col {
        font-weight: bold;
      }
      .split-txt {
        font-weight: 400;
        opacity: 0.5;
      }
      .h-24-change {
        color: #00b865;
      }
    }

    .search-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .grid-input {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        justify-items: center;
        padding: 0px 8px;
        .v-label {
          font-style: italic !important;
          font-weight: normal !important;
          font-size: 14px !important;
          line-height: 16px !important;
          color: rgba(255, 255, 255, 0.5);
          left: 10px !important;
          top: 7px;
        }
        .input {
          width: 272px;
          font-style: italic !important;
          font-weight: normal !important;
          font-size: 14px !important;
          line-height: 18px !important;
          color: rgba(255, 255, 255, 0.5);
        }
        .v-input__append-inner {
          margin: 0px !important;
          display: unset;
          align-self: auto;
          opacity: 0.5;
          right: 15px;
          position: absolute;
        }
        .v-text-field {
          padding: 0px !important;
          margin: 0px !important;
        }
        .v-input__slot:before {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .v-input__slot {
          padding: 0px 5px;
        }
        .v-input--is-focused {
          opacity: 1;
        }
      }
    }
    .h-txt {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 18px;
      text-transform: capitalize;
      color: rgba(255, 255, 255, 0.7);
      border-bottom: none !important;
    }
  }
}
//start sm screen
@media only screen and (max-width: 959px) {
  .markets {
    .max-width-screen {
      margin: 0px 3.2%;
    }
  }
  .market-data-table {
    margin: 0px -12px;
    .h-txt {
      font-size: 11px !important;
      line-height: 16px !important;
      white-space: pre-wrap;
    }
    .grid-sys {
      font-size: 12px !important;
      line-height: 16px !important;
      .first-col {
        white-space: pre !important;
      }
    }
    .col-hight .tab-cls .normal-tab {
      padding: 0px 15px !important;
    }
    .sort-column {
      margin-left: 10px;
    }
    .pad-left-10px {
      padding-left: 0px !important;
    }
    .pad-right-10px {
      padding-right: 10px !important;
    }
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
    .v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
    .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
    .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
    .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
    .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
      padding: 0px 3px;
      height: 40px !important;
    }

    .search-box {
      .grid-input {
        .input {
          width: 212px !important;
        }
      }
    }
  }
}
//end sm screen

//start md screen
@media only screen and (min-width: 960px) and (max-width: 1264px) {
  .markets {
    .max-width-screen {
      margin: 0px 1%;
    }
  }
  .market-data-table {
    margin: 0px -12px;
  }
}
//end md screen

//start lg screen
@media only screen and (min-width: 1264px) and (max-width: 1904px) {
  .markets {
    .max-width-screen {
      margin: 0px 50px;
    }
    .market-data-table {
      margin: 0px -12px;
    }
  }
}
//end lg screen
//start xl screen
@media only screen and (min-width: 1904) {
  .markets {
    .max-width-screen {
      margin: 0px 50px;
    }
    .market-data-table {
      margin: 0px -12px;
    }
  }
}
//end xl screen
</style>
