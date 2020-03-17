<template>
  <div>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="name" :counter="20" label="Nom de l'affaire" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="address" :counter="20" label="Adresse de l'affaire" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-combobox v-model="meeting_type" :items="items" label="Type de réunion" required></v-combobox>
          </v-col>
        </v-row>
      </v-container>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Valider
      </v-btn>
      <v-btn color="error" class="mr-4" @click="reset">
        Vider
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    name: "",
    address: "",
    meeting_type: "",
    items: ["Chantier", "Etude"]
  })
};
</script>
