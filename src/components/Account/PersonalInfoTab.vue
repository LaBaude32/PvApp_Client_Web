<template>
  <div class="personal-info-tab py-5">
    <v-btn class="mb-6" color="primary" @click="login">Login Using Google</v-btn>

    <Vue3GoogleLogin
      :clientId="YOUR_CLIENT_ID"
      @onSuccess="handleSuccess"
      @onError="handleError"
    ></Vue3GoogleLogin>

    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Informations personnelles</h3>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.firstName"
            label="Prénom"
            required
            :rules="FormFirstNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.lastName"
            label="Nom de famille"
            required
            :rules="FormLastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.email"
        label="Adresse email"
        type="email"
        required
        :rules="FormEmailSimpleRules"
        readonly
        variant="plain"
        hint="Verrouillé, contactez l'administrateur pour modifier le mail"
        persistent-hint
      ></v-text-field>

      <v-text-field
        v-model="formData.phone"
        label="Numéro de téléphone"
        :rules="FormPhoneSimpleRules"
      ></v-text-field>

      <div class="text-subtitle-1 mb-4">Sécurité</div>

      <v-text-field
        v-model="formData.password"
        label="Mot de passe actuel"
        type="password"
        :rules="FormPasswordMin8Rules"
      ></v-text-field>

      <v-text-field
        v-model="formData.newPassword"
        label="Nouveau mot de passe"
        type="password"
        :rules="FormPasswordComplexRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.confirmPassword"
        label="Confirmer le nouveau mot de passe"
        type="password"
        :rules="confirmPasswordRules"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import {
  FormEmailSimpleRules,
  FormFirstNameRules,
  FormLastNameRules,
  FormPasswordComplexRules,
  FormPasswordMin8Rules,
  FormPhoneSimpleRules
} from '@/utilities/constantes'
import { ref, watch } from 'vue'
import Vue3GoogleLogin, { googleAuthCodeLogin } from 'vue3-google-login'

// État du formulaire
const isValid = ref<boolean>(true)
const form = ref<any>(null)
const login = () => {
  googleAuthCodeLogin().then((response) => {
    console.log('Handle the response', response)
  })
}

const YOUR_CLIENT_ID = '635178543002-7661u2ol4839cjpvkgrp7h8uhpu4mp3e.apps.googleusercontent.com'

function handleSuccess(response) {
  // Récupérez le token d'accès depuis la réponse
  const accessToken = response.credential
  console.log('Access Token:', accessToken)

  // Envoyez le token d'accès à votre serveur backend
  sendTokenToBackend(accessToken)
}
function handleError(error) {
  console.error('Error:', error)
}
function sendTokenToBackend(accessToken) {
  // Envoyez le token d'accès à votre serveur backend via une requête API
  fetch('http://votre-serveur-backend.com/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ accessToken })
  })
    .then((response) => response.json())
    .then((data) => console.log('Success:', data))
    .catch((error) => console.error('Error:', error))
}

// Données du formulaire
const props = defineProps<{
  userData: any
}>()

const formData = ref({
  firstName: props.userData.firstName || '',
  lastName: props.userData.lastName || '',
  email: props.userData.email || '',
  phone: props.userData.phone || '',
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const confirmPasswordRules = [
  (value: string) =>
    !value || value === formData.value.newPassword || 'Les mots de passe ne correspondent pas'
]

// Watcher pour synchroniser les données de l'utilisateur avec le formulaire
watch(
  () => props.userData,
  (newData) => {
    formData.value = {
      ...formData.value,
      firstName: newData.firstName || '',
      lastName: newData.lastName || '',
      email: newData.email || '',
      phone: newData.phone || ''
    }
  }
)
</script>

<style scoped>
/* Style pour les champs de formulaire */
.personal-info-tab .v-text-field {
  margin-bottom: 16px;
}
</style>
