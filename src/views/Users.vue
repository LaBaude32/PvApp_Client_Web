<template>
  <div class="usersAllDisplay">
    <v-row class="text-center justify-center">
      <v-col cols="4" v-for="user in users" v-bind:key="user.id">
        <v-card class="mx-auto mb-5" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
              <v-card-text class="text--primary">
                <div>Organisme : {{ user.organism }}</div>
                <div>Fonction : {{ user.function }}</div>
                <div>Groupe : {{ user.user_group }}</div>
              </v-card-text>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const axios = require("axios");

export default {
  name: "Users",
  data() {
    return {
      users: []
    };
  },
  mounted() {
    let self = this;

    axios({
      methode: "get",
      url: "getAllUsers",
      Authorization: this.$store.getters.tokenType + " " + this.$store.getters.token
    })
      .then(function (response) {
        // handle success
        self.users = response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  },
  computed: {
    ...mapGetters("auth", {
      token: "token",
      tokenType: "tokenType"
    })
  }
};
</script>
