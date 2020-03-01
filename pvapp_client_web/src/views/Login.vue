<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-alert type="success" v-if="result === 'success'">
          {{ loginResultMessage }}
        </v-alert>
        <v-alert type="error" v-else-if="result === 'errorId'">
          {{ loginResultMessage }}
        </v-alert>
        <v-alert type="error" v-else-if="result === 'errorConnection'">
          {{ loginResultMessage }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field label="Email" name="login" prepend-icon="mdi-account" type="text" v-model="email" />
              <v-text-field id="password" label="Mot de passe" name="password" prepend-icon="mdi-lock" type="password" v-model="password" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click.prevent="submit">Connexion</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const axios = require("axios");
export default {
  data() {
    return {
      email: null,
      password: null,
      result: "",
      loginResultMessage:
        "Vous êtes connecté, vous allez être redirigé dans 5 secondes"
    };
  },
  methods: {
    submit() {
      const dt = {
        email: this.email,
        password: this.password
      };
      //TODO: verifier que l'email est au bon format, et vérifier que le mot de passe est rempli
      let self = this;
      axios
        .post("http://localhost:8080/login", dt)
        .then(function(response) {
          console.log(response.data);
          if (response.data.login_result == "success") {
            localStorage.userId = response.data.user_id;
            localStorage.token = response.data.token;
            self.result = "success";

            //TODO: appeler une nouvelle vue avec les la liste des affaires en cours.
            //TODO: ajouter un accès au compte dans la bar du haut
          } else if (response.data.login_result == "error") {
            self.result = "errorId";
            self.loginResultMessage = "Erreur sur l'email ou le mot de passe";
          }
        })
        .catch(function(error) {
          console.log(error);
          self.result = "errorConnection";
          self.loginResultMessage =
            "Erreur de connexion au serveur, veuillez vérifier votre connexion internet";
        });
    }
  }
};
</script>

<style scoped></style>
