<template>
  <div v-if="affair" class="mb-10">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <ModifyProgress
        v-if="progressDialog"
        :progressValue.sync="affair.progress"
        :dialog.sync="progressDialog"
        :modifyProgressSave="modifyProgressSave"
      />
      <ModifyAffair
        v-if="affairDialog"
        :dialog.sync="affairDialog"
        :affairDatas.sync="affair"
        :validate="ModifyAffairSave"
        :enableVider="enableVider"
      />
      <ModifyPv
        v-if="pvModifyDialog"
        :data.sync="pvData"
        :meetingDate="computedDateFormattedMeetingDate"
        :meetingNextDate="computedDateFormattedMeetingNextDate"
        :meeting_date_date.sync="meeting_date_date"
        :meeting_date_time.sync="meeting_date_time"
        :meeting_next_date_date.sync="meeting_next_date_date"
        :meeting_next_date_time.sync="meeting_next_date_time"
        :affairs="affairsForPv"
        :modifyingType="pvModifyingType"
        :validate="pvModifySave"
        :cancel="cancelPvModify"
      />
      <ModifyLot
        v-if="lotModifyDialog"
        :lotData.sync="lots"
        :addLot="modifyLotsAdd"
        :deleteLot="ModifyLotDelete"
        :numberLots="numberLots"
        :validate="modifyLotSave"
        :isCancelable="lotModifyCancelable"
        :cancel="ModifyLotCancel"
      />
    </v-dialog>
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.name }}</h3>
      <p>Adresse : {{ affair.address }}</p>
      <p>Phase : {{ affair.meeting_type }}</p>
      <p v-if="affair.description" class="font-italic">{{ affair.description }}</p>
      <p>Progression :</p>
      <div class="text-center">
        <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">{{ affair.progress }} %</v-progress-circular>
      </div>
      <v-row class="d-flex align-end">
        <v-col cols="8" v-if="affair.meeting_type == 'Chantier'">
          <h3 class="mt-5">Lots :</h3>
          <div v-if="lots">
            <v-chip v-for="lot in lots" v-bind:key="lot.id" dense class="mx-5 mt-5" color="primary">{{ lot.name }}</v-chip>
          </div>
          <p v-else class="font-italic">Il n'y a pas de lots pour cette affaire</p>
        </v-col>
      </v-row>
    </v-container>

    <v-card max-width="80%" class="mx-auto">
      <v-card-title>
        Les procès verbaux :
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Recherche" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-btn dark color="primary" @click.prevent="createPv">Ajouter un pv</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="pvs" :search="search" sort-by="pv_number" sort-desc>
        <template v-slot:item.actions="{ item }">
          <v-btn small class="ma-2" @click="openPv(item)" color="primary">
            Renseigner
          </v-btn>
          <v-btn small class="ma-2" @click="modifyPv(item)" color="error">
            Modifier
          </v-btn>
        </template>
        <template v-slot:item.meeting_date="{ item }">
          <div>{{ item.meeting_date | formatDateWithAShort }}</div>
        </template>
        <template v-slot:item.meeting_next_date="{ item }">
          <div>{{ item.meeting_next_date | formatDateWithAShort }}</div>
        </template>
        <template v-slot:item.state="{ item }">
          <v-chip class="ma-2" color="success" text-color="white" v-if="item.state == 'Terminé'">
            {{ item.state }}
          </v-chip>
          <v-chip class="ma-2" color="orange" text-color="white" v-else>
            {{ item.state }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
    <v-card max-width="80%" class="mx-auto mt-10">
      <v-app-bar dark color="primary">
        <v-toolbar-title>Modifications</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="error" @click.prevent="modifyProgress">Modifier la progression</v-btn>
          <v-btn v-if="affair.meeting_type == 'Chantier'" color="error" @click.prevent="modifyLot">Modifier les lots</v-btn>
          <v-btn dark color="error" @click.prevent="modifyAffair">Modifier l'affaire</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Axios from "axios";
import routesCONST, { getRouteName } from "../utilities/constantes";
import ModifyProgress from "@/components/ModifyProgress.vue";
import ModifyAffair from "@/components/ModifyAffair.vue";
import ModifyPv from "@/components/ModifyPv.vue";
import ModifyLot from "@/components/ModifyLot.vue";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  components: {
    ModifyProgress,
    ModifyAffair,
    ModifyPv,
    ModifyLot
  },
  data() {
    return {
      progressDialog: false,
      affairDialog: false,
      pvModifyDialog: false,
      lotModifyDialog: false,
      pvModifyingType: true,
      lotModifyCancelable: false,
      pvData: {},
      dialog: false,
      dialogType: "",
      enableVider: false,
      affair: {},
      affairsForPv: [],
      lots: [],
      numberLots: Number,
      oldLots: [],
      oldNumberLots: Number,
      search: "",
      pvs: [],
      headers: [
        { text: "Numéro", align: "center", value: "pv_number" },
        {
          text: "Date",
          align: "start",
          value: "meeting_date",
          sortable: false
        },
        { text: "Etat", align: "center", value: "state", sortable: true },
        { text: "Lieu", value: "meeting_place", sortable: false },
        { text: "Prochaine date", value: "meeting_next_date", sortable: false },
        { text: "Prochain lieu", value: "meeting_next_place", sortable: false },
        { text: "Action", value: "actions", align: "center", sortable: false }
      ]
    };
  },
  computed: {
    ...mapGetters("user", {
      userId: "userId"
    }),
    computedDateFormattedMeetingDate() {
      return this.meeting_date_date ? moment(this.meeting_date_date).format("dddd LL") : "";
    },
    computedDateFormattedMeetingNextDate() {
      return this.meeting_next_date_date ? moment(this.meeting_next_date_date).format("dddd LL") : "";
    },
    meeting_date_date: {
      get() {
        return this.pvData.meeting_date.substr(0, 10);
      },
      set(val) {
        this.pvData.meeting_date = val + " " + this.pvData.meeting_date_time;
        this.pvData.meeting_date_date = val;
      }
    },
    meeting_date_time: {
      get() {
        return this.pvData.meeting_date.substr(11, 5);
      },
      set(val) {
        this.pvData.meeting_date = this.pvData.meeting_date_date + " " + val;
        this.pvData.meeting_date_time = val;
      }
    },
    meeting_next_date_date: {
      get() {
        return this.pvData.meeting_next_date.substr(0, 10);
      },
      set(val) {
        this.pvData.meeting_next_date_time
          ? (this.pvData.meeting_next_date = val + " " + this.pvData.meeting_next_date_time)
          : (this.pvData.meeting_next_date = val);
        this.pvData.meeting_next_date_date = val;
      }
    },
    meeting_next_date_time: {
      get() {
        return this.pvData.meeting_next_date.substr(11, 5);
      },
      set(val) {
        this.pvData.meeting_next_date = this.pvData.meeting_next_date_date + " " + val;
        this.pvData.meeting_next_date_time = val;
      }
    }
  },
  mounted() {
    let affairId = this.$route.params.id;
    Axios.get("getAffairById", {
      params: {
        id_affair: affairId
      }
    })
      .then(response => {
        this.affair = response.data.affair_infos;
        this.lots = response.data.lots;
      })
      .catch(error => {
        console.log(error);
      });
    Axios.get("getPvByAffairId", {
      params: {
        id_affair: affairId
      }
    })
      .then(response => {
        this.pvs = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  methods: {
    openPv(pv) {
      let pvId = pv.id_pv;
      if (pv.state == "En cours") {
        this.$router.push({
          name: routesCONST.pv.name,
          params: { id: pvId }
        });
      } else {
        this.$router.push({ name: getRouteName("finishedPv"), params: { id: pvId } });
      }
    },
    modifyLot() {
      if (this.lots == undefined) {
        this.lots = [];
        this.lots.push({ name: "", id_lot: undefined, affair_id: undefined });
        this.lotModifyCancelable = true;
      }
      this.lots.forEach(element => {
        this.oldLots.push({ ...element });
      });
      this.oldNumberLots = parseInt(this.lots.length);
      this.numberLots = this.lots.length;
      this.dialog = true;
      this.lotModifyDialog = true;
    },
    modifyLotSave() {
      this.lots.forEach(element => {
        if (element.id_lot == undefined) {
          let dataToSend = {
            affair_id: this.$route.params.id,
            name: element.name
          };
          Axios.post("addLot", dataToSend).then(response => {
            element.id_lot = response.data.id_lot;
          });
        } else {
          this.oldLots.forEach(oldEl => {
            if (element.id_lot == oldEl.id_lot && element.name != oldEl.name) {
              let dataToSend = {
                name: element.name,
                id_lot: element.id_lot
              };
              Axios.post("updateLot", dataToSend)
                .then(response => {
                  console.log(response);

                  if (response.data.affair_id != "") {
                    this.$store.dispatch("notification/success", "La progession de l'affaire à correctement été mise à jour");
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          });
        }
      });
      this.lotModifyCancelable = false;
      this.dialog = false;
      this.lotModifyDialog = false;
    },
    modifyLotsAdd() {
      this.numberLots++;
      this.lots.push({ name: "", id_lot: undefined, affair_id: undefined });
    },
    ModifyLotDelete(lot, index) {
      Axios.delete("deleteLot", { params: { id_lot: lot.id_lot } })
        .then(response => {
          if (response.data == "success") {
            this.numberLots--;
            this.lots.splice(index, 1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    ModifyLotCancel() {
      this.lotModifyCancelable = false;
      this.dialog = false;
      this.lotModifyDialog = false;
      this.lots.forEach(element => {
        if (element.name == "") {
          this.lots = undefined;
        }
      });
    },
    modifyProgress() {
      this.dialog = true;
      this.progressDialog = true;
    },
    modifyProgressSave() {
      let data = {
        ...this.affair
      };
      Axios.post("updateAffair", data)
        .then(response => {
          console.log(response.data.affair_id);
          if (response.data.affair_id != "") {
            this.$store.dispatch("notification/success", "La progession de l'affaire à correctement été mise à jour");
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.progressDialog = false;
      this.dialog = false;
    },
    modifyAffair() {
      this.dialog = true;
      this.affairDialog = true;
    },
    ModifyAffairSave() {
      console.log(this.affair);
      Axios.post("/updateAffair", this.affair)
        .then(response => {
          if (response.data.affair_id != "") {
            this.$store.dispatch("notification/success", "La progession de l'affaire à correctement été mise à jour");
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.dialog = false;
      this.affairDialog = false;
    },
    modifyPv(pvDatas) {
      //TODO: ajouter un modal si le pv est déjà terminé
      this.pvModifyingType = true;
      this.affairsForPv = [{ ...this.affair }];
      this.pvData = pvDatas;

      this.pvData.meeting_date_date = this.pvData.meeting_date.substr(0, 10);
      this.pvData.meeting_date_time = this.pvData.meeting_date.substr(11, 5);
      this.pvData.meeting_next_date_date = this.pvData.meeting_next_date.substr(0, 10);
      this.pvData.meeting_next_date_time = this.pvData.meeting_next_date.substr(11, 5);

      this.dialog = true;
      this.pvModifyDialog = true;
    },
    createPv() {
      this.pvModifyingType = false;
      this.affairsForPv = [{ ...this.affair }];
      this.pvData = {
        meeting_date_date: new Date().toISOString().substr(0, 10),
        meeting_date_time:
          moment()
            .format("LT")
            .substr(0, 2) + ":00",
        meeting_next_date_date: undefined,
        meeting_next_date_time: undefined,
        meeting_date: moment().format("YYYY-MM-DD HH:mm"),
        meeting_next_date: "",
        state: "En cours",
        meeting_place: "",
        meeting_next_place: "",
        affair_id: this.$route.params.id
      };
      this.dialog = true;
      this.pvModifyDialog = true;
    },
    cancelPvModify() {
      this.dialog = false;
      this.pvModifyDialog = false;
    },
    pvModifySave() {
      let pvData = {
        id_pv: this.pvData.id_pv,
        meeting_date: this.pvData.meeting_date_date + " " + this.pvData.meeting_date_time + ":00",
        meeting_place: this.pvData.meeting_place,
        meeting_next_date: this.pvData.meeting_next_date,
        meeting_next_place: this.pvData.meeting_next_place,
        state: this.pvData.state,
        affair_id: this.$route.params.id,
        user_id: this.userId
      };
      let apiRoute;
      this.pvModifyingType ? (apiRoute = "updatePv") : (apiRoute = "addPv");
      Axios.post(apiRoute, pvData)
        .then(response => {
          if (response.data.pv.id_pv) {
            this.dialog = false;
            this.pvModifyDialog = false;
            if (!this.pvModifyingType) {
              pvData.id_pv = response.data.pv.id_pv;
              pvData.pv_number = response.data.pv.pv_number;
              this.pvs.push(pvData);
            }
            this.$store.dispatch("notification/success", "Pv correctement enregistré");
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
