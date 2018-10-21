<template>
    <div>


        <Message v-if="vixSpreads === null" header="Loading error" message="An error occured while loading VIX spread data"></Message>
        <div v-else>
            <span>Data: {{ vixSpreads }}</span>
            <div class="nav-tabs-custom">
                <!-- Tabs within a box -->
                <ul class="nav nav-tabs pull-right">
                    <li class="active"><a href="#revenue-chart" data-toggle="tab">Area</a></li>
                    <li><a href="#sales-chart" data-toggle="tab">Donut</a></li>
                    <li class="pull-left header"><i class="fa fa-inbox"></i> Sales</li>
                </ul>
                <div class="tab-content no-padding">
                    <!-- Morris chart - Sales -->
                    <div class="chart tab-pane active"
                         id="revenue-chart"
                         style="position: relative; height: 300px;"></div>
                    <div class="chart tab-pane"
                         id="sales-chart"
                         style="position: relative; height: 300px;"></div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import Message from '../../components/Message'

export default {
  name: 'Home',
  components: {
    Message
  },
  data: function () {
    return {
      vixSpreads: []
    }
  },
  methods: {
    onSpreadData: function (data) {
      this.vixSpreads = data || null
    }
  },
  sockets:{
    'spreads::VIX': function (data) {
        this.onSpreadData(data)
    }
  },
  created: function () {
    this.$socket.emit('spreads::get::ticker', 'VX', data => this.onSpreadData(data));
  },
  destroyed: function () {
    console.log("DESTROY")
  }
};
</script>
