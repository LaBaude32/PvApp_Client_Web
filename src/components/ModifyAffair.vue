<template>
  <v-card>
    <v-card-title>
      Modifier l'affaire
    </v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="affairDatas.name" :counter="50" label="Nom de l'affaire" :rules="nameRules"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="affairDatas.address" counter label="Adresse de l'affaire" :rules="addressRules"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox v-model="affairDatas.meeting_type" :items="items" label="Type de réunion" :rules="meetingRules"></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="affairDatas.description"
                auto-grow
                :counter="100"
                rows="1"
                label="Description de l'affaire"
                :rules="descriptionRules"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
          Valider
        </v-btn>
        <v-btn v-if="enableVider" color="error" class="mr-4" @click="reset">
          Vider
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
export default {
  name: "ModifyAffair",
  props: {
    dialog: Boolean,
    affairDatas: Object,
    validate: Function,
    enableVider: Boolean
  },
  data: () => ({
    valid: false,
    nameRules: [
      v => !!v || "Requis",
      v => (v && v.length <= 50) || "Doit être inferieur à 50 caractères",
      v => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"
    ],
    addressRules: [v => !!v || "Requis", v => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"],
    descriptionRules: [v => v.length <= 100 || "Doit être inferieur à 120 caractères"],
    meetingRules: [v => !!v || "Requis", v => v == "Chantier" || v == "Etude" || "Choisir dans la liste"],
    items: ["Chantier", "Etude"]
  }),
  methods: {
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>
