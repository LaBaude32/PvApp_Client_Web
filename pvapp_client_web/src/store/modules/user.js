import axios from "axios";
// import router from "./../../router";

const state = {
  isLogged: localStorage.getItem("isAuthenticated") || false,
  firstName: "",
  lastName: "",
  email: "",
  fullName: localStorage.getItem("fullName") || "",
  resultCo: "",
  userId: localStorage.getItem("userId") || ""
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
    axios
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
          localStorage.setItem("fullName", datas.firstName + " " + datas.lastName);
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
    commit("LOGOUT");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
