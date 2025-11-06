<template>
  <v-card class="pa-2 pb-3">
    <v-card-title>Modifier les lots attributaires</v-card-title>
    <v-form>
      <v-card-text>
        <v-row>
          <v-col cols="6" class="text-h5">Entreprise </v-col>
          <v-col cols="6" class="text-h5">Lots attributaires </v-col>
        </v-row>
        <v-row v-for="business in myBusinesses" class="d-flex align-center">
          <v-col cols="6">
            {{ business.name }}
          </v-col>
          <v-col cols="6">
            <v-select
              multiple
              chips
              v-model="business.assignedLots"
              item-title="name"
              item-value="lotId"
              :items="props.lots"
              clearable
              hide-details
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.raw.name"
                  :value="item.raw.lotId"
                  :color="item.raw.color"
                ></v-chip>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="emit('cancelForm')" color="error">Annuler</v-btn>
        <v-spacer />
        <v-btn v-if="myBusinesses?.length > 0" color="success" class="mr-4" @click="validate"
          >Valider</v-btn
        >
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import type { Lot, Organisation } from '@/utilities/types'
import Axios from 'axios'
import { ref } from 'vue'

const emit = defineEmits(['cancelForm'])

const props = defineProps({
  businesses: Array<Organisation>,
  lots: Array<Lot>
})

const myBusinesses = ref(props.businesses)

function validate() {
  Axios.put('organisations/assignLotsToBusinesses', myBusinesses.value)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => console.error(err))
}
</script>
