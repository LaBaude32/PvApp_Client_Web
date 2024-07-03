<template>
  <v-card>
    <v-card-title>Modifier la progression de l'affaire</v-card-title>
    <v-card-text>
      <div class="text-center mt-10">
        <v-progress-circular :value="progressValue" color="deep-orange lighten-2" size="80" width="8">
          {{ progressValue }} %
        </v-progress-circular>
      </div>
      <v-slider
        v-model="progressValue"
        color="orange"
        thumb-label
        step="5"
        show-ticks="always"
        tick-size="2"
        class="mt-10"
      ></v-slider>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="modifyProgressSave">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  modifyProgressSave: Function
})

const progressValue = defineModel('progressValue', { type: Number, required: true })
</script>
