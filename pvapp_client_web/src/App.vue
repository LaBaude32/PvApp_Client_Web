<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawerRight" app clipped right>
      <v-list dense>
        <v-list-item @click.stop="right = !right">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Open Temporary Drawer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary darken-1" clipped-right dark>
      <v-app-bar-nav-icon @click.stop="drawerMain = !drawerMain" />
      <v-toolbar-title>Menu</v-toolbar-title>
      <v-spacer />
      <div class="d-flex align-center">
        <h2>PvApp</h2>
      </div>
      <v-spacer />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            <v-icon class="mr-3">mdi-account</v-icon>
            {{ connected }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" @click="action(item.path)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
      <!-- <router-link to="/Login" tag="button">
        <span class="mr-2">{{connected}}</span>
        <v-icon>mdi-account</v-icon>
      </router-link> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawerMain" app>
      <v-list nav>
        <v-list-item v-for="item in mainMenuItems" :key="item" @click.prevent="actionMainMenu(item.path)" link>
          <v-list-item-action>
            <v-icon medium :color="item.color">{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="title">{{item.title}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <div id="app" class="mt-10">
        <router-view />
      </div>
    </v-content>
  </v-app>
</template>

<script>
let toReturn;

export default {
  data() {
    return {
      drawerMain: false,
      drawerRight: false,
      stateConnection: "Se connecter", //TODO: Gérer ça de marnière globale, Store ?
      items: [
        { path: "Login", title: "Se connecter" },
        { path: "MyAccount", title: "Mon Compte" },
        { path: "Board", title: "Board" },
        { path: "Logout", title: "Se deconnecter" }
      ],
      mainMenuItems: [
        {
          path: "Home",
          title: "Pv App",
          icon: "mdi-home",
          color: "blue darken-2"
        },
        { path: "board", title: "Board", icon: "mdi-clipboard-pulse" },
        {
          path: "Users",
          title: "Personnes",
          icon: "mdi-account",
          color: ""
        },
        {
          path: "Counter",
          title: "Compteur Store",
          icon: "mdi-counter",
          color: ""
        },
        {
          path: "About",
          title: "A propos",
          icon: "mdi-information",
          color: ""
        }
      ]
    };
  },
  computed: {
    connected() {
      if (localStorage.userId) {
        toReturn = localStorage.userFullName;
      } else {
        toReturn = "Se connecter";
      }
      return toReturn;
    } //FIXME : ne fonctionne que si on recharge la page
  },
  methods: {
    actionMainMenu(path) {
      this.$router.replace(path);
    },
    action(path) {
      if (path == "Logout") {
        localStorage.clear();
        this.$router.replace("Home");
      } else {
        this.$router.replace(path);
      }
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
</style>
