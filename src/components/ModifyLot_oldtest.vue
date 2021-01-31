<template>
  <v-card class="pa-2 pb-3">
    <v-card-title>Modifier les lots de l'affaire</v-card-title>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="addLot" color="success darken-1">Ajouter un lot</v-btn>
      <v-btn @click="deleteLastLot" color="warning">Supprimer le dernier lot</v-btn>
      <v-spacer />
    </v-card-actions>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="affair_id"
              :items="affairs"
              item-text="name"
              item-value="id_affair"
              label="Affaire"
              :rules="affairRules"
            ></v-combobox>
          </v-col>
          <v-col cols="11" :md="numberLots == 1 ? '12' : '6'" v-for="lot in numberLots" :key="lot.id">
            <v-text-field v-model="mylots[lot - 1]" :label="'Lot ' + lot" clearable counter="45" :rules="standardRules"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="numberLots !== 0">
        <v-spacer />
        <v-btn color="error" class="mr-4" @click="reset">
          Vider
        </v-btn>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
          Valider
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import Axios from "axios";
import { mapState } from "vuex";
export default {
  name: "AddLot",
  props: {
    lotData: Array
  },
  data() {
    return {
      numberLots: 1,
      myLots: this.lotData,
      // lots: [],
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
    console.log(this.myLots);

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
  computed: {
    ...mapState("user", {
      userId: "userId"
    })
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
      let dataToSend = {
        affair_id: this.affair_id.id_affair,
        lots_name: this.lots
      };
      console.log(dataToSend);
      Axios.post("addLot", dataToSend).then(response => {
        console.log(response);
      });
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
