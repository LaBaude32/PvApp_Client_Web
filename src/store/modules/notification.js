const state = () => ({
  text: "",
  color: "blue",
  state: false,
  btnColor: "red",
  isDark: false
});

const getters = {
  state: (state) => state.state,
  text: (state) => state.text,
  color: (state) => state.color,
  btnColor: (state) => state.btnColor,
  isDark: (state) => state.isDark
};

const mutations = {
  CLOSE(state) {
    state.text = "";
    state.color = "grey";
    state.state = false;
    state.isDark = false;
  },
  SUCCESS(state, text) {
    state.text = text;
    state.color = "green";
    state.state = true;
    state.btnColor = "white";
  },
  STANDARD(state, text) {
    state.text = text;
    state.color = "red"
    state.state = true;
  },
  ERROR(state, text) {
    state.text = text;
    state.state = true;
    state.color = "red";
    state.btnColor = "white";
  }
};

const actions = {
  close({ commit }) {
    commit("CLOSE");
  },
  success({ commit }, text) {
    commit("SUCCESS", text);
    setTimeout(() => {
      commit("CLOSE", text);
    }, 6000);
  },
  standard({ commit }, text) {
    commit("STANDARD", text);
    setTimeout(() => {
      commit("CLOSE", text);
    }, 6000);
  },
  error({ commit }, text) {
    commit("ERROR", text);
    setTimeout(() => {
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
