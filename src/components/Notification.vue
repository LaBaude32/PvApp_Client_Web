<template>
  <v-snackbar v-model="store.state" :color="store.color" :timeout="store.timeout">
    {{ store.text }}
    <template v-slot:actions>
      <v-btn
        v-if="store.color == 'red'"
        class="ml-2"
        target="_blank"
        href="https://gitlab.com/LaBaude32/PvApp_Core/-/issues"
      >
        Signaler un bug
      </v-btn>
      <v-icon @click="store.close">mdi-close-circle</v-icon>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationStore } from '../store/notification'
const store = useNotificationStore()
</script>
