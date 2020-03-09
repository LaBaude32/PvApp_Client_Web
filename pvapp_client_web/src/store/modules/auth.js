import axios from "axios";
import router from "./../../router";

const instanceAxios = axios.create({
  baseURL: process.env.VUE_APP_ROOT_URL,
  timeout: 1000,
  withCredentials: false
});

const state = {
  token_type: "",
  token: ""
};

const getters = {
  token: state => state.token,
  token_type: state => state.token_type,
};

const mutations = {
  LOGIN(state, datas) {
    state.token = datas.token;
    state.token_type = datas.token_type;
  },
  ERROR_CO(state) {
    state.result = "errorId";
  },
  ERROR_ID(state) {
    state.result = "errorConnection";
  },
  LOGOUT(state) {
    state.token = "";
    state.token_type = "";
  }
};

const actions = {
  login({ commit, dispatch }, data) {
    instanceAxios
      .post("/token", data)
      .then(function (response) {
        if (response.status == 201) {
          let datas = {
            token: response.data.token,
            token_type: response.data.token_type
          };
          commit("LOGIN", datas);
          localStorage.setItem('user-token', response.data.token);
          localStorage.setItem('user-token_type', response.data.token_type);
          dispatch("user/login", data);
        } else if (response.data.login_result == "error") {
          commit("ERROR_ID");
        }
      })
      .catch(function (error) {
        console.log(error);
        commit("ERROR_CO");
      });
  },
  logout({ commit }) {
    localStorage.clear();
    commit("LOGOUT");
    router.push("Login");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
