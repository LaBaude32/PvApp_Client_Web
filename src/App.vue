<template>
  <v-layout>
    <v-app-bar color="surfaceVariant" class="d-print-none">
      <v-app-bar-title><strong class="text-secondary">Castera</strong></v-app-bar-title>
      <v-btn v-if="userSettingsStore.currentTheme == 'myCustomLightTheme'" icon="mdi-weather-night" variant="text"
        color="secondary" @click="userSettingsStore.toggleTheme()"></v-btn>
      <v-btn v-if="userSettingsStore.currentTheme == 'myCustomDarkTheme'" icon="mdi-weather-sunny" variant="text"
        color="secondary" @click="userSettingsStore.toggleTheme()"></v-btn>
      <v-btn class="mr-6" color="secondary" @click="action('Board')">
        <v-icon class="mr-3">mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="secondary" v-if="isLogged" class="diableOnMobile mr-6">
            <v-icon class="mr-3">mdi-account</v-icon>
            {{ fullName }}
          </v-btn>
          <v-btn v-bind="props" color="secondary" v-else @click="action('Login')" class="diableOnMobile">
            <v-icon class="mr-3">mdi-account</v-icon>
            Se connecter
          </v-btn>
        </template>
        <v-list class="mt-2">
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title @click.prevent="action(item.path)">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="d-flex flex-column align-center justify-center" style="min-height: 100vh">
      <div v-if="versionNotif" id="app-version-notif" class="mt-10">
        <v-banner class="mx-auto" max-width="800px" color="green" icon="mdi-information" lines="one" :stacked="false">
          <v-banner-text>
            Une nouvelle version est disponnible :
            <v-chip class="ma-3 text-white" color="green">
              {{ version }}
            </v-chip>
          </v-banner-text>

          <template v-slot:actions>
            <v-btn color="green" variant="outlined" @click.prevent="action('About')">
              Voir les nouveautés
            </v-btn>
          </template>
        </v-banner>
      </div>
      <router-view class="mt-5 w-100" />
    </v-main>
    <Notification />
  </v-layout>
</template>

<script setup lang="ts">
import Notification from '@/components/Notification.vue'
import Axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { version } from '../package.json'
import { useAuthStore } from './store/auth'
import { useNotificationStore } from './store/notification'
import { useUserStore } from './store/user'
import { useUserSettingsStore } from './store/userSettings'

const router = useRouter()
const userStore = useUserStore()
const notifStore = useNotificationStore()
const authStore = useAuthStore()
const userSettingsStore = useUserSettingsStore()

const theme = useTheme()

const versionNotif = ref(false)
const items = [
  { path: 'MyAccount', title: 'Mon Compte' },
  { path: 'Settings', title: 'Paramètres' },
  { path: 'Logout', title: 'Se deconnecter' }
]

const isLogged = computed(() => userStore.isLogged)
const fullName = computed(() => userStore.fullName)

function action(path: string) {
  if (path == 'Logout') {
    authStore.authLogout().then(() => {
      router.push('Login')
    })
  } else {
    router.push({ name: path })
  }
}
onMounted(() => {
  authStore.setAxios()
  Axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.code == 'ERR_NETWORK') {
        notifStore.error('Serveur injoignable')
      } else if (error.status == 500) {
        notifStore.error('Erreur de traitement au niveau du serveur')
      } else if ([401, 403].includes(error.status)) {
        authStore.authError()
        notifStore.error("Erreur d'authentification : " + error.message)
      } else {
        notifStore.error(error.message)
      }
      return Promise.reject(error)
    }
  )
  //verification de nouvelle version
  if (localStorage.getItem('appVersion') != version) {
    versionNotif.value = true
    localStorage.setItem('appVersion', version)
  }

  // Initialiser le thème à partir du store
  if (userSettingsStore.currentTheme) {
    theme.change(userSettingsStore.currentTheme)
  }
})

//Mise à jour thème dynamiquement
watch(
  () => userSettingsStore.currentTheme,
  (newTheme) => {
    theme.change(newTheme)
  }
)
</script>

<style>
#app-version-notif {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

@media screen and (max-device-width: 460px) {
  .diableOnMobile {
    display: none;
    visibility: hidden;
  }
}
</style>
