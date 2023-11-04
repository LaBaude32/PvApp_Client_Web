import Axios from "axios";
import router from "./../../router";
// import { getRouteName } from "./../../utilities/constantes";
import routesCONST from "./../../utilities/constantes";

const state = {
  affairId: "",
  name: "",
  meetingType: null,
  address: "",
  progress: ""
};

const getters = {
  affairId: state => state.affairId,
  name: state => state.name,
  meetingType: state => state.meetingType,
  address: state => state.address,
  progress: state => state.progress
};

const mutations = {
  LOAD_AFFAIR(state, datas) {
    state.affairId = datas.affairId;
    state.name = datas.name;
    state.meetingType = datas.meetingType;
    state.address = datas.address;
    state.progress = datas.progress;
  }
};

const actions = {
  loadAffairByPv({ commit }, affairId) {
    Axios.get("getAffairById", {
      params: {
        affairId: affairId
      }
    }).then(response => {
      let datas = response.data.affairInfos;
      commit("LOAD_AFFAIR", datas);
    });
  },
  openAffair({ commit }, affairId) {
    Axios.get("affair", {
      params: {
        affairId: affairId
      }
    }).then(response => {
      let datas = response.data.affairInfos;
      commit("LOAD_AFFAIR", datas);
      router.push({
        name: routesCONST.affair.name,
        params: { id: this.state.affair.affairId }
      });
    });
  },
  openPv({ commit }, pvId) {
    //FIXME: Corriger ça, ce call API n'a pas de sens puisqu'il est refait à l'ouverture de la page
    Axios.get("pv", {
      params: {
        pvId: pvId,
        userId: this.state.user.userId
      }
    }).then(response => {
      let affairId = response.data.pv.affairId;
      Axios.get("affair", {
        params: {
          affairId: affairId
        }
      }).then(response => {
        let datas = response.data.affairInfos;
        commit("LOAD_AFFAIR", datas);
        router.push({
          name: routesCONST.pv.name,
          params: { id: pvId }
        });
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
