<template>
  <v-dialog v-model="dialog" max-width="80%" persistent>
    <ModifyPv v-model="isNewPv" @close-dialog="dialog = false" />
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ModifyPv from '@/components/ModifyPv.vue'

const dialog = ref(false)
const isNewPv = ref(true)

onMounted(() => {
  dialog.value = true
})
</script>
