<template>
  <v-snackbar top right :color="color" app>
    <v-icon :color="btnColor" :dark="isDark" @click="close">mdi-close-circle</v-icon>
    {{ text }}
    <v-btn
      v-if="color == 'red'"
      class="ml-2"
      target="_blank"
      href="https://github.com/LaBaude32/PvApp_Client_Web/issues"
    >
      Signaler un bug
    </v-btn>
  </v-snackbar>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const text = computed(() => store.getters['notification/text'])
const color = computed(() => store.getters['notification/color'])
const btnColor = computed(() => store.getters['notification/btnColor'])
const isDark = computed(() => store.getters['notification/isDark'])

function close() {
  store.dispatch('notification/close')
}
</script>
