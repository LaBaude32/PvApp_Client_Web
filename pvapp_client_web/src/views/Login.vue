<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-alert type="success" v-if="isLogged">Vous êtes connecté, vous allez être redirigé dans 5 secondes</v-alert>
        <v-alert type="error" v-else-if="resultConnetion === 'errorId'">Erreur sur l'email ou le mot de passe</v-alert>
        <v-alert type="error" v-else-if="resultConnetion === 'errorConnection'">Erreur de connexion au serveur, veuillez vérifier votre connexion internet</v-alert>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form>
            <v-card-text>
              <v-text-field label="Email" name="login" prepend-icon="mdi-account" type="text" v-model="email"/>
              <!-- TODO: SESSION :rules="[rules.required, rules.email]" pourquoi ça ne fonctionne pas ? -->
              <v-text-field id="password" label="Mot de passe" name="password" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" v-model="password" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click.prevent="login">Connexion</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// const axios = require("axios");
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showPassword: false,
      email: null,
      password: null,
      result: "",
      successLoginMessage:
        "Vous êtes connecté, vous allez être redirigé dans 5 secondes"
    };
  },
  methods: {
    login() {
      //FIXME: pourquoi l'appui sur la touche entrée ne fonctionne pas ?

      //TODO: SESSION verifier que l'email est au bon format, et vérifier que le mot de passe est rempli
      // -> Mettre des rules
      const dt = {
        email: this.email,
        password: this.password
      };
      this.$store.dispatch("auth/authRequest", dt).then(() => {
        window.setTimeout(() => {
          this.$router.push("/Board");
        }, 5000);
      });
    }
  },
  computed: {
    ...mapGetters("user", {
      isLogged: "logged",
      fullName: "fullName",
      resultConnetion: "resultConnetion"
    })
  }
};
</script>

<style scoped></style>
