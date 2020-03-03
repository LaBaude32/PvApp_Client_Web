<template>
  <div class="usersAllDisplay">
    <v-card class="mx-auto mb-5" max-width="344" outlined v-for="user in users" v-bind:key="user.id">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">{{user.firstName}} {{user.lastName}}</v-list-item-title>
          <v-list-item-subtitle>{{user.email}}</v-list-item-subtitle>
          <v-list-item-subtitle>{{user.phone}}</v-list-item-subtitle>
          <v-card-text class="text--primary">
            <div>Organisme : {{user.organism}}</div>
            <div>Fonction : {{user.function}}</div>
            <div>Groupe : {{user.user_group}}</div>
          </v-card-text>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
const axios = require("axios"); //TODO : ne peut-on pas definir une instance de axios une fois dans le main.js ou le app.vue ?
const instance = axios.create({
  baseURL: process.env.VUE_APP_ROOT_URL,
  timeout: 1000,
  withCredentials: false
});

export default {
  name: "Users",
  data() {
    return {
      users: []
    };
  },
  mounted() {
    let self = this;

    instance
      .get("getAllUsers")
      .then(function(response) {
        // handle success
        self.users = response.data;
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  }
};
</script>
