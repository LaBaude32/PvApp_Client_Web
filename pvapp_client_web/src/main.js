import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import moment from "moment";

Vue.config.productionTip = false;

moment.locale("fr");
Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(String(value)).format("LLLL");
  }
});

axios.defaults.baseURL = process.env.VUE_APP_ROOT_URL;

new Vue({
  router,
  store,
  vuetify,
  axios,
  render: h => h(App)
}).$mount("#app");
