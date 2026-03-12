<template>
  <v-card>
    <v-card-title>Modifier la progression du chantier</v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <VueDraggable v-model="progresses" handle=".handle">
          <div
            v-for="(progress, index) in progresses"
            :key="progress.position"
            class="d-flex align-center bg-blue-lighten-5 rounded mb-2"
          >
            <v-icon icon="mdi-drag" size="x-large" class="handle cursor-move"></v-icon>
            <v-text-field
              v-model="progress.description"
              class="px-5 pt-4"
              variant="underlined"
              :label="`Avancement n°${index + 1}`"
              :rules="FormRequiredRulesMin3"
              clearable
            />
            <v-text-field
              v-model="progress.progress"
              class="px-5 pt-4"
              variant="underlined"
              label="Progression"
              :rules="FormRequiredRulesMin3"
              clearable
            />
            <v-select
              v-if="isChantier && props.lots"
              v-model="progress.lotId"
              :items="props.lots"
              item-title="name"
              item-value="lotId"
              label="Lot"
              variant="underlined"
              clearable
            ></v-select>
            <v-btn
              icon="mdi-delete"
              variant="text"
              @click="deleteProgress(progress.progressId)"
            ></v-btn>
          </div>
        </VueDraggable>
      </v-form>
      <div class="d-flex mt-5">
        <v-btn icon="mdi-plus" color="blue-lighten-5" class="mx-auto" @click="addProgress"></v-btn>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn color="error" variant="text" @click="cancel">Annuler</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid || progresses.length === 0"
        color="success"
        variant="text"
        @click="save"
        >Enregistrer</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store/notification'
import { FormRequiredRulesMin3 } from '@/utilities/constantes'
import type { Lot, Progress } from '@/utilities/types'
import Axios from 'axios'
import { onMounted, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

const notifStore = useNotificationStore()

const emit = defineEmits(['closeProgressesDialog'])

const valid = ref(false)

const props = defineProps<{
  pvId: number
  lots?: Lot[]
  isChantier: boolean
}>()

const progresses = defineModel('progresses', { type: Array<Progress>, default: [] })

onMounted(() => {
  if (progresses.value) {
    progresses.value = progresses.value.sort((a, b) => a.position - b.position)
  }
})

function cancel() {
  emit('closeProgressesDialog')
}

function save() {
  progresses.value!.forEach((progress, index) => {
    progress.position = index
  })
  Axios.put('progresses/progressId', progresses.value).then((res) => {
    if (res.status == 200) {
      progresses.value = res.data.sort((a: Progress, b: Progress) => a.position - b.position)
      notifStore.success('La progession à correctement été mise à jour')
      emit('closeProgressesDialog')
    }
  })
}
function addProgress() {
  if (progresses.value === null || progresses.value.length === 0) {
    progresses.value = [
      {
        progressId: -1,
        position: 0,
        description: '',
        progress: '',
        pvId: props.pvId,
        lotId: null
      }
    ]
  } else {
    progresses.value.push({
      pvId: props.pvId,
      position: progresses.value.length + 1,
      description: '',
      progress: '',
      progressId: -progresses.value.length - 1,
      lotId: null
    })
  }
}

function deleteProgress(progressId: number) {
  const index = progresses.value!.findIndex((element) => element.progressId === progressId)
  if (index !== -1 && progressId < 0) {
    progresses.value!.splice(index, 1)
  }
  if (index !== -1 && progressId >= 0) {
    Axios.delete('progresses/progressId', { params: { progressId: progressId } }).then((res) => {
      progresses.value!.splice(index, 1)
    })
  }
}
</script>
