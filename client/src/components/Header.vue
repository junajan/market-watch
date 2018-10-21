<template>
  <header class="main-header">
    <router-link to="/" class="logo">
      <span class="logo-mini"><b>MW</b></span>
      <span class="logo-lg"><b>Market</b> watch</span>
    </router-link>
    <nav class="navbar navbar-static-top">
      <span v-on:click="toggleSidebar()" class="sidebar-toggle pointer">
        <span class="sr-only">Toggle navigation</span>
      </span>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    toggleSidebar() {
      this.$root.$emit('toggleSidebar');
    },
  },
};
</script>
