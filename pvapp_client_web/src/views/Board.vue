<template>
  <div>
    <h1>Votre board :</h1>
    <v-spacer></v-spacer>
    <v-container>
      <v-row class="grey lighten-3 mx-1">
        <v-col cols="12" md="6">
          <v-btn class="mx-auto my-3" @click="createAffair">Creer une affaire</v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn class="mx-auto my-3" @click="createPv">Ajouter un Pv</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="pvs != ''">
      <h2>Vos 3 derniers procès verbaux :</h2>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="pv in pvs" v-bind:key="pv.id">
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="title mb-1">
                  Réunion du :
                  {{ pv.meeting_date | formatDate }}
                </v-list-item-title>
                <v-list-item-subtitle>Affaire : {{ pv.affair_name }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <v-btn v-if="pv.state == 'Terminé'" class="ma-2" color="green darken-2" dark @click="openFinishedPv(pv.id_pv)">
                    {{ pv.state }}
                    <v-icon right>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                  <v-btn v-else class="ma-2" color="orange darken-3" dark @click="openPv(pv.id_pv)">
                    {{ pv.state }}
                    <v-icon right>mdi-autorenew</v-icon>
                  </v-btn>
                  <div v-if="pv.meeting_next_date">Prochaine réunion : {{ pv.meeting_next_date | formatDate }}</div>
                </v-card-text>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="affairs != ''">
      <h2>Vos affaires en cours :</h2>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="affair in affairs" v-bind:key="affair.id_affair">
          <v-card class="mx-auto" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="title mb-1">{{ affair.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ affair.meeting_type }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ affair.address }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <div class="text-center">
                    <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8"
                      >{{ affair.progress }} %</v-progress-circular
                    >
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer>
                    <v-btn color="success" @click="openAffair(affair.id_affair)">Ouvrir</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else class="px-10">
      <p class="title">Vous n'avez pas encore d'affaires ou de pvs.</p>
      <p>
        Veuillez commencer par créer une
        <span class="font-weight-bold">affaire</span> en cliquant sur le bouton ci-dessus
      </p>
    </v-container>
  </div>
</template>

<script>
const axios = require("axios");
import routesCONST, { getRouteName } from "../utilities/constantes";

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
      this.$store.dispatch("affair/openAffair", affairId);
    },
    openPv(pvId) {
      this.$store.dispatch("affair/openPv", pvId);
    },
    openFinishedPv(pvId) {
      // this.$store.dispatch("affair/openPv", pvId);
      this.$router.push({ name: getRouteName("finishedPv"), params: { id: pvId } });
    },
    createAffair() {
      this.$router.push({ name: routesCONST.addAffair.name });
    },
    createPv() {
      this.$router.push(getRouteName("addPv"));
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
      this.$store.dispatch("auth/authLogout");
    }
  }
};
</script>
