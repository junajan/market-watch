<template>
    <div class="chart" v-bind:id="'futures-chart-'+_uid">
        Loading ...
    </div>
</template>

<script>
import Highcharts from 'highcharts';

export default {
  name: 'FuturesChart',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    name: {
      type: String,
      default: '',
    },
    underlyingPrice: {
      type: Number,
      default: 0,
    },
    weeklyOn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    renderData(data) {
      if (!data || !data.length) { return; }

      if (this.weeklyOn === false) { data = data.filter(row => !row.isWeekly); }

      const chartData = {
        loadedAt: this.$options.filters.moment(data[0].loadedAt, 'H:mm:ss'),
        underlyingPrice: this.underlyingPrice,
        xValues: data.map(row =>
          this.$options.filters.moment(row.expiration, 'DD. MMM'),
        ),
        yLast: data.map((row, index) => {
          let prev = index > 0 ? data[index - 1] : null;
          let next = index < data.length ? data[index + 1] : null;

          if (prev) { prev = Number(Number(row.last - prev.last).toFixed(2)); }

          if (next) { next = Number(Number(next.last - row.last).toFixed(2)); }

          const info = {
            diffNext: next,
            diffPrev: prev,
            change: row.change,
            daysToExpiration: row.daysToExpiration,
            expiration: this.$options.filters.moment(row.expiration, 'DD.MM.YYYY'),
            volume: row.volume,
          };

          return {
            info,
            y: row.last,
            color: row.isWeekly ? 'green' : null,
          };
        }),
        yPrev: data.map(row => ({
          y: Number(Number(row.last - row.change).toFixed(2)),
          color: row.isWeekly ? 'green' : null,
        })),
      };

      if (this.chart) {
        this.redrawChart(this.chart, chartData);
      } else {
        this.chart = this.createChart(chartData);
      }
    },
    redrawChart(chart, data) {
      chart.xAxis[0].update({ categories: data.xValues });
      chart.series[0].setData(data.yLast, true);
      chart.series[1].setData(data.yPrev, true);
      chart.setTitle(null, { text: `Loaded at ${data.loadedAt}` }, true);
    },
    createChart(data) {
      const chartConfig = {
        chart: {
          type: 'spline',
        },
        title: {
          text: `${this.name} Futures term structure`,
        },
        subtitle: {
          text: `Data loaded at ${data.loadedAt}`,
        },
        xAxis: {
          categories: data.xValues,
        },
        yAxis: {
          tickInterval: 0.2,
          title: {
            text: 'Price in USD',
          },
        },
        plotOptions: {
          spline: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        tooltip: {
          useHtml: true,
          formatter() {
            if (!this.point.info) { return `<b>Last Price: ${this.y} USD</b><br /> Expiration: ${this.x}`; }

            let change = this.point.info.change > 0
              ? `+${this.point.info.change}`
              : this.point.info.change;
            change = (change ? `(${change})` : '');

            return `
              Expiration: ${this.point.info.expiration} (${this.point.info.daysToExpiration} days) <br />
              <b>Last Price: ${this.y} USD ${change}</b><br />
              <b>Volume: ${this.point.info.volume}</b><br />${
  this.point.info.diffPrev ? `<b>Diff prev: ${this.point.info.diffPrev}</b><br />` : ''
}${this.point.info.diffNext ? `<b>Diff next: ${this.point.info.diffNext}</b><br />` : ''}`;
          },
        },
        series: [{
          name: 'Last price',
          data: data.yLast,
        }, {
          marker: {
            symbol: 'bullet',
          },
          visible: false,
          name: 'Prev price',
          data: data.yPrev,
        }],
      };

      if (data.underlyingPrice) {
        chartConfig.series.push({
          name: 'VIX price',
          showInLegend: false,
          enableMouseTracking: false,
          type: 'scatter',
          marker: {
            enabled: false,
          },
          data: [data.underlyingPrice],
        });

        chartConfig.yAxis.plotLines = [{
          value: data.underlyingPrice,
          color: 'green',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: `VIX: ${data.underlyingPrice}`,
          },
        }];
      }

      return Highcharts.chart(`futures-chart-${this._uid}`, chartConfig);
    },
  },
  watch: {
    data(data) {
      this.$nextTick(function nextTick() {
        this.renderData(data);
      });
    },
    underlyingPrice() {
      this.$nextTick(function nextTick() {
        this.renderData(this.data);
      });
    },
    weeklyOn() {
      this.$nextTick(function nextTick() {
        this.renderData(this.data);
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
