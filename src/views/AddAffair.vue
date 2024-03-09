<template>
  <div>
    <v-form v-model="valid" ref="form">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="name" :counter="50" label="Nom de l'affaire" :rules="nameRules"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="address" counter label="Adresse de l'affaire" :rules="addressRules"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox v-model="meetingType" :items="items" label="Phase" :rules="meetingRules"></v-combobox>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="description"
              auto-grow
              :counter="100"
              rows="1"
              label="Description de l'affaire"
              :rules="descriptionRules"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-container>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate"> Valider </v-btn>
      <v-btn color="error" class="mr-4" @click="reset"> Vider </v-btn>
    </v-form>
  </div>
</template>

<script>
import Axios from "axios";
import routesCONST from "../utilities/constantes";
import { DateTime, Settings } from "luxon";
Settings.defaultLocale = "fr";

export default {
  data: () => ({
    valid: false,
    nameRules: [
      (v) => !!v || "Requis",
      (v) => (v && v.length <= 50) || "Doit être inferieur à 50 caractères",
      (v) => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"
    ],
    addressRules: [(v) => !!v || "Requis", (v) => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"],
    descriptionRules: [(v) => v.length <= 100 || "Doit être inferieur à 120 caractères"],
    meetingRules: [(v) => !!v || "Requis", (v) => v == "Chantier" || v == "Etude" || "Choisir dans la liste"],
    name: "",
    address: "",
    meetingType: "",
    description: "",
    items: ["Chantier", "Etude"]
  }),
  computed: {
    id() {
      return this.$store.state.user.userId;
    }
  },
  methods: {
    validate() {
      // this.$refs.form.validate();
      let affairData = {
        name: this.name,
        address: this.address,
        meetingType: this.meetingType,
        progress: 0
      };
      Axios.post("/affairs", affairData)
        .then((response) => {
          if (response.status == 201) {
            let affairId = response.data.affairId;
            let pvData = {
              state: "En cours",
              meetingPlace: "Indéfini",
              meetingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
              userId: this.$store.state.user.userId,
              affairId: affairId
            };
            Axios.post("/pvs", pvData)
              .then((response) => {
                if (response.status == 201) {
                  // let pvId = response.data.id_pv;
                  // let PvHasUserData = {
                  //   pv_id: pvId,
                  //   user_id: this.$store.state.user.userId,
                  //   status_PAE: "Présent"
                  // };
                  // Axios.post("/addPvHasUser", PvHasUserData)
                  //   .then(response => {
                  //     if (response.status == 201) {
                  //       this.$router.push({
                  //         name: routesCONST.affair.name,
                  //         params: { id: affairId }
                  //       });
                  //     }
                  //   })
                  //   .catch(error => {
                  //     console.log(error);
                  //   });
                  this.$router.push({
                    name: routesCONST.affair.name,
                    params: { id: affairId }
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
