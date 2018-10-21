<template>
    <section class="content-header">
        <h1>
            {{ $route.meta.title }}
            <small>{{ $route.meta.subtitle }}</small>
        </h1>
        <ol class="breadcrumb" v-if="showNavigation">
            <li>
                <router-link to="/">
                    <i class="fa fa-dashboard"></i> Home
                </router-link>
            </li>
            <li v-for="item in (crumbs || [])" :key="item.name">
                <router-link :to="item.path">
                    {{ item.name }}
                </router-link>
            </li>

            <li class="active">{{ $route.name }}</li>
        </ol>
    </section>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'BreadCrumbs',
  data() {
    return {
      crumbs: [],
      showNavigation: false,
    };
  },
  created() {
    this.crumbs = this.getCrumbs(this.$route);
    this.showNavigation = this.$route.path !== '/';
  },
  watch: {
    $route(to) {
      this.crumbs = this.getCrumbs(to);
      this.showNavigation = this.$route.path !== '/';
    },
  },
  methods: {
    getCrumbs: (route) => {
      let lastPath = null;
      const crumbs = route.matched
        .map(({ path, name }) => ({ path, name }))
        .filter((crumb) => {
          console.log(crumb);
          const path = _.trim(crumb.path, '/');
          console.log(path, lastPath);
          const remove = path !== lastPath;
          lastPath = path;
          return remove;
        });

      crumbs.pop();
      return crumbs;
    },
  },
};
</script>
