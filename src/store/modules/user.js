import axios from "axios";
// import router from "./../../router";

const state = () => ({
  isLogged: localStorage.getItem("isAuthenticated") || false,
  firstName: "",
  lastName: "",
  email: "",
  fullName: localStorage.getItem("fullName") || "",
  resultCo: "",
  userId: localStorage.getItem("userId") || ""
});

const getters = {
  logged: (state) => state.isLogged,
  firstName: (state) => state.firstName,
  lastName: (state) => state.lastName,
  email: (state) => state.email,
  fullName: (state) => state.fullName,
  resultConnetion: (state) => state.resultCo,
  userId: (state) => state.userId
};

const mutations = {
  LOGIN(state, user) {
    state.resultCo = "success";
    state.isLogged = true;
    state.firstName = user.firstName;
    state.lastName = user.lastName;
    state.email = user.email;
    state.fullName = user.firstName + " " + user.lastName;
    state.userId = user.userId;
  },
  ERROR_ID(state) {
    state.resultCo = "errorId";
  },
  ERROR_CO(state) {
    state.resultCo = "errorConnection";
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
    return new Promise((resolve) => {
      axios({ url: "/login", params: data, method: "get" }).then(function (response) {
        if (response.status == 202) {
          let user = {
            userId: response.data.userId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email
          };
          commit("LOGIN", user);
          localStorage.setItem("userId", user.userId);
          localStorage.setItem("fullName", user.firstName + " " + user.lastName);
          resolve();
        }
      });
    });
  },
  logout({ commit }) {
    commit("LOGOUT");
  },
  errorId({ commit }) {
    commit("ERROR_ID");
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
