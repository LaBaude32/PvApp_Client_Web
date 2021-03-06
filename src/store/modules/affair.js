import Axios from "axios";
import router from "./../../router";
// import { getRouteName } from "./../../utilities/constantes";
import routesCONST from "./../../utilities/constantes";

const state = {
  affairId: "",
  name: "",
  meeting_type: null,
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
  loadAffairByPv({ commit }, affairId) {
    Axios.get("getAffairById", {
      params: {
        id_affair: affairId
      }
    }).then(response => {
      let datas = response.data.affair_infos;
      commit("LOAD_AFFAIR", datas);
    });
  },
  openAffair({ commit }, affairId) {
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
  },
  openPv({ commit }, pvId) {
    //FIXME: Corriger ça, ce call API n'a pas de sens puisqu'il est refait à l'ouverture de la page
    Axios.get("getPvDetails", {
      params: {
        id_pv: pvId,
        id_user: this.state.user.userId
      }
    }).then(response => {
      let affairId = response.data.pv_details.affair_id;
      Axios.get("getAffairById", {
        params: {
          id_affair: affairId
        }
      }).then(response => {
        let datas = response.data.affair_infos;
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
