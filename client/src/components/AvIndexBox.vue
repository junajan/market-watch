<template>
    <div class="nav-tabs-custom">
        <!-- Tabs within a box -->
        <ul class="nav nav-tabs pull-right ui-sortable-handle">
            <li><a href="#avbox-info" data-toggle="tab" aria-expanded="false">Info</a></li>
            <li class="active">
                <a href="#avbox-chart" data-toggle="tab" aria-expanded="false">
                    Chart
                </a>
            </li>
            <li class="pull-left header">
                <i class="fa fa-line-chart"></i>
                {{name}} price: {{price}}
            </li>
        </ul>
        <div class="tab-content" v-if="history === null">
            <Message header="Loading error" message="An error occurred while loading data" />
        </div>
        <div class="tab-content" v-else>
            <div class="tab-pane" id="avbox-info">
                <table class="mb-0 table-responsive table table-striped">
                    <tbody>
                        <tr v-for="(row, index) in Object.entries(
                            Object.assign({}, history.meta, info)
                          )" :class="{ 'text-bold': !index }" :key="row[0]">
                            <td class="text-bold">{{ row[0] }}</td>
                            <td>{{ row[1] }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="tab-pane active" id="avbox-chart">
                <StocksChart
                        v-if="history.history"
                        v-bind:data="history.history"
                        v-bind:name="name" />
            </div>
        </div>
    </div>
</template>

<script>
import Message from './Message';
import StocksChart from './StocksChart';

export default {
  name: 'AvIndexBox',
  props: {
    name: {
      type: String,
    },
  },
  components: {
    Message,
    StocksChart,
  },
  data() {
    return {
      price: '',
      history: {
        meta: {},
      },
      info: {},
    };
  },
  methods: {
    onPrice(price) {
      this.price = price || null;
    },
    onHistory(data) {
      this.history = data || {};
    },
    onInfo(data) {
      if (data) {
        this.info = data;
        this.onPrice(data.price);
      }
    },
  },
  created() {
    // load data at start
    this.$socket.emit('av::get::history', this.name, data => this.onHistory(data));
    this.$socket.emit('av::get::info', this.name, data => this.onInfo(data));

    this.$socket.on(`av::price::${this.name}`, price => this.onPrice(price));
  },
};
</script>

<style scoped>
.nav-tabs-custom {
    height: 370px;
}
</style>
