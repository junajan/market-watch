import Vue from 'vue';
import App from './App';
import router from './router';
import VueSocketio from 'vue-socket.io';
import config from './config/config.json';

Vue.use(VueSocketio, config.apiUrl);

/* eslint-disable no-new */
new Vue({
  sockets:{
    connect: function () {
      console.log('Socket connected');
    },
    reconnecting: function () {
      console.log("Socket is reconnecting...")

    },
    disconnect: function () {
      console.log("Socket disconnected")
    }
  },
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
