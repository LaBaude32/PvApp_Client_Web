<template>
  <v-layout>
    <v-app-bar color="primary darken-1" dark class="d-print-none">
      <v-app-bar-nav-icon @click.stop="invertDrawerMain" />
      <v-app-bar-title>PvApp</v-app-bar-title>
      <v-btn class="mr-6" @click="action('Board')">
        <v-icon class="mr-3">mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" v-if="isLogged" class="diableOnMobile">
            <v-icon class="mr-3">mdi-account</v-icon>
            {{ fullName }}
          </v-btn>
          <v-btn v-bind="props" v-else @click="action('Login')" class="diableOnMobile">
            <v-icon class="mr-3">mdi-account</v-icon>
            Se connecter
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index" :value="index">
            <v-list-item-title @click.prevent="action(item.path)">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawerMain">
      <v-list nav>
        <v-list-item
          v-for="item in mainMenuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          @click.prevent="actionMainMenu(item.path)"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div v-if="versionNotif" id="app-version-notif" class="mt-10">
        <v-banner
          class="mx-auto"
          max-width="800px"
          dark
          color="green"
          icon="mdi-information"
          lines="1"
          stacked="false"
        >
          <v-banner-text>
            Une nouvelle version est disponnible :
            <v-chip class="ma-3" color="green" text-color="white">
              {{ version }}
            </v-chip>
          </v-banner-text>

          <template v-slot:actions>
            <v-btn color="green" variant="outlined" dark @click.prevent="action('About')">
              Voir les nouveautés
            </v-btn>
          </template>
        </v-banner>
      </div>
      <router-view class="mt-5" />
    </v-main>
    <Notification />
  </v-layout>
</template>

<script setup>
import Axios from 'axios'
import { getRouteName } from '@/utilities/constantes'
import Notification from '@/components/Notification.vue'
import { version } from '../package.json'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from './store/notification'
import { useAuthStore } from './store/auth'
import { useUserStore } from './store/user'

const router = useRouter()
const userStore = useUserStore()
const notifStore = useNotificationStore()
const authStore = useAuthStore()

const versionNotif = ref(false)
const drawerMain = ref(false)
const items = [
  { path: 'MyAccount', title: 'Mon Compte' },
  { path: 'Settings', title: 'Paramètres' },
  { path: 'Logout', title: 'Se deconnecter' }
]
const mainMenuItems = [
  {
    path: getRouteName('home'),
    title: 'Pv App',
    icon: 'mdi-home'
  },
  {
    path: getRouteName('board'),
    title: 'Dashboard',
    icon: 'mdi-view-dashboard'
  },
  {
    path: getRouteName('addUser'),
    title: 'Créer un compte',
    icon: 'mdi-account-plus',
    color: ''
  },
  {
    path: getRouteName('about'),
    title: 'A propos',
    icon: 'mdi-information',
    color: ''
  }
]
const isLogged = computed(() => userStore.isLogged)
const fullName = computed(() => userStore.fullName)

function actionMainMenu(path) {
  router.push({ name: path })
}
function action(path) {
  if (path == 'Logout') {
    authStore.authLogout().then(() => {
      router.push('Login')
    })
  } else {
    router.push({ name: path })
  }
}
function invertDrawerMain() {
  drawerMain.value = !drawerMain.value
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
})
</script>

<style>
#app-version-notif {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

@media screen and (max-device-width: 460px) {
  .diableOnMobile {
    display: none;
    visibility: hidden;
  }
}
</style>
