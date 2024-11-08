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
              append-icon="mdi-delete"
              @click:append="deleteLot(myLots[lot - 1], lot - 1)"
              :rules="FormStandardRules"
            ></v-text-field>
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

<script setup>
import { FormStandardRules } from '@/utilities/constantes.ts'
import { ref } from 'vue'

defineProps({
  addLot: Function,
  deleteLot: Function,
  numberLots: Number,
  validate: Function,
  isCancelable: Boolean, //FIXME: logique étrange
  cancel: Function
})

const myLots = defineModel('lotData', { type: Array, required: true })

const valid = ref(false)
</script>
