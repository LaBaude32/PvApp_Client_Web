/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
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
          <v-btn color="primary" dark v-on="on" v-if="isLogged">
            <v-icon class="mr-3">mdi-account</v-icon>
            {{ fullName }}
          </v-btn>
          <v-btn color="primary" dark v-on="on" v-else @click="action('Login')">
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
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawerMain" app>
      <v-list nav>
        <!-- TODO: SESSION mettre ça dans un composant ? -->
        <v-list-item v-for="item in mainMenuItems" :key="item.title" @click.prevent="actionMainMenu(item.path)" link>
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
import { axios } from "axios";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      drawerMain: false,
      drawerRight: false,
      items: [
        { path: "MyAccount", title: "Mon Compte" },
        { path: "Board", title: "Board" },
        { path: "Logout", title: "Se deconnecter" }
      ],
      mainMenuItems: [
        //TODO: SESSION comment avoir une classe active ?
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
          path: "About",
          title: "A propos",
          icon: "mdi-information",
          color: ""
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
      this.$router.push(path);
    },
    action(path) {
      if (path == "Logout") {
        this.$store.dispatch("auth/authLogout").then(() => {
          this.$router.push("Login");
        });
      } else {
        this.$router.push(path);
      }
    }
  },
  created: function() {
    //FIXME: SESSION pourquoi cet interceptors ce fonctionne pas ?
    axios.interceptors.response.use(
      function(resp) {
        console.log(resp);
        alert("test");
      },
      function(error) {
        console.log(error);
        alert("error");
        return new Promise(function() {
          if (
            error.status === 401 &&
            error.config &&
            !error.config.__isRetryRequest
          ) {
            alert("test");
            // if you ever get an unauthorized, logout the user
            this.$store.dispatch("AUTH_LOGOUT");
            // you can also redirect to /login if needed !
          }
          throw error;
        });
      }
    );
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
