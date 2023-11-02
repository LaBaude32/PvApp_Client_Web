import axios from "axios";
import router from "./../../router";
import routesCONST from "./../../utilities/constantes";

const state = {
  tokenType: "",
  token: localStorage.getItem("token") || "",
  status: ""
};

const getters = {
  token: state => state.token,
  tokenType: state => state.tokenType,
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status
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
  AUTH_LOGOUT(state) {
    state.token = "";
    state.token_type = "";
  },
  AUTH_REQUEST(state) {
    state.status = "loading";
  },
  AUTH_SUCCESS(state, token, tokenType) {
    state.status = "success";
    state.token = token;
    state.tokenType = tokenType;
  },
  AUTH_ERROR(state) {
    state.status = "error";
  }
};

const actions = {
  authRequest({ commit }, data) {
    return new Promise((resolve, reject) => {
      // The Promise used for router redirect in login
      commit("AUTH_REQUEST");
      axios({ url: "/tokens", data, method: "POST" })
        .then(response => {
          const token = response.data.access_token;
          const tokenType = response.data.token_type;
          localStorage.setItem("token", token);
          localStorage.setItem("tokenType", tokenType);
          axios.defaults.headers.common["Authorization"] = tokenType + " " + token;
          localStorage.setItem("isAuthenticated", true);
          commit("AUTH_SUCCESS", token, tokenType);
          resolve();
        })
        .catch(error => {
          commit("AUTH_ERROR", error);
          localStorage.removeItem("token");
          reject();
        });
    });
  },
  authLogout({ commit, dispatch }) {
    return new Promise(resolve => {
      localStorage.removeItem("token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("userId");
      commit("AUTH_LOGOUT");
      dispatch("user/logout", null, { root: true });
      delete axios.defaults.headers.common["Authorization"];
      router.push({ name: routesCONST.login.name });
      resolve();
    });
  },
  authError({ dispatch }) {
    dispatch("user/errorId", null, { root: true });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
