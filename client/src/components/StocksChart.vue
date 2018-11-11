<template>
    <div class="chart" v-bind:id="'stocks-chart-'+_uid">
        Loading ...
    </div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  name: 'StocksChart',
  props: {
    data: {
      type: Array,
    },
    name: {
      type: String,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    renderData(data) {
      if (data && data.length) {
        const chartData = {
          loadedAt: this.$options.filters.moment(+new Date(), 'H:mm:ss'),
          values: data.map(row => [
            (new Date(row.date)).getTime(),
            row.adjustedClose,
          ]).reverse(),
        };

        if (this.chart) {
          this.redrawChart(this.chart, chartData);
        } else {
          this.chart = this.createChart(chartData);
        }
      }
    },
    redrawChart(chart, data) {
      chart.series[0].setData(data.values, true);
      chart.setTitle(null, { text: `Loaded at ${data.loadedAt}` }, true);
    },
    createChart(data) {
      const chartConfig = {
        rangeSelector: {
          selected: 1,
        },
        title: {
          text: `${this.name} Price chart`,
        },
        subtitle: {
          text: `Loaded at ${data.loadedAt}`,
        },
        yAxis: {
          title: {
            text: 'Price',
          },
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Date',
          },
        },
        legend: {
          enabled: false,
        },
        series: [{
          name: this.name,
          data: data.values,
          tooltip: {
            valueDecimals: 2,
          },
        }],
      };

      return Highcharts.chart(`stocks-chart-${this._uid}`, chartConfig);
    },
  },
  watch: {
    data(data) {
      this.$nextTick(function nextTick() {
        this.renderData(data);
      });
    },
  },
  created() {
    this.$nextTick(function nextTick() {
      this.renderData(this.data);
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
