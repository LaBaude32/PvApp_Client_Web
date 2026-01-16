<template>
  <v-fab :key="fabPosition" app :color="open ? '' : 'primary'" size="large" icon>
    <v-icon>{{ open ? 'mdi-close' : 'mdi-plus' }}</v-icon>
    <v-speed-dial
      v-model="open"
      location="top center"
      transition="scale-transition"
      activator="parent"
    >
      <v-btn key="1" color="primary" icon size="large">
        <v-icon size="24">mdi-note-plus</v-icon>
      </v-btn>

      <v-btn key="2" color="tertiary" icon size="large">
        <v-icon size="24">mdi-account-plus</v-icon>
      </v-btn>

      <v-btn key="3" color="tertiary" icon size="large">
        <v-icon size="24">mdi-account-search</v-icon>
      </v-btn>

      <v-btn key="4" color="tertiary" icon size="large">
        <v-icon size="24">mdi-qrcode-scan</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-fab>
</template>

<script setup>
import { shallowRef } from 'vue'

const open = shallowRef(false)
const fabPosition = shallowRef('absolute')

defineProps({
  addItem: Function,
  addUser: Function,
  searchUser: Function,
  openQrCode: Function
})
</script>

<style scoped>
/* This is for documentation purposes and will not be needed in your application */
::v-deep(.v-application__wrap) {
  min-height: 0 !important;
}
</style>
