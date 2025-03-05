<template>
  <v-card>
    <v-card-title>Modifier le prévisionnel</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <VueDraggable v-model="schedule" handle=".handle">
          <div
            v-for="(schedule, index) in schedule"
            :key="schedule.position"
            class="d-flex align-center bg-blue-lighten-5 rounded mb-2"
          >
            <v-icon icon="mdi-menu-swap" size="x-large" class="handle cursor-move"></v-icon>
            <v-text-field
              v-model="schedule.description"
              class="px-5 pt-4"
              variant="underlined"
              :label="`Prévisionnel n°${index + 1}`"
              :rules="FormRequiredRulesMin3"
              clearable
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteSchedule(schedule.scheduleId)"
            ></v-btn>
          </div>
        </VueDraggable>
      </v-form>
      <div class="d-flex mt-5">
        <v-btn icon="mdi-plus" color="blue-lighten-5" class="mx-auto" @click="addSchedule"></v-btn>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" variant="text" @click="cancel">Annuler</v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="!valid" color="success" variant="text" @click="save">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Schedule } from '@/utilities/types'
import { ref } from 'vue'
import { FormRequiredRulesMin3 } from '@/utilities/constantes'

const emit = defineEmits(['closeScheduleDialog'])
const valid = ref(false)

const schedule = defineModel('schedule', { type: Array<Schedule>, default: [] })

function cancel() {
  emit('closeScheduleDialog')
}

function addSchedule() {
  if (!schedule.value) {
    schedule.value = [
      {
        position: 0,
        deadline: '',
        description: ''
      }
    ]
  } else {
    schedule.value.push({
      position: schedule.value.length + 1,
      deadline: '',
      description: ''
      // scheduleId: -schedule.value.length - 1 //TODO:verifier si c'est bon
    })
  }
}
</script>
