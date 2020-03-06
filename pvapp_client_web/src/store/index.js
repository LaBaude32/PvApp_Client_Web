import Vue from "vue";
import Vuex from "vuex";
import counter from "./modules/counter";
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
    counter
  }
});
