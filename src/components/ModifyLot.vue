<template>
  <v-card class="pa-2 pb-3">
    <v-card-title>Modifier les lots de l'affaire</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-row>
          <v-col cols="12" v-for="lot in numberOfLots">
            <v-combobox
              v-model="myLots[lot - 1].name"
              :label="getLabel(lot)"
              :items="LOT_DEFAULT"
              clearable
              counter="45"
              append-icon="mdi-delete"
              @click:append="deleteLot(myLots[lot - 1], lot - 1)"
              :rules="FormStandardRules"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addLot" color="primary">Ajouter un lot</v-btn>
        <v-spacer />
        <v-btn v-if="isCancelable" color="error" @click.prevent="cancel">Annuler</v-btn>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Valider</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { FormStandardRules } from '@/utilities/constantes.ts'
import { LOT_DEFAULT } from '@/utilities/dataConst.ts'
import type { Lot } from '@/utilities/types'
import { ref } from 'vue'

defineProps({
  addLot: Function,
  deleteLot: { type: Function, required: true },
  numberOfLots: Number,
  validate: Function,
  isCancelable: Boolean, //FIXME: logique à revoir ça ne fonctionne pas
  cancel: Function
})

const myLots = defineModel('lotData', { type: Array<Lot>, required: true })

const valid = ref(false)

function getLabel(lot: number) {
  if (!!myLots.value[lot - 1].name) {
    return 'Lot ' + lot
  } else {
    return 'Choisir ou créer un lot'
  }
}
</script>
