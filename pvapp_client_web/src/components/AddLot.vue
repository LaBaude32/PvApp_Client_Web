<template>
  <v-container>
    <v-btn @click="addLot" class="mx-5" color="success darken-1">Ajouter un lot</v-btn>
    <v-btn @click="deleteLastLot" class="mx-5" color="warning">Supprimer le dernier lot</v-btn>
    <v-form v-model="valid" ref="form">
      <v-row>
        <v-col cols="12">
          <v-combobox v-model="affair_id" :items="affairs" item-text="name" item-value="id_affair" label="Affaire" :rules="affairRules"></v-combobox>
        </v-col>
        <v-col cols="12" :md="numberLots == 1 ? '12' : '6'" v-for="lot in numberLots" :key="lot.id">
          <v-text-field v-model="lots[lot-1]" :label="'Lot ' + lot" clearable counter="45" :rules="standardRules"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="numberLots !== 0">
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
          Valider
        </v-btn>
        <v-btn color="error" class="mr-4" @click="reset">
          Vider
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import Axios from "axios";
export default {
  name: "AddLot",
  data() {
    return {
      numberLots: 1,
      lots: [],
      valid: false,
      standardRules: [
        v => !!v || "Requis",
        v => (v && v.length >= 4) || "Doit être au moins de 4 caractères",
        v => (v && v.length <= 45) || "Doit être au max 45 caractères"
      ],
      affairRules: [v => !!v || "Requis"],
      affair_id: "",
      affairs: []
    };
  },
  mounted() {
    let self = this;
    const dtAffairs = {
      params: {
        user_id: this.userId
      }
    };
    if (typeof this.userId != undefined) {
      Axios.get("getAffairsByUserId", dtAffairs)
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
  },
  methods: {
    addLot() {
      this.numberLots++;
    },
    deleteLastLot() {
      this.numberLots--;
      this.lots.pop();
    },
    validate() {
      // Axios.post("addLot");
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
