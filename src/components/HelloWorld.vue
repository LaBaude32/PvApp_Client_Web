<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Bienvenu dans la PvApp</h1>
        <p>La PvApp est une application de suivi de chantier</p>
      </v-col>
      <v-col cols="12">
        <v-btn v-if="isLogged" color="primary" dark class="mb-2" @click="goToDashboard">Dashboard</v-btn>
        <v-btn v-else color="primary" dark class="mb-2" @click="goToLoginPage">Connectez-vous</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getRouteName } from "../utilities/constantes";
import { mapGetters } from "vuex";
export default {
  name: "HelloWorld",

  data: () => ({}),
  methods: {
    goToDashboard() {
      this.$router.push(getRouteName("board"));
    },
    goToLoginPage() {
      this.$router.push(getRouteName("login"));
    }
  },
  computed: {
    ...mapGetters("user", {
      isLogged: "logged",
      fullName: "fullName"
    })
  }
};
</script>
