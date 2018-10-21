<template>
  <div>
    <ul class="sidebar-menu" data-widget="tree">
      <li class="header">MAIN NAVIGATION</li>

      <li v-for="route in routes"
          :key="route.path"
          :class="{ treeview: route.children, active: isMenuItemActive(route) }"
          v-if="route.meta.menu">
        <router-link :to="route.path">
          <i class="fa" :class="{ ['fa-'+route.meta.icon]: true }"></i>
          <span>{{ route.name }}</span>
          <span class="pull-right-container" v-if="route.children">
              <i class="fa pull-right"
                 :class="{
                    'fa-angle-down': isMenuItemActive(route),
                    'fa-angle-left': !isMenuItemActive(route)
                  }"></i>
          </span>
        </router-link>

        <ul class="treeview-menu" v-if="route.children">
          <li v-for="child in route.children"
              :key="child.path"
              v-if="child.meta.menu"
              :class="{ active: isChildItemActive(child, route.path) }">
            <router-link :to="route.path + '/' + child.path">
              <i class="fa" :class="{ ['fa-'+child.meta.icon]: true }"></i>
              {{ child.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'SideMenu',
  data() {
    console.log(this.$router.options.routes);
    return {
      routes: this.$router.options.routes,
    };
  },
  mounted() {
    this.$root.$on('toggleSidebar', () => {
      document.body.classList.toggle('sidebar-collapse');
      document.body.classList.toggle('sidebar-open');
    });
  },
  methods: {
    removeTrailingSlash(str) {
      return str.replace(/\/$/, "");
    },
    isMenuItemActive(route) {
      const currentPath = this.$route.path
      const menuPath = route.path
      return (currentPath === '/' && menuPath === '/')
        ||
        (menuPath !== '/' && currentPath.includes(menuPath));
    },
    isChildItemActive(route, parentRoute = '') {
      const currentPath = this.removeTrailingSlash(this.$route.path)
      const menuPath = this.removeTrailingSlash(
        [parentRoute, route.path].filter(Boolean).join('/')
      )
      return (currentPath === '/' && menuPath === '/')
        ||
        (menuPath !== '/' && currentPath === menuPath);
    },
  },
};
</script>
