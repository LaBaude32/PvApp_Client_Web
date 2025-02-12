<template>
  <v-card>
    <v-card-title>Modifier l'ordre du jour de la réunion</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <VueDraggable v-model="agendas" handle=".handle">
          <div
            v-for="(agenda, index) in agendas"
            :key="agenda.position"
            class="d-flex align-center bg-blue-lighten-5 rounded mb-2"
          >
            <v-icon icon="mdi-menu-swap" size="x-large" class="handle cursor-move"></v-icon>
            <v-text-field
              v-model="agenda.title"
              class="px-5 pt-4"
              variant="underlined"
              :label="`Ordre du jour n°${index + 1}`"
              :rules="FormRequiredRulesMin3"
              clearable
            />
            <v-btn icon="mdi-delete" variant="text" @click="deleteAgenda(agenda.agendaId)"></v-btn>
          </div>
        </VueDraggable>
      </v-form>
      <div class="d-flex mt-5">
        <v-btn icon="mdi-plus" color="blue-lighten-5" class="mx-auto" @click="addAgenda"></v-btn>
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
import { FormRequiredRulesMin3 } from '@/utilities/constantes'
import type { Agenda } from '@/utilities/types'
import Axios from 'axios'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const emit = defineEmits(['closeAgendaDialog'])

const valid = ref(false)

const props = defineProps<{
  pvId: number
}>()

const agendas = defineModel('agendas', { type: Array<Agenda>, default: [] })

onMounted(() => {
  if (agendas.value) {
    agendas.value = agendas.value.sort((a, b) => a.position - b.position)
  }
})

function cancel() {
  emit('closeAgendaDialog')
}

function save() {
  agendas.value!.forEach((agenda, index) => {
    agenda.position = index
  })
  Axios.put('agendas/agendaId', agendas.value).then((res) => {
    agendas.value = res.data.sort((a: Agenda, b: Agenda) => a.position - b.position)
    emit('closeAgendaDialog')
  })
}

function addAgenda() {
  if (!agendas.value) {
    agendas.value = [
      {
        pvId: props.pvId,
        position: 0,
        title: '',
        agendaId: -1
      }
    ]
  } else {
    agendas.value.push({
      pvId: props.pvId,
      position: agendas.value.length + 1,
      title: '',
      agendaId: -agendas.value.length - 1
    })
  }
}

function deleteAgenda(agendaId: number) {
  const index = agendas.value!.findIndex((element) => element.agendaId === agendaId)
  if (index !== -1 && agendaId < 0) {
    agendas.value!.splice(index, 1)
  }
  if (index !== -1 && agendaId >= 0) {
    Axios.delete('agendas/agendaId', { params: { agendaId: agendaId } }).then((res) => {
      agendas.value!.splice(index, 1)
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
