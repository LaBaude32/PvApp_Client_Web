<template>
  <div>
    <h3>Affaire : {{ affair.affair_infos.name }}</h3>
    <p>Adresse : {{ affair.affair_infos.address }}</p>
    <p>Type de chantier : {{ affair.affair_infos.meeting_type }}</p>
    <p>Progression :</p>
    <div class="text-center">
      <v-progress-circular :value="affair.affair_infos.progress" color="deep-orange lighten-2" size="80" width="8">{{affair.affair_infos.progress}} %</v-progress-circular>
    </div>
    <v-divider class="mt-10"></v-divider>
    <h3 class="mt-5">Lots :</h3>
    <v-list-item v-for="lot in affair.lots" v-bind:key="lot.id">
      <v-list-item-content>
        <p>{{ lot.id_lot }} - {{ lot.name }}</p>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      affair: ""
    };
  },
  computed: {
    param() {
      return this.$route.params;
    }
  },
  mounted() {
    // recuperer les infos de l'affair
    let affairId = this.$route.params.id;
    //FIXME: SESSION: Pourquoi il ne se passe rien ?
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
    //recperer les pvs de l'affair
  }
};
</script>
