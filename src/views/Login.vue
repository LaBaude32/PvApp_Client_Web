<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col>
        <v-alert type="error" v-if="resultConnetion === 'ErrorId'"
          >Erreur sur l'email ou le mot de passe</v-alert
        >
        <!-- <v-alert type="error" v-if="resultConnetion === 'ErrorConnection'">
          TODO:cette possibilité n'existe pas dans les actions du store
          Erreur de connexion au serveur, veuillez vérifier votre connexion internet
        </v-alert> -->
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col>
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
                @keyup.enter="login"
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

<script setup lang="ts">
import { FormEmailRules, FormRequiredRules } from '@/utilities/constantes'
import md5 from 'md5'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useNotificationStore } from '../store/notification'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const notifStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

const valid = ref(false)
const showPassword = ref(false)
const email = ref('')
const password = ref('')

const resultConnetion = computed(() => userStore.resultCo)

function login() {
  const dt = {
    email: email.value,
    password: md5(password.value)
  }
  if (localStorage.getItem('token') == null) {
    authStore
      .authRequest(dt)
      .then(() => {
        userStore
          .login(dt)
          .then(() => {
            notifStore.success('Connexion réussie')
            router.push('/Board')
          })
          .catch(() => {
            authStore.authError()
          })
      })
      .catch(() => {
        authStore.authError()
      })
  }
}
</script>
