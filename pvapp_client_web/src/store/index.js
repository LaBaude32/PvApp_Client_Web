import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";

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
      ...user
    }
  }
});
