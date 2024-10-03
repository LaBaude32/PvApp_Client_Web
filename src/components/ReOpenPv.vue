<template>
  <v-sheet
    rounded
    color="blue-grey-lighten-5"
    elevation="2"
    class="justify-center mx-auto pa-5 mt-5"
  >
    <h2>Réouvrir un Pv</h2>
    <v-card class="pa-5">lala</v-card>
    <v-list>
      <v-list-item
        v-for="pv in pvs"
        :key="pv.title"
        :subtitle="pv.subtitle"
        :title="pv.title"
      ></v-list-item>
      <template v-slot:append>
        <v-btn color="grey-lighten-1" icon="mdi-open" variant="text"></v-btn>
      </template>
    </v-list>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue'

const pvs = ref([])
</script>
