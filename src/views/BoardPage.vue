<template>
  <div>
    <h1>Votre dashboard :</h1>
    <v-spacer></v-spacer>
    <v-container>
      <v-row class="grey lighten-3 mx-1">
        <v-col>
          <v-btn class="mx-auto my-3" color="primary" @click="createAffair">Creer une affaire</v-btn>
        </v-col>
        <v-col v-if="pvs != ''">
          <v-btn class="mx-auto my-3" color="primary" @click="createPv">Ajouter un Pv</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="pvs != ''">
      <h2>Vos 2 derniers procès verbaux :</h2>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="pv in pvs" v-bind:key="pv.id">
          <v-card class="mx-auto" color="blue-grey lighten-5" min-height="185">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-1">
                  Réunion du :
                  {{ pv.meetingDate | formatDate }}
                </v-list-item-title>
                <v-list-item-subtitle>Affaire : {{ pv.affairName }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <v-btn v-if="pv.state == 'Terminé'" class="ma-2" color="green darken-2" dark
                    @click="openFinishedPv(pv.pvId)">
                    {{ pv.state }}
                    <v-icon right>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                  <v-btn v-else class="ma-2" color="orange darken-3" dark @click="openPv(pv.pvId)">
                    {{ pv.state }}
                    <v-icon right>mdi-autorenew</v-icon>
                  </v-btn>
                  <div v-if="pv.meetingNextDate">Prochaine réunion : {{ pv.meetingNextDate | formatDate }}</div>
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
        <v-col cols="12" md="6" v-for="affair in affairs" v-bind:key="affair.affairId">
          <v-card class="mx-auto" color="blue-grey lighten-5" outlined>
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h6 mb-1">{{ affair.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ affair.meetingType }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ affair.address }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <div class="text-center">
                    <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">{{
                      affair.progress }} %</v-progress-circular>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer>
                    <v-btn color="success" @click="openAffair(affair.affairId)">Ouvrir</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else class="px-10">
      <v-alert type="info" outlined>
        <p class="text-h6">Vous n'avez pas encore d'affaires.</p>
        <p>Veuillez commencer par en créer une en cliquant sur le bouton ci-dessus</p>
      </v-alert>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
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
        userId: this.userId,
        numberOfPvs: 2
      }
    };
    const dtAffairs = {
      params: {
        userId: this.userId
      }
    };
    if (typeof this.userId != undefined) {
      axios
        .get("lastPvsByUserId", dtPvs)
        .then(function (response) {
          // handle success
          self.pvs = response.data;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });

      axios
        .get("affairsByUserId", dtAffairs)
        .then(function (response) {
          // handle success
          self.affairs = response.data;
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        });
    } else {
      this.$store.dispatch("auth/authLogout");
    }
  }
};
</script>
