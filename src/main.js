// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import './plugins/vuetify'
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
// import 'babel-polyfill';

// css
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
 
Vue.use(Vuetify);

Vue.config.productionTip = false;

Vue.filter('dateFormat', function (value) {
  if (!value) return '';
  const d = new Date(`${value}Z`);
  return `
  ${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}
  ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}
  `.trim();
});

Vue.filter('dateFormat2', function (value) {
  if (!value) return '';
  const d = new Date(`${value}Z`);
  return `
  ${d.getFullYear().toString()}. ${(d.getMonth()+1).toString()}. ${d.getDate().toString()}.
  ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}
  `.trim();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
