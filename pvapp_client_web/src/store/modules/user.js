const state = {
  isLogged: false
};

const getters = {
  logged: state => state.isLogged
};

const mutations = {
  change(state) {
    state.isLogged = !state.isLogged;
  }
};

const actions = {
  invert(context) {
    context.commit("change");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}