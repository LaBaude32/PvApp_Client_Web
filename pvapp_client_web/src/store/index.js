import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import affair from "./modules/affair";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: {
      namespaced: true,
      ...user
    },
    auth: {
      namespaced: true,
      ...auth
    },
    affair: {
      namespaced: true,
      ...affair
    }
  }
});
