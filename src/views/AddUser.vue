<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary">
            <v-toolbar-title>Créer un compte</v-toolbar-title>
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Email"
                    prepend-inner-icon="mdi-account"
                    type="text"
                    v-model="user.email"
                    :rules="FormEmailRules"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    id="password"
                    label="Mot de passe"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    v-model="user.password"
                    :rules="FormPasswordRules"
                    counter
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Prénom"
                    type="text"
                    v-model="user.firstName"
                    :rules="FormNameRules"
                    counter="35"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Nom"
                    type="text"
                    v-model="user.lastName"
                    :rules="FormNameRules"
                    counter="35"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Téléphone"
                    type="text"
                    v-model="user.phone"
                    :rules="FormPhoneRules"
                    counter="10"
                  />
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="user.userGroup"
                    :items="USER_GROUPE_ITEMS"
                    label="Groupe"
                    clearable
                    :rules="FormRequiredRules"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Fonction"
                    type="text"
                    v-model="user.userFunction"
                    counter="35"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Organisme"
                    type="text"
                    v-model="user.organism"
                    counter="35"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <!-- FIXME: problème ici parce que si on valide les règle après on peut faire nimp ça reste validé -->
              <v-btn color="error" @click.prevent="cancelForm">Annuler</v-btn>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click.prevent="validate">Ajouter</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Axios from 'axios'
import {
  getRouteName,
  FormEmailRules,
  FormNameRules,
  FormPhoneRules,
  FormPasswordRules,
  FormRequiredRules
} from '@/utilities/constantes'
import { USER_GROUPE_ITEMS } from '@/utilities/dataConst'
import md5 from 'md5'
import { useRouter } from 'vue-router'
import type { User } from '@/utilities/types'

const router = useRouter()

const valid = ref(false)
const showPassword = ref(false)
const user = ref<User>()

function validate() {
  user.value!.password = md5(user.value!.password)
  Axios.post('users', user.value)
    .then((response) => {
      router.push(getRouteName('board'))
    })
    .catch((error) => {
      console.log(error)
    })
}

function cancelForm() {
  router.push('board')
}
</script>
