<template>
    <div class="chart" v-bind:id="'futures-chart-'+_uid">
    </div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  name: 'FuturesChart',
  props: {
    data: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
    };
  },
  methods: {
    renderChart(data) {
      const loadedAt = this.$options.filters.moment(data[0].loadedAt, 'H:mm:ss');

      Highcharts.chart(`futures-chart-${this._uid}`, {
        chart: {
          type: 'line',
        },
        title: {
          text: `${this.name} Futures term structure`,
        },
        subtitle: {
          text: `Data loaded at ${loadedAt}`,
        },
        xAxis: {
          categories: ['Jan', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yAxis: {
          title: {
            text: 'Price in USD',
          },
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true,
            },
            enableMouseTracking: false,
          },
        },
        series: [{
          data: [7.0, 10.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
        }],
      });
    },
  },
  watch: {
    data(data) {
      if (!data.length) { return; }

      this.$nextTick(function () {
        this.renderChart(data);
      });
    },
  },
  created() {
    this.$nextTick(function () {
      this.renderChart(this.data);
    });
  },
};
</script>

<style scoped>
    .chart {
        height: 300px;
        width: 100%;
    }
</style>
