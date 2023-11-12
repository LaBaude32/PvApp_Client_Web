import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import moment from "moment";
import { DateTime, Settings } from "luxon";

Vue.config.productionTip = false;

moment.locale("fr");
Settings.defaultLocale = "fr";

Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(String(value)).format("LLLL");
  }
});

Vue.filter("formatDateWithA", function (value) {
  if (value) {
    // return moment(String(value)).format("dddd LL à LT");
    // return value.setLocale('fr').toLocaleString(DateTime.DATETIME_FULL);
    return DateTime.fromSQL(value).toFormat("cccc d LLL à T");
  }
});

Vue.filter("formatDateWithAShort", function (value) {
  if (value) {
    return moment(String(value)).format("ddd Do MMM YYYY à LT ");
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
