<template>
    <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
</template>


<script>
export default {
  props: ['series'],
  created() {
  },
  data() {
    return {
      updateArgs: [true, true, { duration: 1000 }],
      chartOptions: {
        chartType: 'Spline',
        title: '',
        xAxis: {
          type: 'datetime',
          format: '%b',
          title: {
            text: 'Expiration month',
          },
        },
        yAxis: {
          title: {
            text: 'Price',
          },
        },
        tooltip: {
          enabled: true,
        },
        series: [],
      },
    };
  },
  watch: {
    series(series) {
      this.updateSeries(series);

      console.log('DATA:', series);
    },
  },
  methods: {
    updateSeries(data) {
      const series = [{
        data: data[0],
        name: 'VX Futures',
        type: 'spline',
        showInLegend: false,
        dataLabels: {
          enabled: true,
          formatter() {
            return `$ ${Number(this.y.toFixed(3))}`;
          },
        },
      }, {
        data: data[1],
        name: 'VIX Price',
        dashStyle: 'longdash',
        showInLegend: false,
        color: '#6fcd98',
        marker: {
          enabled: false,
        },
      }];

      const val = data[1][data[1].length - 1];
      data[1][data[1].length - 1] = {
        x: val[0],
        y: val[1],
        dataLabels: {
          enabled: true,
          formatter() {
            return `$ ${Number(this.y.toFixed(3))}`;
          },
        },
      };
      this.chartOptions.series = series;
    },
  },
};
</script>

<style scoped>
    .chart {
        width: 100%;
        height: 300px;
    }
</style>
