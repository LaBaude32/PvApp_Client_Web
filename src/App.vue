<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer v-model="drawerRight" app clipped right>
      <v-list dense>
        <v-list-item @click.stop="invertRight">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content> 
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar app color="primary darken-1" clipped-right dark class="d-print-none">
      <v-app-bar-nav-icon @click.stop="invertDrawerMain" />
      <v-toolbar-title class="diableOnMobile">Menu</v-toolbar-title>
      <v-spacer />
      <!-- TODO: Comment detecter qu'on est en mobile ou pas ? -->
      <div class="d-flex align-center">
        <h2>PvApp</h2>
      </div>
      <v-spacer />
      <v-btn class="mr-6" color="primary" @click="action('Board')"><v-icon class="mr-3">mdi-view-dashboard</v-icon>Dashboard</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" v-on="on" v-if="isLogged" class="diableOnMobile">
            <v-icon class="mr-3">mdi-account</v-icon>
            {{ fullName }}
          </v-btn>
          <v-btn color="primary" v-on="on" v-else @click="action('Login')" class="diableOnMobile">
            <v-icon class="mr-3">mdi-account</v-icon>
            Se connecter
          </v-btn>
        </template>
        <v-list v-if="isLogged">
          <v-list-item v-for="item in items" :key="item.title" @click="action(item.path)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- <v-app-bar-nav-icon @click.stop="invertDrawerRight" /> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawerMain" app>
      <v-list nav>
        <v-list-item v-for="item in mainMenuItems" :key="item.title" @click.prevent="actionMainMenu(item.path)" link>
          <v-list-item-icon>
            <v-icon medium :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <div id="app" class="mt-10">
        <v-alert
          class="mx-auto"
          max-width="800px"
          v-model="versionNotif"
          dismissible
          color="green"
          border="left"
          elevation="2"
          colored-border
          icon="mdi-information"
          prominent
        >
          <v-row align="center">
            <v-col class="grow"> Une nouvelle version est disponnible. </v-col>
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
        <router-view />
      </div>
    </v-main>
    <Notification />
  </v-app>
</template>

<script>
import Axios from "axios";
import { mapGetters } from "vuex";
// import routesCONST from "./utilities/constantes";
import { getRouteName } from "./utilities/constantes";
import Notification from "@/components/Notification.vue";
import { version } from "../package";

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
        { path: "MyAccount", title: "Mon Compte" },
        // { path: getRouteName("board"), title: "Board" },
        { path: "Logout", title: "Se deconnecter" }
      ],
      mainMenuItems: [
        {
          path: getRouteName("home"),
          title: "Pv App",
          icon: "mdi-home",
          color: "blue darken-2"
        },
        {
          path: getRouteName("board"),
          title: "Dashboard",
          icon: "mdi-view-dashboard"
        },
        // {
        //   path: getRouteName("user"),
        //   title: "Personnes",
        //   icon: "mdi-account",
        //   color: ""
        // },
        {
          path: getRouteName("addUser"),
          title: "Créer un compte",
          icon: "mdi-account-plus",
          color: ""
        },
        // {
        //   path: getRouteName("addLot"),
        //   title: "Créer un lot",
        //   icon: "mdi-account",
        //   color: ""
        // },
        {
          path: getRouteName("about"),
          title: "A propos",
          icon: "mdi-information",
          color: ""
          // },
          // {
          //   path: getRouteName("test"),
          //   title: "page TEST",
          //   icon: "mdi-alert",
          //   color: "orange"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("user", {
      isLogged: "logged",
      fullName: "fullName"
    })
  },
  methods: {
    actionMainMenu(path) {
      this.$router.push({ name: path });
    },
    action(path) {
      if (path == "Logout") {
        this.$store.dispatch("auth/authLogout").then(() => {
          this.$router.push("Login");
        });
      } else {
        this.$router.push({ name: path });
      }
    },
    invertRight() {
      this.right = !this.right;
    },
    invertDrawerMain() {
      this.drawerMain = !this.drawerMain;
    },
    invertDrawerRight() {
      this.drawerRight = !this.drawerRight;
    }
  },
  created: function () {
    Axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        this.$store.dispatch("notification/error", "error");
        if (error.status === 401) {
          if (error.config.url == "/tokens") {
            this.$store.dispatch("auth/authError");
          } else {
            // if you ever get an unauthorized, logout the user
            this.$store.dispatch("auth/authLogout");
          }
        }
        return Promise.reject(error);
      }
    );
    //verification de nouvelle version
    let oldVersion = localStorage.getItem("appVersion");
    if (oldVersion != this.appVersion) {
      this.versionNotif = true;
      localStorage.setItem("appVersion", this.appVersion);
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
