<template>
  <v-card class="pa-2 pb-3">
    <v-card-title>Modifier les lots de l'affaire</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-row>
          <!-- <v-col cols="12">
            <v-combobox
              v-model="affair_id"
              :items="affairs"
              item-text="name"
              item-value="id_affair"
              label="Affaire"
              :rules="affairRules"
            ></v-combobox>
          </v-col> -->
          <v-col cols="12" v-for="lot in numberLots" :key="lot.id">
            <v-text-field
              v-model="myLots[lot - 1].name"
              :label="'Lot ' + lot"
              clearable
              counter="45"
              append-outer-icon="mdi-delete"
              @click:append-outer="deleteLot(myLots[lot - 1], lot - 1)"
              :rules="standardRules"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="numberLots !== 0">
        <v-btn @click="addLot" color="primary">Ajouter un lot</v-btn>
        <v-spacer />
        <v-btn v-if="isCancelable" color="error" @click.prevent="cancel">
          Annuler
        </v-btn>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Valider</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "AddLot",
  props: {
    lotData: Array,
    addLot: Function,
    deleteLot: Function,
    numberLots: Number,
    validate: Function,
    isCancelable: Boolean,
    cancel: Function
  },
  data() {
    return {
      valid: false,
      standardRules: [
        v => !!v || "Requis",
        v => (v && v.length >= 3) || "Doit être au moins de 3 caractères",
        v => (v && v.length <= 45) || "Doit être au max 45 caractères"
      ],
      affairRules: [v => !!v || "Requis"]
    };
  },
  computed: {
    myLots: {
      get() {
        return this.lotData;
      },
      set(val) {
        this.$emit("update:lotData", val);
      }
    }
  }
};
</script>
