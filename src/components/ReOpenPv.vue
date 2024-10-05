<template>
  <v-sheet rounded color="red-darken-1" elevation="2" class="justify-center mx-auto pa-5 mt-5">
    <h2 class="mb-5">Réouvrir un Pv</h2>
    <v-card class="pa-5">
      <v-data-table
        :headers="headers"
        :items="data"
        :search="search"
        :sort-by="[{ key: 'releaseDate', order: 'desc' }]"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Réouvrir un Pv</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Chercher"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:item.releaseDate="{ item }">
          {{ $filters.formatDateWithA(item.releaseDate) }}
        </template>
        <template v-slot:item.meetingDate="{ item }">
          {{ $filters.formatDateWithA(item.meetingDate) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn small class="mr-2" color="warning" @click="showAlert(item)">Débloquer</v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Etes vous sûr de réouvrir ce Pv ?</v-card-title>
        <v-card-text>
          <p class="text-red-darken-1"><b>Attention : La date de diffusion sera supprimé !</b></p>
          <br />
          <p>Affaire : {{ pv.affairName }}</p>
          <p>Pv n°{{ pv.pvNumber }}</p>
          <p>Lieu de la réunion : {{ pv.meetingPlace }}</p>
          <p>Date de la réunion : {{ $filters.formatDateWithA(pv.meetingDate) }}</p>
          <p>Diffusé le : {{ $filters.formatDateWithA(pv.releaseDate) }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="unlockPv()">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
<script setup>
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useUserStore } from '../store/user'
import Axios from 'axios'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const { data } = useAxios('/pvs/userId/released', {
  params: {
    userId: userStore.user.userId
  }
})

const dialog = ref(false)
const search = ref()
const headers = [
  { title: 'Date de publication', value: 'releaseDate', sortable: true },
  { title: "Nom de l'affaire", value: 'affairName', sortable: true },
  {
    title: 'Numéro du pv',
    align: 'center',
    value: 'pvNumber',
    sortable: true
  },
  { title: 'Date de la réunion', value: 'meetingDate', sortable: true },
  { title: 'Lieu de la réunion', value: 'meetingPlace' },
  { title: 'Réouvrir ?', value: 'actions' }
]
const pv = ref({})

function showAlert(val) {
  pv.value = val
  dialog.value = true
}

function unlockPv() {
  const pvId = pv.value.pvId
  Axios.put('/pvs/pvId/unValidate', { pvId: pvId })
    .then((result) => {
      router.push({
        name: 'Pv',
        params: { id: result.data.pvId }
      })
    })
    .catch((err) => {
      console.error(err)
    })
  dialog.value = false
}
</script>
