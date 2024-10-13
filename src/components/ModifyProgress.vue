<template>
  <v-card>
    <v-card-title>Modifier la progression des lots de l'affaire</v-card-title>
    <v-card-text>
      <v-row align="center" v-for="lot in lots">
        <v-col>
          <v-chip>{{ lot.name }}</v-chip>
        </v-col>
        <v-col>
          <v-progress-circular
            :model-value="lot.progress"
            color="deep-orange lighten-2"
            size="80"
            width="8"
          >
            {{ lot.progress }} %
          </v-progress-circular>
        </v-col>
        <v-col cols="8">
          <v-slider
            v-model="lot.progress"
            color="orange"
            thumb-label
            step="5"
            show-ticks="always"
            tick-size="2"
            class="mt-10"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue darken-1" variant="text" @click="cancel">Annuler</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" variant="text" @click="modifyProgressSave">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Lot } from '@/utilities/types'

const emit = defineEmits(['closeDialog'])
const props = defineProps<{
  modifyProgressSave: Function
  initialLots: Lot[]
}>()

const lots = defineModel<Lot[]>('lots', { required: true })

function cancel() {
  lots.value = props.initialLots
  emit('closeDialog')
}
</script>
