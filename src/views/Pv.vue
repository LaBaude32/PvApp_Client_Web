<template>
  <div>
    <v-container class="pt-0">
      <v-row>
        <v-col class="d-flex justify-center align-center">
          <v-btn @click="returnToAffair">Revenir à l'affaire</v-btn>
        </v-col>
        <v-col class="d-flex">
          <v-col class="d-flex flex-column ga-2" align-self="center">
            <v-btn @click.prevent="modifyProgress">
              <v-icon icon="mdi-clock-edit-outline" class="mr-2" />
              Avancement
              {{ pvDetails.affairMeetingType == 'Chantier' ? 'du chantier' : "de l'étude" }}
              s-1
            </v-btn>
            <v-btn @click.prevent="modifyAgenda">
              <v-icon icon="mdi-calendar-edit " class="mr-2" />
              Ordre du jour
            </v-btn>
            <v-btn @click.prevent="modifySchedule">
              <v-icon icon="mdi-calendar-plus" class="mr-2" />
              Prévisionnel
            </v-btn>
          </v-col>
          <v-col class="d-flex flex-column ga-2">
            <v-btn class="ml-5" color="tertiaryContainer" @click.prevent="downloadPDF">
              <v-icon icon="mdi-file-download" class="mr-2" />
              PDF provisoire
            </v-btn>
            <v-btn class="ml-5" color="primaryContainer" @click="ModalValidationDialog = true">
              <v-icon icon="mdi-check-all" class="mr-2" />
              Finaliser et diffuser le PV
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="mb-10"></v-divider>
    <Items v-if="meetingType" :pvDetails="pvDetails" />
    <v-skeleton-loader v-else class="mx-auto" max-width="1000" type="table"></v-skeleton-loader>

    <v-divider class="my-10"></v-divider>

    <Participants />

    <ModalValidation v-model:dialog="ModalValidationDialog" :validate="pvValidation" />

    <v-dialog v-model="progressDialog" persistent max-width="80%">
      <ModifyProgress
        v-model:progresses="pvDetails.progresses"
        :lots="pvDetails.lots"
        :is-chantier="pvDetails.affairMeetingType == 'Chantier'"
        :pvId="pvId"
        @close-progresses-dialog="progressDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="agendaDialog" persistent max-width="80%">
      <ModifyAgenda
        v-model:agendas="pvDetails.agendas"
        :pvId="pvId"
        @close-agenda-dialog="agendaDialog = false"
      />
    </v-dialog>

    <v-dialog v-model="scheduleDialog" persistent max-width="80%">
      <ModifySchedule
        @close-schedule-dialog="scheduleDialog = false"
        v-model:schedules="pvDetails.schedules"
        :is-chantier="pvDetails.affairMeetingType == 'Chantier'"
        :lots="pvDetails.lots"
        :pv-id="pvId"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import Items from '@/components/Items.vue'
import ModalValidation from '@/components/ModalValidation.vue'
import ModifyAgenda from '@/components/ModifyAgenda.vue'
import ModifyProgress from '@/components/ModifyProgress.vue'
import ModifySchedule from '@/components/ModifySchedule.vue'
import Participants from '@/components/Participants.vue'
import { getRouteName } from '@/utilities/constantes.ts'
import Axios from 'axios'
import { DateTime, Settings } from 'luxon'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
Settings.defaultLocale = 'fr'

const route = useRoute()
const router = useRouter()

const pvId = ref(Number)
const progressDialog = ref(false)
const agendaDialog = ref(false)
const scheduleDialog = ref(false)
const ModalValidationDialog = ref(false)
const initialLots = ref([])
const meetingType = ref(null)
const pvDetails = ref({})

onMounted(() => {
  getData()
})

async function getData() {
  pvId.value = Number(route.params.id)
  let dt = {
    params: {
      pvId: pvId.value
      // userId: userId.value
    }
  }
  let res = await Axios.get('pvs', dt)
  pvDetails.value = res.data
  meetingType.value = res.data.affairMeetingType //FIXME: pas bon systeme, on devrait pouvoir récuperer directement le pvDetails.meetingType pour le test.
}

function pvValidation() {
  Axios.put('pvs/pvId/validation', { pvId: pvId.value })
    .then((response) => {
      if (response.status == 204) {
        router.push({ name: getRouteName('finishedPv'), params: { id: pvId.value } })
        ModalValidationDialog.value = false
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function returnToAffair() {
  router.push({ name: getRouteName('affair'), params: { id: pvDetails.value.affairId } })
}

async function downloadPDF() {
  const res = await new Axios({
    responseType: 'blob',
    url: 'pvs/pvId/released/pdf',
    params: {
      pvId: pvDetails.value.pvId
    }
  })
  const meetingDate = DateTime.fromSQL(pvDetails.value.meetingDate).toISODate()
  const fileName = `${meetingDate}_Affaire ${pvDetails.value.affairName}_Pv-n${pvDetails.value.pvNumber}`
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}.pdf`)
  document.body.appendChild(link)
  link.click()
}

function modifyProgress() {
  initialLots.value = JSON.parse(JSON.stringify(pvDetails.value.lots))
  progressDialog.value = true
}

function modifyAgenda() {
  agendaDialog.value = true
}

function modifySchedule() {
  scheduleDialog.value = true
}
</script>
