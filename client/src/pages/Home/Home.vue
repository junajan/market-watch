<template>
    <div class="row">
        <div class="col-md-12 ">
            <div class="nav-tabs-custom">
                <!-- Tabs within a box -->
                <ul class="nav nav-tabs pull-right ui-sortable-handle">
                    <li><a href="#vxspreads-futures" data-toggle="tab" aria-expanded="false">Futures</a></li>
                    <li><a href="#vxspreads-spreads" data-toggle="tab" aria-expanded="false">Spreads</a></li>
                    <li class="active"><a href="#vxspreads-chart" data-toggle="tab" aria-expanded="true">Chart</a></li>
                    <li>
                        <div class="header-control">
                            <label>
                                <input type="checkbox" :checked="weeklyOn" v-on:click="weeklyOn = !weeklyOn">
                                Turn on weekly
                            </label>
                        </div>
                    </li>
                    <li class="pull-left header"><i class="fa fa-inbox"></i> VX futures spreads</li>
                </ul>
                <div class="tab-content" v-if="vixSpreads === null">
                    <Message header="Loading error" message="An error occured while loading VIX spread data"></Message>
                </div>
                <div class="tab-content" v-else>
                    <div class="tab-pane active" id="vxspreads-chart">
                        <FuturesChart v-if="vixFutures" name="VIX" v-bind:data="vixFutures" v-bind:weekly-on="weeklyOn" ></FuturesChart>
                    </div>
                    <div class="tab-pane" id="vxspreads-futures">
                        <table class="table-responsive table table-striped">
                            <tbody>
                            <tr>
                                <th style="width: 10px">#</th>
                                <th>Name</th>
                                <th>Last</th>
                                <th>High</th>
                                <th>Low</th>
                                <th>Volume</th>
                                <th>Settlement</th>
                                <th>Expiration</th>
                                <th>Type</th>
                                <th>Loaded At</th>
                            </tr>
                            <tr v-for="(row, index) in vixFutures" v-if="!row.isWeekly || weeklyOn">
                                <td class="text-bold">{{ index + 1 }}.</td>
                                <td class="text-bold">
                                    {{ row.symbol }}
                                    <span v-if="!row.isWeekly">
                                        ({{ row.expiration | moment("MMMM") }})
                                    </span>
                                </td>
                                <td>
                                    {{ row.last }}
                                    <span :class="{ ['text-' + (row.change >= 0 ? 'green' : 'red')]: true}">
                                        ({{ (row.change > 0 ? '+' : '') + row.change }})
                                    </span>
                                </td>
                                <td>{{ row.high }}</td>
                                <td>{{ row.low }}</td>
                                <td>{{ row.volume }}</td>
                                <td>{{ row.settlement }}</td>
                                <td :title="row.expiration">
                                    {{ row.daysToExpiration }} days
                                </td>
                                <td :class="{ 'text-bold': !row.isWeekly }">
                                    {{ row.isWeekly ? 'weekly': 'monthly' }}
                                </td>
                                <td>
                                    {{ row.loadedAt | moment('H:mm:ss') }}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane" id="vxspreads-spreads">
                        <table class="table-responsive table table-striped">
                            <tbody>
                                <tr>
                                    <th style="width: 10px">#</th>
                                    <th>Name</th>
                                    <th>Months</th>
                                    <th>Expiration</th>
                                    <th>Price (change)</th>
                                    <th>Volume</th>
                                    <th>Updated at</th>
                                </tr>
                                <tr v-for="(row, index) in vixSpreads">
                                    <td class="text-bold">{{ index + 1 }}.</td>
                                    <td class="text-bold">{{ row.first.symbol }} / {{ row.second.symbol }}</td>
                                    <td>
                                        <span>{{ row.first.expiration | moment("MMMM") }}</span>
                                        /
                                        <span>{{ row.second.expiration | moment("MMMM") }}</span>
                                    </td>
                                    <td>
                                        <span :title="'First: ' + row.first.expiration + ' | Second: ' + row.second.expiration">
                                            {{ row.first.daysToExpiration }} days
                                        </span>
                                    </td>
                                    <td :title="'First: USD ' + row.first.last + ' | Second: USD ' + row.second.last">
                                        <span :class="{ ['text-' + (row.last.isContango ? 'green' : 'red')]: true}">
                                            {{ row.last.diff }}
                                        </span>
                                        <span :class="{ ['text-' + (row.change >= 0 ? 'green' : 'red')]: true}">
                                            ({{ (row.change > 0 ? '+' : '') + row.change }})
                                        </span>
                                    </td>
                                    <td>
                                        {{ row.volume }}
                                    </td>
                                    <td>
                                        {{ row.calculatedAt | moment('H:mm:ss') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Message from '../../components/Message';
import FuturesChart from '../../components/FuturesChart.vue';

export default {
  name: 'Home',
  components: {
    Message,
    FuturesChart,
  },
  data() {
    return {
      vixSpreads: [],
      vixFutures: [],
      weeklyOn: true,
    };
  },
  methods: {
    onSpreadData(data) {
      this.vixSpreads = data || null;
    },
    onFuturesData(data) {
      this.vixFutures = data || null;
    },
  },
  sockets: {
    'spreads::VX': function (data) {
      this.onSpreadData(data);
    },
    'futures::VX': function (data) {
      this.onFuturesData(data);
    },
  },
  created() {
    this.$socket.emit('spreads::get::ticker', 'VX', data => this.onSpreadData(data));
    this.$socket.emit('futures::get::ticker', 'VX', data => this.onFuturesData(data));
  },
};
</script>
<style scoped>
    .header-control {
        padding: 10px
    }
</style>
