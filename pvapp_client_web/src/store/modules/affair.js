import Axios from "axios";
import router from "./../../router";
// import { getRouteName } from "./../../utilities/constantes";
import routesCONST from "./../../utilities/constantes";

const state = {
  affairId: "",
  name: "",
  meeting_type: "",
  address: "",
  progress: ""
};

const getters = {
  affairId: state => state.affairId,
  name: state => state.name,
  meeting_type: state => state.meeting_type,
  address: state => state.address,
  progress: state => state.progress
};

const mutations = {
  LOAD_AFFAIR(state, datas) {
    state.affairId = datas.id_affair;
    state.name = datas.name;
    state.meeting_type = datas.meeting_type;
    state.address = datas.address;
    state.progress = datas.progress;
  }
};

const actions = {
  loadAffair({ commit }, affairId) {
    Axios.get("getAffairById", {
      params: {
        id_affair: affairId
      }
    }).then(response => {
      let datas = response.data.affair_infos;
      commit("LOAD_AFFAIR", datas);
      router.push({
        name: routesCONST.affair.name,
        params: { id: this.state.affair.affairId }
      });
    });
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
