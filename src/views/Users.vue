<template>
  <div class="usersAllDisplay">
    <v-row class="text-center justify-center">
      <v-col cols="4" v-for="user in users" v-bind:key="user.userId">
        <v-card class="mx-auto mb-5" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item>
              <v-list-item-title class="text-h5 mb-1"
                >{{ user.firstName }} {{ user.lastName }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ user.phone }}</v-list-item-subtitle>
              <v-card-text class="text--primary">
                <div>Organisme : {{ user.organism }}</div>
                <div>Fonction : {{ user.userFunction }}</div>
                <div>Groupe : {{ user.userGroup }}</div>
              </v-card-text>
            </v-list-item>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Axios from 'axios'
import type { User } from '@/utilities/types'

const users = ref<User[]>()

onMounted(() => {
  Axios.get('users')
    .then(function (response) {
      // handle success
      users.value = response.data
    })
    .catch(function (error) {
      // handle error
      console.log(error)
    })
})
</script>
