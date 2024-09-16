<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-alert type="error" v-if="resultConnetion === 'errorId'">Erreur sur l'email ou le mot de passe</v-alert>
        <v-alert type="error" v-if="resultConnetion === 'errorConnection'">
          Erreur de connexion au serveur, veuillez vérifier votre connexion internet
        </v-alert>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary">
            <v-toolbar-title>Connexion</v-toolbar-title>
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-text-field
                placeholder="Email"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                v-model="email"
                :rules="FormEmailRules"
              />
              <v-text-field
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mot de passe"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                @click:append-inner="showPassword = !showPassword"
                v-model="password"
                :rules="FormRequiredRules"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click.prevent="login">Connexion</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import md5 from 'md5'
import { FormEmailRules, FormRequiredRules } from '@/utilities/constantes'
import { useNotificationStore } from '../store/notification'

const store = useStore()
const notifStore = useNotificationStore()
const router = useRouter()

const valid = ref(false)
const showPassword = ref(false)
const email = ref(null)
const password = ref(null)

const resultConnetion = computed(() => store.getters['user/resultCo'])

function login() {
  const dt = {
    email: email.value,
    password: md5(password.value)
  }
  if (localStorage.getItem('token') == null) {
    store
      .dispatch('auth/authRequest', dt)
      .then(() => {
        store
          .dispatch('user/login', dt)
          .then(() => {
            notifStore.success('Connexion réussie')
            router.push('/Board')
          })
          .catch(() => {
            store.dispatch('auth/authError')
          })
      })
      .catch(() => {
        store.dispatch('auth/authError')
      })
  }
}
</script>
