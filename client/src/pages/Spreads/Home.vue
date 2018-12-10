<template>
    <div class="row">
        <!-- Left col -->
        <section class="col-lg-7 connectedSortable">
            <div class="nav-tabs-custom">
                <!-- Tabs within a box -->
                <ul class="nav nav-tabs pull-right">
                    <li class="active">
                        <a href="#term-structure-chart" data-toggle="tab">
                            Chart
                        </a>
                    </li>
                    <li>
                        <a href="#term-structure-table" data-toggle="tab">
                            Table
                        </a>
                    </li>
                    <li class="pull-left header">
                        <i class="fa fa-chart-line"></i>Term structure
                    </li>
                </ul>
                <div class="tab-content">
                    <!-- Morris chart - Sales -->

                </div>
            </div>
        </section>
    </div>

</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      data: [],
    };
  },
  created() {
  },
  beforeDestroy() {
  },
  methods: {
  },
  components: {
  },
};
</script>
