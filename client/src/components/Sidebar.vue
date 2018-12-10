<template>
  <aside class="main-sidebar">
    <section class="sidebar">
      <SideMenu></SideMenu>
    </section>
  </aside>
</template>

<script>
import SideMenu from './SideMenu';

export default {
  name: 'Sidebar',
  components: {
    SideMenu,
  },
};
</script>
