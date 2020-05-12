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
      <ModifyPv v-if="pvModifyDialog" :data.sync="pvData" :affairs="affairsForPv" :modifyingType="pvModifyingType" :validate="pvModifySave" />
    </v-dialog>
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.name }}</h3>
      <p>Adresse : {{ affair.address }}</p>
      <p>Type de chantier : {{ affair.meeting_type }}</p>
      <p v-if="affair.description" class="font-italic">{{ affair.description }}</p>
      <p>Progression :</p>
      <div class="text-center">
        <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">{{ affair.progress }} %</v-progress-circular>
      </div>
      <v-row>
        <v-col cols="12">
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
      </v-card-title>
      <v-data-table :headers="headers" :items="pvs" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn small class="ma-2" @click="openPv(item.id_pv)" color="primary">
            Voir
          </v-btn>
          <v-btn small class="ma-2" @click="modifyPv(item)" color="warning">
            Modifier
          </v-btn>
        </template>
        <template v-slot:item.meeting_date="{ item }">
          <div>{{ item.meeting_date | formatDate }}</div>
        </template>
        <template v-slot:item.meeting_next_date="{ item }">
          <div>{{ item.meeting_next_date | formatDate }}</div>
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
      <v-app-bar dark color="warning">
        <v-toolbar-title>Modifier l'affaire</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary">Ajouter un pv</v-btn>
          <v-btn dark color="success" @click.prevent="modifyProgress">Modifier la progression</v-btn>
          <v-btn color="warning" @click.prevent="modifyLot">Modifier les lots</v-btn>
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
export default {
  components: {
    ModifyProgress,
    ModifyAffair,
    ModifyPv
  },
  data() {
    return {
      progressDialog: false,
      affairDialog: false,
      pvModifyDialog: false,
      pvModifyingType: true,
      pvData: {},
      dialog: false,
      dialogType: "",
      enableVider: false,
      affair: {},
      affairsForPv: [],
      lots: [],
      search: "",
      pvs: [],
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "meeting_date"
        },
        { text: "Etat", align: "center", value: "state" },
        { text: "Lieu", value: "meeting_place" },
        { text: "Prochaine date", value: "meeting_next_date" },
        { text: "Prochain lieu", value: "meeting_next_place" },
        { text: "Action", value: "actions", align: "center" }
      ]
    };
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
    //recuperer les pvs de l'affair
  },
  methods: {
    openPv(pvId) {
      this.$router.push({
        name: routesCONST.pv.name,
        params: { id: pvId }
      });
    },
    modifyLot() {
      this.$router.push({ name: getRouteName("addLot") });
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
          console.log(response);
          //TODO: faire un retour
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
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      this.dialog = false;
      this.affairDialog = false;
    },
    modifyPv(pvDatas) {
      this.affairsForPv = [{ ...this.affair }];
      this.pvData = pvDatas;
      this.pvData.meeting_date_date = this.pvData.meeting_date.substr(0, 10);
      this.pvData.meeting_date_time = this.pvData.meeting_date.substr(11, 5);
      this.dialog = true;
      this.pvModifyDialog = true;
    },
    pvModifySave() {
      if (this.pvData.meeting_next_date_date == "empty string") {
        this.pvData.meeting_next_date = this.pvData.meeting_next_date_date + " " + this.meeting_next_date_time + ":00";
      } else {
        this.pvData.meeting_next_date = null;
      }
      let meeting_next_date;

      if (this.pvData.meeting_next_date_date != undefined) {
        meeting_next_date = this.pvData.meeting_next_date_date + " " + this.pvData.meeting_next_date_time + ":00";
      } else {
        meeting_next_date = null;
      }
      let pvData = {
        id_pv: this.pvData.id_pv,
        meeting_date: this.pvData.meeting_date_date + " " + this.pvData.meeting_date_time + ":00",
        meeting_place: this.pvData.meeting_place,
        meeting_next_date: meeting_next_date,
        meeting_next_place: this.pvData.meeting_next_place,
        state: this.pvData.state,
        affair_id: this.$route.params.id
      };
      Axios.post("updatePv", pvData)
        .then(response => {
          console.log(response);
          this.dialog = false;
          this.pvModifyDialog = false;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
