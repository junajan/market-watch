<template>

    <div class="nav-tabs-custom">
        <!-- Tabs within a box -->
        <ul class="nav nav-tabs pull-right ui-sortable-handle">
            <li><a href="#fbox-futures" data-toggle="tab" aria-expanded="false">Futures</a></li>
            <li><a href="#fbox-spreads" data-toggle="tab" aria-expanded="false">Spreads</a></li>
            <li class="active">
                <a href="#fbox-chart" data-toggle="tab" aria-expanded="true">Chart</a>
            </li>
            <li>
                <div class="header-control">
                    <label>
                        <input
                            type="checkbox"
                            checked="weeklyOn"
                            v-on:click="weeklyOn = !weeklyOn" />
                        Turn on weekly
                    </label>
                </div>
            </li>
            <li class="pull-left header">
                <i class="fa fa-chevron-right"></i>
                {{underlyingName}} futures spreads
            </li>
        </ul>
        <div class="tab-content" v-if="spreads === null">
            <Message header="Loading error" message="An error occurred while loading data" />
        </div>
        <div class="tab-content" v-else>
            <div class="tab-pane active" id="fbox-chart">
                <FuturesChart
                    v-if="futures"
                    v-bind:name="underlyingName"
                    v-bind:data="futures"
                    v-bind:weekly-on="weeklyOn"
                    v-bind:underlyingPrice="underlyingPrice"/>
            </div>
            <div class="tab-pane" id="fbox-futures">
                <FuturesTable v-bind:data="futures" v-bind:weekly-on="weeklyOn" />
            </div>
            <div class="tab-pane" id="fbox-spreads">
                <SpreadsTable v-bind:data="spreads" />
            </div>
        </div>
    </div>
</template>

<script>
import Message from './Message';
import SpreadsTable from './SpreadsTable';
import FuturesChart from './FuturesChart';
import FuturesTable from './FuturesTable';

export default {
  name: 'FutureSpreadBox',
  props: {
    futuresName: {
      type: String,
    },
    underlyingName: {
      type: String,
      default() {
        return this.futuresName;
      },
    },
  },
  components: {
    Message,
    FuturesChart,
    FuturesTable,
    SpreadsTable,
  },
  data() {
    return {
      spreads: [],
      underlyingPrice: 0,
      futures: [],
      weeklyOn: false,
    };
  },
  methods: {
    onSpreadData(data) {
      this.spreads = data || null;
    },
    onUnderlyingPrice(price) {
      this.underlyingPrice = price || null;
    },
    onFuturesData(data) {
      this.futures = data || null;
    },
  },
  created() {
    // load data at start
    this.$socket.emit('spreads::get::ticker', this.futuresName, data => this.onSpreadData(data));
    this.$socket.emit('futures::get::ticker', this.futuresName, data => this.onFuturesData(data));
    this.$socket.emit(
      'av::get::price',
      this.underlyingName,
      price => this.onUnderlyingPrice(price),
    );

    // realtime update
    this.$socket.on(`spreads::${this.futuresName}`, data => this.onSpreadData(data));
    this.$socket.on(`futures::${this.futuresName}`, data => this.onFuturesData(data));
    this.$socket.on(`av::price::${this.underlyingName}`, price => this.onUnderlyingPrice(price));
  },
};

</script>

<style scoped>
    .header-control {
        padding: 10px
    }
    .nav-tabs-custom {
        height: 370px;
    }
</style>
