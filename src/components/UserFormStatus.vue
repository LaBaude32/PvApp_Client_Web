<template>
  <v-col cols="12">
    <h3>Statuts :</h3>
  </v-col>
  <v-col cols="12">
    <v-select
      v-model="editedItem.statusPAE"
      :items="PARTICIPANT_STATUS_PAE"
      label="Statuts"
      clearable
    ></v-select>
  </v-col>
  <v-row justify="space-around">
    <v-checkbox
      v-model="editedItem.invitedCurrentMeeting"
      label="Convié à la réunion"
      :color="editedItem.invitedCurrentMeeting ? 'success' : ''"
    />
    <v-checkbox
      v-model="editedItem.invitedNextMeeting"
      label="Convié à la prochaine réunion"
      :color="editedItem.invitedNextMeeting ? 'success' : ''"
    />
    <v-checkbox
      v-model="editedItem.distribution"
      label="Diffusion"
      :color="editedItem.distribution ? 'success' : ''"
    />
  </v-row>
</template>

<script setup lang="ts">
import { PARTICIPANT_STATUS_PAE } from '@/utilities/dataConst'

const editedItem = defineModel('editedItem', { type: Object, required: true })
</script>
