import Vue from 'vue';
import Router from 'vue-router';
import NotFound from '@/pages/Common/NotFound';
import Home from '@/pages/Home/Home';
import Spreads from '@/pages/Spreads/Home';
import SpreadsAlerts from '@/pages/Spreads/Alerts';

import HighchartsVue from 'highcharts-vue';

Vue.use(Router);
Vue.use(HighchartsVue);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Home,
    meta: {
      menu: true,
      icon: 'dashboard',
      title: 'Home - Volatility trading',
      subtitle: 'Tools for volatility trading',
    },
  },
  {
    path: '/spreads',
    name: 'Spreads',
    component: Spreads,
    meta: {
      menu: true,
      icon: 'arrows-h',
      title: 'VIX futures spreads',
    },
    children: [
      {
        path: '',
        component: Spreads,
        name: 'Spreads',
        meta: {
          menu: true,
          icon: 'history',
          title: 'Spreads',
          subtitle: 'Trading VX spreads',
        },
      },
      // {
      //       path: 'history',
      //       component: SpreadsHistory,
      //       name: 'History',
      //       meta: {
      //         menu: true,
      //         icon: '',
      //         title: 'Spreads :: History',
      //       },
      //     },
      {
        path: 'alerts',
        component: SpreadsAlerts,
        name: 'Alerts',
        meta: {
          menu: true,
          icon: 'bell',
          title: 'Spreads :: Alerts',
        },
      },
      //     {
      //       path: 'settings',
      //       component: SpreadsSettings,
      //       name: 'Settings',
      //       meta: {
      //         menu: true,
      //         icon: 'cogs',
      //         title: 'Spreads :: Settings',
      //       },
      //     },
    ],
  },
  {
    path: '*',
    component: NotFound,
    name: '404 Not Found',
    meta: {
      title: '404 Not Found',
      crumbs: [{
      }],
    },
  },
];

const router = new Router({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || to.name;
  next();
});

export default router;
