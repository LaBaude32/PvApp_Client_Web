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
            <v-list-item-title @click.prevent="action(item.path)">{{ item.title }}</v-list-item-title>
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
      <div id="app-version-notif" class="mt-10">
        <v-alert
          class="mx-auto"
          max-width="800px"
          v-model="versionNotif"
          dismissible
          color="green"
          border="start"
          elevation="2"
          colored-border
          icon="mdi-information"
          prominent
        >
          <v-row align="center">
            <v-col class="grow">Une nouvelle version est disponnible.</v-col>
            <v-col class="shrink">
              <v-chip class="ma-3" color="green" text-color="white">
                {{ appVersion }}
              </v-chip>
            </v-col>
            <v-col class="shrink">
              <v-btn color="green" dark @click.prevent="action('About')">Voir les nouveautés</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </div>
      <router-view />
    </v-main>
    <Notification />
  </v-layout>
</template>

<script>
import Axios from 'axios'
import { mapGetters } from 'vuex'
import { getRouteName } from './utilities/constantes'
import Notification from '@/components/Notification.vue'
import { version } from '../package'

export default {
  components: {
    Notification
  },
  data() {
    return {
      appVersion: version,
      right: false,
      versionNotif: false,
      drawerMain: false,
      drawerRight: false,
      items: [
        { path: 'MyAccount', title: 'Mon Compte' },
        { path: 'Logout', title: 'Se deconnecter' }
      ],
      mainMenuItems: [
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
    }
  },
  computed: {
    ...mapGetters('user', {
      isLogged: 'isLogged',
      fullName: 'fullName'
    })
  },
  methods: {
    actionMainMenu(path) {
      this.$router.push({ name: path })
    },
    action(path) {
      if (path == 'Logout') {
        this.$store.dispatch('auth/authLogout').then(() => {
          this.$router.push('Login')
        })
      } else {
        this.$router.push({ name: path })
      }
    },
    invertRight() {
      this.right = !this.right
    },
    invertDrawerMain() {
      this.drawerMain = !this.drawerMain
    },
    invertDrawerRight() {
      this.drawerRight = !this.drawerRight
    }
  },
  created: function () {
    const self = this
    Axios.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        self.$store.dispatch('notification/error', "Erreur d'authentification")
        if (error.response.status == 401) {
          if (error.config.url == 'tokens') {
            self.$store.dispatch('auth/authError')
          } else {
            // if you ever get an unauthorized, logout the user
            self.$store.dispatch('auth/authLogout')
          }
        }
        return Promise.reject(error)
      }
    )
    //verification de nouvelle version
    let oldVersion = localStorage.getItem('appVersion')
    if (oldVersion != this.appVersion) {
      this.versionNotif = true
      localStorage.setItem('appVersion', this.appVersion)
    }
  }
}
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
