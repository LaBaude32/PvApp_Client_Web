const state = {
  text: "",
  type: undefined,
  state: false,
  btnColor: "red",
  isDark: false
};

const getters = {
  state: state => state.state,
  text: state => state.text,
  type: state => state.type,
  btnColor: state => state.btnColor,
  isDark: state => state.isDark
};

const mutations = {
  CLOSE(state) {
    state.text = "";
    state.type = undefined;
    state.state = false;
    state.isDark = false;
  },
  SUCCESS(state, text) {
    state.text = text;
    state.type = "success";
    state.state = true;
    state.btnColor = "white";
  },
  STANDARD(state, text) {
    state.text = text;
    state.state = true;
  },
  ERROR(state, text) {
    state.text = text;
    state.state = true;
    state.type = "error";
    state.btnColor = "white";
  }
};

const actions = {
  close({ commit }) {
    commit("CLOSE");
  },
  success({ commit }, text) {
    commit("SUCCESS", text);
    setInterval(() => {
      commit("CLOSE", text);
    }, 6000);
  },
  standard({ commit }, text) {
    commit("STANDARD", text);
    setInterval(() => {
      commit("CLOSE", text);
    }, 6000);
  },
  error({ commit }, text) {
    commit("ERROR", text);
    setInterval(() => {
      commit("CLOSE", text);
    }, 6000);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
