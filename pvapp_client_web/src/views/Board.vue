<template>
  <div>
    <h1>Votre board :</h1>
    <v-spacer></v-spacer>
    <v-toolbar max-width="70%" class="mx-auto ma-10" color="blue-grey lighten-5" flat>
      <v-btn class="mx-auto ma-5">
        Creer une affaire
      </v-btn>
      <v-btn class="mx-auto ma-5">
        Ajouter un Pv
      </v-btn>
    </v-toolbar>
    <h2>Vos 3 derniers PV :</h2>
    <v-card class="mx-auto mb-5" max-width="344" outlined v-for="pv in pvs" v-bind:key="pv.id">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">Affaire : {{pv.affair_id}}</v-list-item-title>
          <v-list-item-subtitle>Date de la réunion : {{ pv.meeting_date | formatDate}}</v-list-item-subtitle>
          <v-card-text class="text--primary">
            <v-btn class="ma-2" color="green darken-1" dark @click="openPv(pv.id_pv)">Terminé
              <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
            </v-btn>
            <p> Prochaine réunion : {{ pv.meeting_next_date | formatDate}}</p>
          </v-card-text>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <h2>Vos affaires en cours :</h2>
    <v-card class="mx-auto mb-5" max-width="344" outlined v-for="affair in affairs" v-bind:key="affair.id_affair">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">{{affair.name}}</v-list-item-title>
          <v-list-item-subtitle>{{affair.meeting_type}}</v-list-item-subtitle>
          <v-list-item-subtitle>{{affair.address}}</v-list-item-subtitle>
          <v-card-text class="text--primary">
            <div class="text-center">
              <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">{{affair.progress}} %</v-progress-circular>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="openAffair(affair.id_affair)">Ouvrir</v-btn>
          </v-card-actions>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
const axios = require("axios");

import { mapState } from "vuex";
export default {
  data() {
    return {
      pvs: [],
      affairs: []
    };
  },
  computed: {
    ...mapState("user", {
      userId: "userId"
    })
  },
  methods: {
    openAffair(affairId) {
      this.$router.push({
        name: "AffairId",
        params: { id: affairId }
      });
    },
    openPv(pvId) {
      this.$router.push({
        name: "PvId",
        params: { id: pvId }
      });
    }
  },
  mounted() {
    let self = this;
    const dtPvs = {
      params: {
        user_id: this.userId,
        number_of_pvs: 3
      }
    };
    const dtAffairs = {
      params: {
        user_id: this.userId
      }
    };
    if (typeof this.userId != undefined) {
      axios
        .get("getLastPvsByUserId", dtPvs)
        .then(function(response) {
          // handle success
          self.pvs = response.data;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });

      axios
        .get("getAffairsByUserId", dtAffairs)
        .then(function(response) {
          // handle success
          self.affairs = response.data;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    } else {
      //TODO: Connectez vous, => page de connexion
    }
  }
};
</script>
