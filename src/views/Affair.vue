<template>
  <div v-if="affair" class="mb-10 text-center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <ModifyProgress
        v-if="progressDialog"
        v-model:progressValue="affair.progress"
        :modifyProgressSave="modifyProgressSave"
      />
      <ModifyAffair
        v-if="affairDialog"
        v-model:affairDatas="affair"
        :validate="ModifyAffairSave"
        :enableVider="enableVider"
      />
      <!-- <ModifyPv
        v-if="pvModifyDialog"
        v-model:data="pvData"
        v-model:meetingDateDate="meetingDateDate"
        v-model:meetingDateTime="meetingDateTime"
        v-model:meetingNextDateDate="meetingNextDateDate"
        v-model:meetingNextDateTime="meetingNextDateTime"
        v-model:isFormValid="isFormValid"
        :affairs="affairsForPv"
        :modifyingType="pvModifyingType"
        :validate="pvModifySave"
        :cancel="cancelPvModify"
      /> -->
      <TestModifyPv
        v-model:isNewPv="isNewPv"
        v-model:pvData="pvData"
        v-if="pvModifyDialog"
        :affairId="affair.affairId"
        @close-dialog="dialog = false"
      />

      <ModifyLot
        v-if="lotModifyDialog"
        :lotData.sync="lots"
        :addLot="modifyLotsAdd"
        :deleteLot="ModifyLotDelete"
        :numberLots="numberLots"
        :validate="modifyLotSave"
        :isCancelable="lotModifyCancelable"
        :cancel="ModifyLotCancel"
      />
    </v-dialog>
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.name }}</h3>
      <p>Adresse : {{ affair.address }}</p>
      <p>Phase : {{ affair.meetingType }}</p>
      <p v-if="affair.description" class="font-italic">{{ affair.description }}</p>
      <p>Progression :</p>
      <div class="text-center">
        <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">
          {{ affair.progress }} %
        </v-progress-circular>
      </div>
      <v-row>
        <v-col cols="12" v-if="affair.meetingType == 'Chantier'">
          <h3 class="mt-5">Lots :</h3>
          <div v-if="lots">
            <v-chip v-for="lot in lots" v-bind:key="lot.id" dense class="mx-5 mt-5" color="primary">
              {{ lot.name }}
            </v-chip>
          </div>
          <p v-else class="font-italic">Il n'y a pas de lots pour cette affaire</p>
          <!-- TODO:ajouter un bouton pour ajouter des lots ici -->
        </v-col>
      </v-row>
    </v-container>

    <v-card max-width="80%" class="mx-auto">
      <v-card-title class="d-flex align-center pe-2">
        Les procès verbaux :
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          label="Recherche"
          single-line
          hide-details
        ></v-text-field>
        <v-btn dark color="primary" class="ml-5" @click.prevent="createPv">Ajouter un pv</v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="pvs" :search="search" :sort-by="[{ key: 'pvNumber', order: 'desc' }]">
        <template v-slot:item.meetingDate="{ item }">
          <div>{{ $filters.formatDateWithA(item.meetingDate) }}</div>
        </template>
        <template v-slot:item.meetingNextDate="{ item }">
          <div>{{ $filters.formatDateWithA(item.meetingNextDate) }}</div>
        </template>
        <template v-slot:item.state="{ item }">
          <v-chip class="ma-2" color="success" text-color="white" v-if="item.state == 'Terminé'">
            {{ item.state }}
          </v-chip>
          <v-chip class="ma-2" color="orange" text-color="white" v-else>
            {{ item.state }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn v-if="item.state == 'Terminé'" @click="openFinishedPv(item)" small color="primary">
            <v-icon class="ma-2">{{ 'mdi-eye' }}</v-icon>
          </v-btn>
          <v-btn v-else @click="openInProgressPv(item)" small color="warning">
            <v-icon class="ma-2">{{ 'mdi-file-edit' }}</v-icon>
          </v-btn>
          <v-btn v-if="item.state == 'Terminé'" @click="downloadPvPdf(item)" color="success" small class="ma-2">
            <v-icon dark class="ma-2">{{ 'mdi-file-download' }}</v-icon>
          </v-btn>
          <v-btn v-else @click="modifyPv(item)" color="error" small class="ma-2">
            <v-icon dark class="ma-2">{{ 'mdi-information' }}</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card max-width="80%" class="mx-auto mt-10">
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="error" @click.prevent="modifyProgress">Modifier la progression</v-btn>
          <v-btn v-if="affair.meetingType == 'Chantier'" color="error" @click.prevent="modifyLot">
            Modifier les lots
          </v-btn>
          <v-btn dark color="error" @click.prevent="modifyAffair">Modifier l'affaire</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script setup>
import Axios from 'axios'
import routesCONST, { getRouteName } from '../utilities/constantes'
import ModifyProgress from '@/components/ModifyProgress.vue'
import ModifyAffair from '@/components/ModifyAffair.vue'
import ModifyPv from '@/components/ModifyPv.vue'
import TestModifyPv from '../components/TestModifyPv.vue'
import ModifyLot from '@/components/ModifyLot.vue'
import { DateTime, Settings } from 'luxon'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
Settings.defaultLocale = 'fr'

const store = useStore()
const router = useRouter()
const route = useRoute()

const progressDialog = ref(false)
const affairDialog = ref(false)
const pvModifyDialog = ref(false)
const lotModifyDialog = ref(false)
const pvModifyingType = ref(true)
const lotModifyCancelable = ref(false)
const pvData = ref({})
const dialog = ref(false)
const enableVider = ref(false)
const affair = ref({})
const affairsForPv = ref([])
const lots = ref([])
const numberLots = ref(Number)
const oldLots = ref([])
const oldNumberLots = ref(Number)
const search = ref('')
const pvs = ref([])
const isNewPv = ref(true)
const headers = [
  { title: 'Numéro', align: 'center', value: 'pvNumber' },
  {
    title: 'Date',
    align: 'center',
    value: 'meetingDate',
    sortable: false
  },
  { title: 'Etat', align: 'center', value: 'state', sortable: true },
  { title: 'Lieu', align: 'center', value: 'meetingPlace', sortable: false },
  { title: 'Prochaine date', align: 'center', value: 'meetingNextDate', sortable: false },
  { title: 'Prochain lieu', align: 'center', value: 'meetingNextPlace', sortable: false },
  { title: 'Action', value: 'actions', align: 'center', sortable: false }
]
const userId = computed(() => {
  return store.getters['user/userId']
})
// const meetingDateDate = computed({
//   get() {
//     return pvData.value.meetingDate.substr(0, 10)
//   },
//   set(val) {
//     pvData.value.meetingDate = val + ' ' + pvData.value.meetingDateTime
//     pvData.value.meetingDateDate = val
//   }
// })
// const meetingDateTime = computed({
//   get() {
//     return pvData.value.meetingDate.substr(11, 5)
//   },
//   set(val) {
//     pvData.value.meetingDate = pvData.value.meetingDateDate + ' ' + val
//     pvData.value.meetingDateTime = val
//   }
// })
// const meetingNextDateDate = computed({
//   get() {
//     return pvData.value.meetingNextDate.substr(0, 10)
//   },
//   set(val) {
//     pvData.value.meetingNextDateTime
//       ? (pvData.value.meetingNextDate = val + ' ' + pvData.value.meetingNextDateTime)
//       : (pvData.value.meetingNextDate = val)
//     pvData.value.meetingNextDateDate = val
//   }
// })
// const meetingNextDateTime = computed({
//   get() {
//     return pvData.value.meetingNextDate.substr(11, 5)
//   },
//   set(val) {
//     pvData.value.meetingNextDate = pvData.value.meetingNextDateDate + ' ' + val
//     pvData.value.meetingNextDateTime = val
//   }
// })

onMounted(() => {
  const affairId = route.params.id
  Axios.get('affairs/affairId', {
    params: {
      affairId: affairId
    }
  })
    .then((response) => {
      affair.value = response.data.affairInfos
      lots.value = response.data.lots
    })
    .catch((error) => {
      console.log(error)
    })

  Axios.get('pvs/affairId', {
    params: {
      affairId: affairId
    }
  })
    .then((response) => {
      pvs.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })
})

function openInProgressPv(pv) {
  const pvId = pv.pvId
  router.push({
    name: routesCONST.pv.name,
    params: { id: pvId }
  })
}

function openFinishedPv(pv) {
  const pvId = pv.pvId
  router.push({ name: getRouteName('finishedPv'), params: { id: pvId } })
}

function modifyLot() {
  if (lots.value == undefined) {
    lots.value = []
    lots.value.push({ name: '', lotId: undefined, affairId: undefined })
    lotModifyCancelable.value = true
  }
  lots.value.forEach((element) => {
    oldLots.value.push({ ...element })
  })
  oldNumberLots.value = parseInt(lots.value.length)
  numberLots.value = lots.value.length
  dialog.value = true
  lotModifyDialog.value = true
}

function modifyLotSave() {
  lots.value.forEach((element) => {
    if (element.lotId == undefined) {
      let dataToSend = {
        affairId: route.params.id,
        name: element.name
      }
      Axios.post('lots', dataToSend).then((response) => {
        element.lotId = response.data.lotId
      })
    } else {
      oldLots.value.forEach((oldEl) => {
        if (element.lotId == oldEl.lotId && element.name != oldEl.name) {
          let dataToSend = {
            name: element.name,
            lotId: element.lotId
          }
          Axios.put('lots', dataToSend)
            .then((response) => {
              console.log(response)

              if (response.data.affairId != '') {
                store.dispatch('notification/success', "La progession de l'affaire à correctement été mise à jour")
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
    }
  })
  lotModifyCancelable.value = false
  dialog.value = false
  lotModifyDialog.value = false
}

function modifyLotsAdd() {
  numberLots.value++
  lots.value.push({ name: '', lotId: undefined, affairId: undefined })
}

function ModifyLotDelete(lot, index) {
  Axios.delete('lots/lotId', { params: { lotId: lot.lotId } })
    .then((response) => {
      if (response.data == 'success') {
        numberLots.value--
        lots.value.splice(index, 1)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function ModifyLotCancel() {
  lotModifyCancelable.value = false
  dialog.value = false
  lotModifyDialog.value = false
  lots.value.forEach((element) => {
    if (element.name == '') {
      lots.value = undefined
    }
  })
}

function modifyProgress() {
  dialog.value = true
  progressDialog.value = true
}

function modifyProgressSave() {
  let data = {
    ...affair.value
  }
  Axios.put('affairs/affairId', data)
    .then((response) => {
      if (response.status == 200) {
        store.dispatch('notification/success', "La progession de l'affaire à correctement été mise à jour")
      }
    })
    .catch((error) => {
      console.log(error)
    })
  progressDialog.value = false
  dialog.value = false
}

function modifyAffair() {
  dialog.value = true
  affairDialog.value = true
}

function ModifyAffairSave() {
  Axios.put('affairs/affairId', affair.value)
    .then((response) => {
      if (response.status == 200) {
        store.dispatch('notification/success', "La progession de l'affaire à correctement été mise à jour")
      }
    })
    .catch((error) => {
      console.log(error)
    })
  dialog.value = false
  affairDialog.value = false
}

function modifyPv(pvDatas) {
  // pvModifyingType.value = true
  isNewPv.value = false
  pvData.value = pvDatas

  dialog.value = true
  pvModifyDialog.value = true
}

async function downloadPvPdf(pv) {
  const res = await Axios({
    responseType: 'blob',
    url: 'pvs/pvId/released/pdf',
    params: {
      pvId: pv.pvId
    }
  })
  const releaseDate = DateTime.fromSQL(pv.releaseDate).toISODate()
  const fileName = `${releaseDate}_Affaire-${affair.value.name}_Pv-n${pv.pvNumber}`

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}.pdf`)
  document.body.appendChild(link)
  link.click()
}

function createPv() {
  pvModifyDialog.value = true
  dialog.value = true
}

function pvModifySave() {
  let data = {
    pvId: pvData.value.pvId,
    meetingDate: pvData.value.meetingDateDate + ' ' + pvData.value.meetingDateTime + ':00',
    meetingPlace: pvData.value.meetingPlace,
    meetingNextPlace: pvData.value.meetingNextPlace,
    state: pvData.value.state,
    affairId: route.params.id,
    userId: userId.value
  }
  if (pvData.value.meetingNextDate != '') {
    data = { meetingNextDate: pvData.value.meetingNextDate + ':00', ...data }
  }
  let apiRoute
  let apiMethode
  pvModifyingType.value ? ((apiRoute = 'pvs/pvId'), (apiMethode = 'put')) : ((apiRoute = '/pvs'), (apiMethode = 'post'))
  Axios({ method: apiMethode, url: apiRoute, data: data })
    .then((response) => {
      if (response.status == 200 || response.status == 201) {
        dialog.value = false
        pvModifyDialog.value = false
        if (!pvModifyingType.value) {
          // pvData.pvId = response.data.pv.pvId;
          // pvData.pvNumber = response.data.pv.pvNumber;
          pvs.value.push(response.data)
        }
        store.dispatch('notification/success', 'Pv correctement enregistré')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>
