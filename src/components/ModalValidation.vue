<template>
  <v-dialog v-model="dialog" persistent max-width="350">
    <v-card>
      <v-card-title class="text-h5">Voulez-vous valider le PV ?</v-card-title>
      <v-card-text>
        Si vous validez votre procès verbal, son status passera à "Terminé". Il pourra alors être imprimé, publié et
        partagé.
        <br />
        Vous ne pourrez plus le modifier directement.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">Non</v-btn>
        <v-btn color="green darken-1" text @click="validate">Oui</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  validate: Function
})
const dialog = defineModel('dialog', { type: Boolean, required: true })
</script>
