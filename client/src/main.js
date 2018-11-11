import Vue from 'vue';
import VueSocketio from 'vue-socket.io';
import VueMoment from 'vue-moment';
import App from './App';
import router from './router';
import config from './config/config.json';

Vue.use(VueSocketio, config.apiUrl);
Vue.use(VueMoment);

/* eslint-disable no-new */
new Vue({
  sockets: {
    connect() {
      console.log('Socket connected');
    },
    reconnecting() {
      console.log('Socket is reconnecting...');
    },
    disconnect() {
      console.log('Socket disconnected');
    },
  },
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
