<template>
  <v-container>
    <div v-if="!userAdded">
      <h2 class="mb-4">M'ajouter aux participants de la réunion de l'affaire</h2>

      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.firstName"
              label="Prénom"
              :rules="FormNameRules"
              clearable
              counter="30"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.lastName"
              label="Nom"
              :rules="FormNameRules"
              clearable
              counter="30"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              type="tel"
              v-model="editedItem.phone"
              label="Téléphone"
              :rules="FormPhoneRules"
              clearable
              counter="10"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              type="email"
              v-model="editedItem.email"
              label="Mail"
              :rules="FormEmailRules"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="editedItem.userGroup"
              :items="USER_GROUPE_ITEMS"
              label="Groupe"
              :rules="FormRequiredRules"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.userFunction"
              label="Fonction"
              clearable
              counter="30"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="editedItem.organism"
              label="Organisme"
              clearable
              counter="30"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              type="number"
              v-model="otp"
              label="Code de validation"
              :rules="FormOTPRules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-12">
          <v-btn color="primary" class="mx-auto" :disabled="!valid || loading" @click="saveUser">
            <v-progress-circular
              v-if="loading"
              color="primary"
              indeterminate
              :size="30"
              :width="5"
            ></v-progress-circular>
            <span v-else>Valider</span>
          </v-btn>
        </v-row>
      </v-form>
    </div>
    <div v-else class="d-flex h-screen justify-center align-center text-center">
      <h1 class="text-primary">Vous avez bien été ajouté.<br />Merci ! 😍</h1>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import Axios from 'axios'
import { ref } from 'vue'

import { useNotificationStore } from '@/store/notification'

import {
  FormEmailRules,
  FormNameRules,
  FormOTPRules,
  FormPhoneRules,
  FormRequiredRules
} from '@/utilities/constantes.ts'
import { EDITED_ITEM, USER_GROUPE_ITEMS } from '@/utilities/dataConst'

const notifStore = useNotificationStore()

const editedItem = ref(EDITED_ITEM)
const otp = ref('')
const valid = ref(false)
const userAdded = ref(false)
const loading = ref(false)

const props = defineProps({
  pvId: String
})

function saveUser() {
  loading.value = true
  let data = { ...editedItem.value }
  data.otp = Number(otp.value)
  data.pvId = Number(props.pvId)
  Axios.post('/participants/selfCreate', data)
    .then((response) => {
      if (response.status == 201) {
        notifStore.success('Vous avez bien été ajouté !')
        userAdded.value = true
      }
    })
    .catch((error) => {
      if (error.status == 406) {
        notifStore.error('Code de validation incorrecte')
      }
      console.log(error)
    })
    .finally(() => {
      loading.value = false
    })
}
</script>
