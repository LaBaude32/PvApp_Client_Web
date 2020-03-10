import axios from "axios";
import router from "./../../router";

const state = {
  token_type: "",
  token: localStorage.getItem("user-token") || "",
  status: ""
};

const getters = {
  token: state => state.token,
  token_type: state => state.token_type,
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
  AUTH_SUCCESS(state, token, token_type) {
    state.status = "success";
    state.token = token;
    state.token_type = token_type;
  },
  AUTH_ERROR(state) {
    state.status = "error";
  }
};

const actions = {
  login({ commit, dispatch }, data) {
    axios
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
  },
  authRequest({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      // The Promise used for router redirect in login
      commit("AUTH_REQUEST");
      axios({ url: "/tokens", data, method: "POST" })
        .then(response => {
          const token = response.data.access_token;
          const token_type = response.data.token_type;
          localStorage.setItem("user-token", token);
          localStorage.setItem("user-token_type", token_type);
          axios.defaults.headers.common["Authorization"] =
            token_type + " " + token;
          localStorage.setItem("isAuthenticated", true);
          commit("AUTH_SUCCESS", token, token_type);
          dispatch("user/login", data, { root: true });
          resolve(response);
        })
        .catch(error => {
          commit("AUTH_ERROR", error);
          localStorage.removeItem("user-token");
          reject(error);
        });
    });
  },
  authLogout({ commit, dispatch }) {
    return new Promise(resolve => {

      localStorage.removeItem("user-token");
      localStorage.removeItem("fullName");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user-token_typen");
      localStorage.removeItem("userId");
      commit("AUTH_LOGOUT");
      dispatch("user/logout", null, { root: true });
      delete axios.defaults.headers.common["Authorization"];
      resolve();
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
