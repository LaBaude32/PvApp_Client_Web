<template>
  <v-container>
    <v-row class="text-center h-auto w-auto d-flex align-center justify-content-center">
      <v-col cols="12">
        <h1>Bienvenu dans Castera</h1>
        <p>Une application de suivi de chantier</p>
      </v-col>
      <v-col cols="12">
        <v-btn v-if="isLogged" color="primary" dark class="mb-2" @click="goToDashboard"
          >Dashboard</v-btn
        >
        <v-btn v-else color="primary" dark class="mb-2" @click="goToLoginPage"
          >Connectez-vous</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { getRouteName } from '../utilities/constantes'

const userStore = useUserStore()
const router = useRouter()

const isLogged = computed(() => userStore.isLogged)

function goToDashboard() {
  router.push(getRouteName('board'))
}
function goToLoginPage() {
  router.push(getRouteName('login'))
}
</script>
