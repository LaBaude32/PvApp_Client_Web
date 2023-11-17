import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import { DateTime, Settings } from "luxon";
Vue.config.productionTip = false;

Settings.defaultLocale = "fr";

Vue.filter("formatDate", function (value) {
  if (value) {
    return DateTime.fromSQL(value).toFormat("ff");
  }
});

Vue.filter("formatDateWithA", function (value) {
  if (value) {
    return DateTime.fromSQL(value).toFormat("ccc d LLL yyyy à T");
  }
});

Vue.filter("formatDateShortDayOnly", function (value) {
  if (value) {
    return DateTime.fromSQL(value).toFormat("ccc d LLL y");
  }
});

const token = localStorage.getItem("token");
const tokenType = localStorage.getItem("tokenType");
if (token) {
  axios.defaults.headers.common["Authorization"] = tokenType + " " + token;
}

axios.defaults.baseURL = import.meta.env.VITE_APP_ROOT_URL;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
