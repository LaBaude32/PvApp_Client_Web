<template>
  <v-card>
    <v-card-title>Modifier le prévisionnel</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <VueDraggable v-model="schedules" handle=".handle">
          <div
            v-for="(schedule, index) in schedules"
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
            <v-text-field
              v-model="schedule.deadline"
              class="px-5 pt-4"
              variant="underlined"
              label="Échéance"
              :rules="FormRequiredRulesMin3"
              clearable
            />
            <v-select
              v-if="isChantier && props.lots"
              v-model="schedule.lotId"
              :items="props.lots"
              item-title="name"
              item-value="lotId"
              label="Lot"
              variant="underlined"
              :rules="FormRequiredRules"
            ></v-select>
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
      <v-btn
        :disabled="!valid || schedules.length === 0"
        color="success"
        variant="text"
        @click="save"
        >Enregistrer</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { FormRequiredRulesMin3, FormRequiredRules } from '@/utilities/constantes'
import type { Lot, Schedule } from '@/utilities/types'
import Axios from 'axios'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['closeScheduleDialog'])

const valid = ref(false)

const props = defineProps<{
  pvId: number
  lots?: Lot[]
  isChantier: boolean
}>()

const schedules = defineModel('schedules', { type: Array<Schedule>, default: [] })

onMounted(() => {
  if (schedules.value) {
    schedules.value = schedules.value.sort((a, b) => a.position - b.position)
  }
})

function cancel() {
  emit('closeScheduleDialog')
}

function save() {
  schedules.value!.forEach((schedule, index) => {
    schedule.position = index
  })
  Axios.put('schedules/scheduleId', schedules.value).then((res) => {
    schedules.value = res.data.sort((a: Schedule, b: Schedule) => a.position - b.position)
    emit('closeScheduleDialog')
  })
}

function addSchedule() {
  if (!schedules.value) {
    schedules.value = [
      {
        scheduleId: -1,
        position: 0,
        description: '',
        deadline: '',
        pvId: props.pvId,
        lotId: null
      }
    ]
  } else {
    schedules.value.push({
      pvId: props.pvId,
      position: schedules.value.length + 1,
      description: '',
      deadline: '',
      scheduleId: -schedules.value.length - 1,
      lotId: null
    })
  }
}

function deleteSchedule(scheduleId: number) {
  const index = schedules.value!.findIndex((element) => element.scheduleId === scheduleId)
  if (index !== -1 && scheduleId < 0) {
    schedules.value!.splice(index, 1)
  }
  if (index !== -1 && scheduleId >= 0) {
    Axios.delete('schedules/scheduleId', { params: { scheduleId: scheduleId } }).then((res) => {
      schedules.value!.splice(index, 1)
    })
  }
}
</script>

<style lang="css" scoped>
.grabbing {
  cursor: move;
  height: 42px;
  width: 42px;
}
</style>
