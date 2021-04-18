<template>
  <div class="line-chart">
    <apexchart
      type="line"
      height="45"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "GridLiceChart",
  data: () => ({
    series: [
      {
        name: "series1",
        data: [
          [1994, 30],
          [1995, 0],
          [1996, 1000],
          [1997, 0]
        ]
      }
    ],
    chartOptions: {
      chart: {
        type: "line",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      colors: ["#008000"],
      dataLabels: {
        enabled: false
      },
      labels: [""],
      xaxis: {
        labels: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      stroke: {
        show: true,
        width: 1,
        curve: "smooth",
        lineCap: "butt"
      },
      grid: {
        show: false
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      tooltip: {
        enabled: false
      }
    }
  }),
  methods: {}
});
</script>
<style lang="scss">
.line-chart {
  max-height: 58px;
  width: 120px;
}

//start md screen
@media only screen and (min-width: 960px) and (max-width: 1263px) {
  .line-chart {
    width: 100px;
  }
}
// end md screen

//start sm screen
@media only screen and (max-width: 959px) {
  .line-chart {
    width: 90px;
    margin-right: -18px !important;
  }
  .markets {
    .line-chart {
      width: 90px !important;
      margin: 0px auto !important;
      margin-left: -34px !important;
    }
  }
}
// end md screen
</style>
