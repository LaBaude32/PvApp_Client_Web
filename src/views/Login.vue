<template>
  <v-container>
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
          <v-toolbar color="primary">
            <v-toolbar-title>Connexion</v-toolbar-title>
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-text-field label="Email" name="login" prepend-icon="mdi-account" type="text" v-model="email" :rules="emailRules" />
              <v-text-field
                id="password"
                label="Mot de passe"
                name="password"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
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
import { mapGetters } from "vuex";
import md5 from "md5";
export default {
  data() {
    return {
      valid: false,
      emailRules: [(v) => !!v || "Requis", (v) => /.+@.+\..+/.test(v) || "Le mail doit être valide"],
      pwdRules: [
        (v) => !!v || "Requis"
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
        password: md5(this.password)
      };
      //FIXME: si on a une erreur, on est quand même envoyé sur l'interface .. pk ?
      if (localStorage.getItem("token") == undefined) {
        this.$store
          .dispatch("auth/authRequest", dt)
          .then(() => {
            this.$store
              .dispatch("user/login", dt)
              .then(() => {
                window.setTimeout(() => {
                  this.$router.push("/Board");
                }, 5000);
              })
              .catch(() => {
                this.$store.dispatch("auth/authError");
              });
          })
          .catch(() => {
            this.$store.dispatch("auth/authError");
          });
      }
    }
  },
  computed: {
    ...mapGetters(
      "user",
      {
        isLogged: "logged",
        fullName: "fullName",
        resultConnetion: "resultConnetion"
      },
      "auth",
      {
        token: "token",
        tokenType: "tokenType"
      }
    )
  }
};
</script>

<style scoped></style>
