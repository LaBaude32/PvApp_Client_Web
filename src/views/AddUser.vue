<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Créer un personne</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-row>
                <v-col cols="7">
                  <v-text-field label="Email" prepend-icon="mdi-account" type="text" v-model="email" :rules="emailRules" />
                </v-col>
                <v-col cols="5">
                  <v-text-field
                    id="password"
                    label="Mot de passe"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    v-model="password"
                    :rules="pwdRules"
                    counter
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Prénom" type="text" v-model="firstName" :rules="standardRules" counter="35" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Nom" type="text" v-model="lastName" :rules="standardRules" counter="35" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Téléphone" type="text" v-model="phone" :rules="phoneRules" counter="10" />
                </v-col>
                <v-col cols="6">
                  <!-- <v-text-field label="Groupe" type="text" v-model="userGroup" counter="35" /> -->
                  <v-select v-model="userGroup" :items="userGroupItems" label="Groupe" clearable></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Fonction" type="text" v-model="userFunction" counter="35" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Organisme" type="text" v-model="organism" counter="35" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click.prevent="validate">Ajouter</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Axios from "axios";
import { getRouteName } from "../utilities/constantes";
import md5 from "md5";
export default {
  data() {
    return {
      valid: false,
      showPassword: false,
      emailRules: [(v) => !!v || "Requis", (v) => /.+@.+\..+/.test(v) || "Le mail doit être valide"],
      pwdRules: [
        (v) => !!v || "Requis",
        (v) => v.length >= 8 || "Il doit y avoir plus de 8 caracères",
        (v) => /(?=.*[A-Z])/.test(v) || "Il faut une majuscule",
        (v) => /(?=.*\d)/.test(v) || "Il faut un nombre",
        (v) => /([!@#$%])/.test(v) || "Il faut un charactère spécial [!@#$%]"
      ],
      standardRules: [
        (v) => !!v || "Requis",
        (v) => (v && v.length >= 3) || "Il doit y avoir plus de 3 caracères",
        (v) => (v && v.length < 35) || "Il doit y avoir plus de 4 caracères"
      ],
      phoneRules: [
        (v) => !!v || "Requis",
        (v) => (v && v.length == 10) || "Doit être égal à 10 charactère",
        (v) => /\d/.test(v) || "Doit être consituté de chiffres uniquement"
      ],
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      userGroup: "",
      userGroupItems: [
        "Maîtrise d'ouvrage",
        "Assistance à la maîtrise d'ouvrage",
        "Maîtrise d'oeuvre",
        "Concessionnaire",
        "Personne public associée",
        "COPIL",
        "COTEC",
        "Divers"
      ],
      userFunction: "",
      organism: ""
    };
  },
  methods: {
    validate() {
      let datas = {
        email: this.email,
        password: md5(this.password),
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        userGroup: this.userGroup,
        userFunction: this.userFunction,
        organism: this.organism
      };
      Axios.post("users", datas)
        .then((response) => {
          console.log(response);
          this.$router.push(getRouteName("board"));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
</script>
