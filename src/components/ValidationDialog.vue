<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2">Confirmer l'action</v-card-title>
      <v-card-text>Êtes-vous sûr de vouloir {{actionText}} ?</v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" text @click="dialog = false">Annuler</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="validateAction">Confirmer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">

const dialog = defineModel('dialog', { type: Boolean, default: false })
defineProps({actionText: String})
let validationResult = null;
const emit = defineEmits({
  validation: (validationResult) => {
    return validationResult
  }
})
  

function validateAction() {
  validationResult = true;
  dialog.value = false;
  emit('validation', validationResult);
    }
</script>
