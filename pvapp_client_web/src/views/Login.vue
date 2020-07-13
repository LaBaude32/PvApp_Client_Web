<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-alert type="success" v-if="isLogged">Vous êtes connecté, vous allez être redirigé dans 5 secondes</v-alert>
        <v-alert type="error" v-else-if="resultConnetion === 'errorId'">Erreur sur l'email ou le mot de passe</v-alert>
        <v-alert type="error" v-else-if="resultConnetion === 'errorConnection'"
          >Erreur de connexion au serveur, veuillez vérifier votre connexion internet</v-alert
        >
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-text-field label="Email" name="login" prepend-icon="mdi-account" type="text" v-model="email" :rules="emailRules" />
              <v-text-field
                id="password"
                label="Mot de passe"
                name="password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                v-model="password"
                :rules="pwdRules"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click.prevent="login">Connexion</v-btn>
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
const MD5 = require("md5.js");
export default {
  data() {
    return {
      valid: false,
      emailRules: [v => !!v || "Requis", v => /.+@.+\..+/.test(v) || "Le mail doit être valide"],
      pwdRules: [
        v => !!v || "Requis"
        // v => v.lenght >=8 || "Il doit y avoir plus de 8 caracères"
        // v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
        // v => /(?=.*\d)/.test(v) || 'Must have one number',
        // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
      ],
      showPassword: false,
      email: null,
      password: null,
      result: "",
      successLoginMessage: "Vous êtes connecté, vous allez être redirigé dans 5 secondes"
    };
  },
  methods: {
    login() {
      const dt = {
        email: this.email,
        password: new MD5().update(this.password).digest("hex")
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
