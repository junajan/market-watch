import Vue from 'vue';
import Vue2Filters from 'vue2-filters';

Vue.use(Vue2Filters);

Vue.filter('capitalize', (value) => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('lowercase', (value) => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toLowerCase() + value.slice(1);
});
