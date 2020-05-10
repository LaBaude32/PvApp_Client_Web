<template>
  <div v-if="affair" class="mb-10">
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.affair_infos.name }}</h3>
      <p>Adresse : {{ affair.affair_infos.address }}</p>
      <p>Type de chantier : {{ affair.affair_infos.meeting_type }}</p>
      <p v-if="affair.affair_infos.description" class="font-italic">{{ affair.affair_infos.description }}</p>
      <p>Progression :</p>
      <div class="text-center">
        <v-progress-circular :value="affair.affair_infos.progress" color="deep-orange lighten-2" size="80" width="8"
          >{{ affair.affair_infos.progress }} %</v-progress-circular
        >
      </div>
      <h3 class="mt-5">Lots :</h3>
      <v-chip v-for="lot in affair.lots" v-bind:key="lot.id" dense class="mx-5 mt-5" color="primary">{{ lot.name }}</v-chip>
    </v-container>

    <v-card max-width="80%" class="mx-auto">
      <v-card-title>
        Les procès verbaux :
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Recherche" single-line hide-details></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="pvs" :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn @click="openPv(item.id_pv)" color="primary">
            Voir
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
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

        <v-toolbar-title>Modifier l'affaire</v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->
      </v-app-bar>
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="success">Modifier la progression</v-btn>
          <v-btn color="warning" @click.prevent="modifyLot">Modifier les lots</v-btn>
          <v-btn dark color="error">Modifier l'affaire</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
//TODO: ajouter la modification des lots
import Axios from "axios";
import routesCONST, { getRouteName } from "../utilities/constantes";
export default {
  data() {
    return {
      affair: "",
      search: "",
      pvs: [],
      headers: [
        {
          text: "Date",
          align: "start",
          sortable: false,
          value: "meeting_date"
        },
        { text: "Etat", value: "state" },
        { text: "Lieu", value: "meeting_place" },
        { text: "Prochaine date", value: "meeting_next_date" },
        { text: "Prochain lieu", value: "meeting_next_place" },
        { text: "Action", value: "actions" }
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
        this.affair = response.data;
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
    }
  }
};
</script>
