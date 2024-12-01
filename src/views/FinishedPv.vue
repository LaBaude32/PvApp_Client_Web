<template>
  <div class="mb-10">
    <v-container>
      <v-row class="text-center">
        <v-col>
          <h2 class="text-red">
            La mise en page de cette vue n'est pas à jour. <br />Il est préférable de télécharger le
            PDF
          </h2>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <v-btn color="success" x-large @click.prevent="downloadPdf">Telecharger le PDF</v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <p class="text-uppercase text-h4">Opération :</p>
          <v-divider />
          <p class="mt-2 text-h5">{{ affairInfos.name }}</p>
          <v-divider />
          <p class="mt-2 text-h7">Avancement : {{ affairInfos.progress }}%</p>
          <v-divider />
          <p class="mt-2 text-subtitle-1-1">{{ affairInfos.description }}</p>
          <v-row v-if="maitreDOuvrage">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'ouvrage :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitreDOuvrage }}</p>
            </v-col>
          </v-row>
          <v-row v-if="maitresDOeuvre">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'oeuvre :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitresDOeuvre }}</p>
            </v-col>
          </v-row>
          <v-divider />
          <p class="text-uppercase mt-2 text-h6">
            PV de la réunion de {{ meetingType }} n°{{ pvDetails.pvNumber }} du
            {{ $filters.formatDateWithA(pvDetails.meetingDate) }}
            <span v-if="pvDetails.meetingPlace">, {{ pvDetails.meetingPlace }}</span>
          </p>
          <p v-if="pvDetails.meetingNextDate" class="red--text text-h6">
            Prochaine réunion : le {{ $filters.formatDateWithA(pvDetails.meetingNextDate) }},
            {{ pvDetails.meetingNextPlace }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers
      v-if="meetingType"
      :users="pvUsers"
      :headers="USER_HEADERS"
      :sortBy="[{ key: 'userGroup', order: 'asc' }]"
    />
    <v-container>
      <v-divider class="my-10" />
    </v-container>
    <finishedPvItems
      v-if="meetingType"
      :items="items"
      :headers="itemHeaders"
      :sortBy="[{ key: 'position', order: 'asc' }]"
    />
    <v-container class="text-center">
      <v-divider class="my-10" />
      <div v-if="pvDetails.meetingNextDate">
        <p class="text-uppercase">
          Prochaine réunion : le {{ $filters.formatDateWithA(pvDetails.meetingNextDate) }}
        </p>
        <p class="font-italic body-2">
          Présence vivement souhaitée des intervenants conviés (cf. tableaux). Merci.
        </p>
      </div>
      <p>Fait et diffusé le {{ $filters.formatDateWithA(pvDetails.releaseDate) }}</p>
      <p>{{ owner.firstName }} {{ owner.lastName }}</p>
    </v-container>
  </div>
</template>

<script setup>
import finishedPvItems from '@/components/FinishedPvItems.vue'
import finishedPvUsers from '@/components/FinishedPvUsers.vue'
import Axios from 'axios'
import { DateTime, Settings } from 'luxon'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { USER_HEADERS, ITEM_HEADERS } from '../utilities/dataConst.ts'
Settings.defaultLocale = 'fr'

const route = useRoute()

const itemHeaders = ref(ITEM_HEADERS)
const affairInfos = ref({})
const items = ref([])
const pvDetails = ref({})
const meetingType = ref(undefined)
const pvUsers = ref([])
const owner = ref({})
const maitresDOeuvre = ref('')
const maitreDOuvrage = ref('')

const meetingDate = computed(() => {
  return DateTime.fromSQL(pvDetails.value.meetingDate).toISODate()
})

onMounted(() => {
  getPvData()
})

async function getPvData() {
  let dt = {
    params: {
      pvId: route.params.id
    }
  }
  let res = await Axios.get('pvs/pvId/released', dt)
  if (res.status == 200) {
    if (res.data.items) {
      items.value = [...res.data.items]
    }
  }
  pvDetails.value = res.data.pv
  pvUsers.value = res.data.participants
  meetingType.value = res.data.pv.affairMeetingType
  owner.value = res.data.owner
  if (meetingType.value == 'Chantier') {
    itemHeaders.value.splice(1, 0, { text: 'Lot', value: 'lots' })
    itemHeaders.value.push({ text: 'Photo', value: 'image', sortable: false })
  }
  affairInfos.value = res.data.affair

  pvUsers.value.forEach((element) => {
    if (element.userGroup == "Maîtrise d'oeuvre") {
      if (maitresDOeuvre.value == '') {
        maitresDOeuvre.value = element.organism
      } else {
        maitresDOeuvre.value += ' - ' + element.organism
      }
    }
    if (element.userGroup == "Maîtrise d'ouvrage") {
      if (maitreDOuvrage.value == '') {
        maitreDOuvrage.value = element.organism
      } else {
        maitreDOuvrage.value += ' - ' + element.organism
      }
    }
  })
}

async function downloadPdf() {
  const res = await Axios({
    responseType: 'blob',
    url: 'pvs/pvId/released/pdf',
    params: {
      pvId: route.params.id
    }
  })

  const fileName = `${meetingDate.value}_Affaire ${affairInfos.value.name}_Pv-n${pvDetails.value.pvNumber}`
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}.pdf`)
  document.body.appendChild(link)
  link.click()
}
</script>
