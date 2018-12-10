<template>
  <div>
    <Header></Header>
    <Sidebar></Sidebar>

    <div class="content-wrapper">
      <BreadCrumbs></BreadCrumbs>

      <section class="content">
        <router-view/>
      </section>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BreadCrumbs from './components/BreadCrumbs';
import Footer from './components/Footer';

export default {
  name: 'VolatilityWatcher',
  components: {
    Header,
    Sidebar,
    Footer,
    BreadCrumbs,
  },
};
</script>
