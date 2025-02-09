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
              v-model="editedItem.phone"
              label="Téléphone"
              :rules="FormPhoneRules"
              clearable
              counter="10"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
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
              v-model="otp"
              label="Code de validation"
              :rules="FormOTPRules"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mb-12">
          <v-btn color="primary" class="mx-auto" :disabled="!valid" @click="saveUser"
            >Valider</v-btn
          >
        </v-row>
      </v-form>
    </div>
    <div v-else class="d-flex h-screen justify-center align-center text-center">
      <h1 class="text-primary">Vous avez bien été ajouté.<br />Merci ! 😍</h1>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Axios from 'axios'

import { useNotificationStore } from '@/store/notification'

import { USER_GROUPE_ITEMS, EDITED_ITEM } from '@/utilities/dataConst'
import {
  FormNameRules,
  FormEmailRules,
  FormPhoneRules,
  FormRequiredRules,
  FormOTPRules
} from '@/utilities/constantes.ts'

const notifStore = useNotificationStore()

const editedItem = ref(EDITED_ITEM)
const otp = ref('')
const valid = ref(false)
const userAdded = ref(false)

const props = defineProps({
  pvId: String
})

function saveUser() {
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
}
</script>
