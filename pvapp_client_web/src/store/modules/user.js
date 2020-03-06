const state = {
  isLogged: false
};

const getters = {
  logged: state => state.isLogged
};

const mutations = {
  change(state) {
    state.isLogged = !state.isLogged;
  },
  LOGIN(){
    alert('test');
  }
};

const actions = {
  invert(context) {
    context.commit("change");
  },
  login({commit}) {
    commit('LOGIN');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}