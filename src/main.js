import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import moment from "moment";

Vue.config.productionTip = false;

moment.locale("fr");
Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("LLLL");
  }
});

Vue.filter("formatDateWithA", function(value) {
  if (value) {
    return moment(String(value)).format("dddd LL à LT");
  }
});

Vue.filter("formatDateWithAShort", function(value) {
  if (value) {
    return moment(String(value)).format("ddd Do MMM YYYY à LT ");
  }
});

Vue.filter("formatDateShortDayOnly", function(value) {
  if (value) {
    return moment(String(value)).format("ddd Do MMM YYYY");
  }
});

const token = localStorage.getItem("user-token");
const token_type = localStorage.getItem("user-token_type");
if (token) {
  axios.defaults.headers.common["Authorization"] = token_type + " " + token;
}

axios.defaults.baseURL = import.meta.env.VITE_APP_ROOT_URL;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
