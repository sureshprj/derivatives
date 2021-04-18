<template>
  <apexchart
    type="area"
    :height="chartHeight"
    :options="tableChartOptions"
    :series="graphData"
  ></apexchart>
</template>

<script>
import Vue from "vue";
import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

export default {
  name: "tableChart",
  props: ["graphData", "chartHeight", "chartColor"],
  data() {
    return {
      tableChartOptions: {
        chart: {
          type: "line",
          stacked: false,
          sparkline: {
            enabled: true
          }
        },
        fill: {
          type: "gradient",
          colors: this.colors,
          gradient: {
            shadeIntensity: 0.1,
            inverseColors: false,
            opacityFrom: 0.1,
            opacityTo: 0.01,
            stops: [0, 80]
          }
        },
        colors: ["#00D46A"],
        stroke: {
          width: 2,
          curve: "smooth"
        },
        xaxis: {
          type: "datetime"
        },
        tooltip: {
          enabled: false,
          shared: false,
          x: {
            format: "dd MMM - HH:mm:ss"
          },
          y: {
            formatter: function(val) {
              return "$" + val.toFixed(2);
            }
          }
        }
      }
    };
  },
  beforeMount() {
    if (this.chartColor < 0) {
      this.tableChartOptions.colors = ["var(--v-error-base"];
    } else {
      this.tableChartOptions.colors = ["var(--v-success-base"];
    }
  }
};
</script>

<style lang="scss" scoped></style>
