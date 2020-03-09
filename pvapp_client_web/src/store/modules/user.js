import axios from "axios";
import router from "./../../router";

const instanceAxios = axios.create({
  timeout: 1000,
  withCredentials: false,
  // Authorization: rootGetters.token_type + " " + rootGetters.token
});

const state = {
  isLogged: false,
  firstName: "",
  lastName: "",
  email: "",
  fullName: "",
  resultCo: "",
  userId: ""
};

const getters = {
  logged: state => state.isLogged,
  firstName: state => state.firstName,
  lastName: state => state.lastName,
  email: state => state.email,
  fullName: state => state.fullName,
  resultConnetion: state => state.resultCo
};

const mutations = {
  LOGIN(state, datas) {
    state.resultCo = "success";
    state.isLogged = true;
    state.firstName = datas.firstName;
    state.lastName = datas.lastName;
    state.email = datas.email;
    state.fullName = datas.firstName + " " + datas.lastName;
    state.userId = datas.userId;
  },
  ERROR_CO(state) {
    state.result = "errorId";
  },
  ERROR_ID(state) {
    state.result = "errorConnection";
  },
  LOGOUT(state) {
    state.resultCo = "";
    state.isLogged = false;
    state.firstName = "";
    state.lastName = "";
    state.email = "";
    state.fullName = "";
    state.userId = "";
  }
};

const actions = {
  login({ commit }, data) {
    instanceAxios
      .post("/login", data)
      .then(function (response) {
        if (response.data.login_result == "success") {
          let datas = {
            userId: response.data.user_id,
            firstName: response.data.user_data.firstName,
            lastName: response.data.user_data.lastName,
            email: response.data.user_data.email
          };
          commit("LOGIN", datas);
          localStorage.setItem("userId", response.data.user_id);
          window.setTimeout(function redirect() {
            router.push("board");
          }, 5000);
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
