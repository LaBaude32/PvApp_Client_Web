import { createStore } from "vuex";
import user from "./modules/user";
import auth from "./modules/auth";
import affair from "./modules/affair";
import notification from "./modules/notification";

const store = createStore({
  modules: {
    user: {
      namespaced: true,
      ...user
    },
    auth: {
      namespaced: true,
      ...auth
    },
    affair: {
      namespaced: true,
      ...affair
    },
    notification: {
      namespaced: true,
      ...notification
    }
  }
});

export default store;
