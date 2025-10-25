<template>
  <div v-if="affair" class="mb-10 text-center">
    <v-dialog v-model="dialog" persistent max-width="80%">
      <ModifyAffair
        v-if="affairDialog"
        v-model:affairDatas="affair"
        :validate="ModifyAffairSave"
        @close-dialog="cancelAffairDialog"
      />
      <ModifyPv
        v-model:isNewPv="isNewPv"
        v-model:pvData="pvData"
        v-if="pvModifyDialog"
        :affairId="affair.affairId"
        @close-dialog="closePvDialog"
      />
      <ModifyLot
        v-if="lotModifyDialog"
        :lotData.sync="lots"
        :addLot="modifyLotsAdd"
        :deleteLot="ModifyLotDelete"
        :numberOfLots="numberOfLots"
        :validate="modifyLotSave"
        :isCancelable="lotModifyCancelable"
        :cancel="ModifyLotCancel"
      />
    </v-dialog>
    <ValidationDialog
      v-model:dialog="ModalValidationDialog"
      @validation="archiveAffair()"
      actionText="archiver l'affaire"
    />
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.name }}</h3>
      <p>Adresse : {{ affair.address }}</p>
      <p>Type d'opération : {{ affair.meetingType }}</p>
      <p v-if="affair.description" class="font-italic">{{ affair.description }}</p>
      <v-row v-if="affair.meetingType == 'Chantier'" align="center" justify="center">
        <v-col v-if="lots" v-for="lot in lots" v-bind:key="lot.id">
          <v-row justify="center">
            <v-chip dense class="mx-5 mt-5" :color="lot.color">
              {{ lot.name }}
            </v-chip>
          </v-row>
        </v-col>
        <p v-else class="font-italic">Il n'y a pas de lots pour cette affaire</p>
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
      <v-data-table
        :headers="headers"
        :items="pvs"
        :search="search"
        :sort-by="[{ key: 'pvNumber', order: 'desc' }]"
      >
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
          <v-btn
            v-if="item.state == 'Terminé'"
            @click="downloadPvPdf(item)"
            color="success"
            small
            class="ma-2"
          >
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
          <v-btn color="success" @click.prevent="ModalValidationDialog = true">
            Archiver l'affaire
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="affair.meetingType == 'Chantier'" color="error" @click.prevent="modifyLot">
            Modifier les lots
          </v-btn>
          <v-btn dark color="error" @click.prevent="((affairDialog = true), (dialog = true))"
            >Modifier l'affaire</v-btn
          >
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script setup>
import ModifyAffair from '@/components/ModifyAffair.vue'
import ModifyLot from '@/components/ModifyLot.vue'
import ModifyPv from '@/components/ModifyPv.vue'
import ValidationDialog from '@/components/ValidationDialog.vue'
import { PV_DATA } from '@/utilities/dataConst.ts'
import Axios from 'axios'
import { DateTime, Settings } from 'luxon'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAffairStore } from '../store/affair'
import { useNotificationStore } from '../store/notification'
import { useUserStore } from '../store/user'
import routesCONST, { getRouteName } from '../utilities/constantes.ts'
Settings.defaultLocale = 'fr'

const userStore = useUserStore()
const notifStore = useNotificationStore()
const affairStore = useAffairStore()
const router = useRouter()
const route = useRoute()

const ModalValidationDialog = ref(false)
const affairDialog = ref(false)
const pvModifyDialog = ref(false)
const lotModifyDialog = ref(false)
const lotModifyCancelable = ref(false)
const pvData = ref({})
const dialog = ref(false)
const affair = ref({})
const lots = ref([])
const numberOfLots = ref(Number)
const oldLots = ref([])
const oldNumberOfLots = ref(Number)
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
  { title: 'État', align: 'center', value: 'state', sortable: true },
  { title: 'Lieu', align: 'center', value: 'meetingPlace', sortable: false },
  { title: 'Prochaine date', align: 'center', value: 'meetingNextDate', sortable: false },
  { title: 'Prochain lieu', align: 'center', value: 'meetingNextPlace', sortable: false },
  { title: 'Action', value: 'actions', align: 'center', sortable: false }
]

onMounted(() => {
  const affairId = route.params.id

  Axios.get('affairs/affairId', {
    params: {
      affairId: affairId
    }
  })
    .then((res) => {
      affair.value = res.data
      affairStore.registerAffair(res.data)
      if (res.data.lots) {
        lots.value = res.data.lots
        if (res.data.meetingType == 'Chantier') {
          affairStore.registerLotOnAffair(res.data.lots)
        } else {
          affairStore.registerAffair(res.data)
        }
      }
    })
    .catch((error) => {
      console.log(error)
      notifStore.error('Une erreur est survenue lors de la récupération des données')
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
    lots.value.push({ name: '', lotId: undefined, affairId: undefined, color: undefined })
    lotModifyCancelable.value = true
  }
  lots.value.forEach((element) => {
    oldLots.value.push({ ...element })
  })
  oldNumberOfLots.value = parseInt(lots.value.length)
  numberOfLots.value = lots.value.length
  dialog.value = true
  lotModifyDialog.value = true
}

function modifyLotSave() {
  lots.value.forEach((element) => {
    if (element.lotId == undefined) {
      // Nouveau lot
      let dataToSend = {
        affairId: route.params.id,
        name: element.name
      }
      Axios.post('lots', dataToSend).then((response) => {
        element.lotId = response.data.lotId
        notifStore.success('Le lot à correctement été créé')
      })
    } else {
      // MAJ
      oldLots.value.forEach((oldEl) => {
        if (element.lotId == oldEl.lotId && element.name != oldEl.name) {
          let dataToSend = {
            name: element.name,
            lotId: element.lotId
          }
          Axios.put('lots/lotId', dataToSend)
            .then((response) => {
              if (response.data.affairId != '') {
                notifStore.success('Le lot à correctement été mis à jour')
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
  numberOfLots.value++
  lots.value.push({ name: '', lotId: undefined, affairId: undefined })
}

function ModifyLotDelete(lot, index) {
  Axios.delete('lots/lotId', { params: { lotId: lot.lotId } })
    .then((response) => {
      if (response.status == 204) {
        numberOfLots.value--
        lots.value.splice(index, 1)
        notifStore.success('Le lot a été correctement supprimé')
      }
    })
    .catch((error) => {
      if (error.response.data.exception[0].code == 23000) {
        notifStore.error(
          'Le lot est lié à des éléments déjà saisis et ne peut donc pas être supprimé'
        )
      } else {
        console.log(error)
      }
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

function ModifyAffairSave() {
  Axios.put('affairs/affairId', affair.value)
    .then((response) => {
      if (response.status == 200) {
        notifStore.success("La progression de l'affaire à correctement été mise à jour")
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
  const meetingDate = DateTime.fromSQL(pv.meetingDate).toISODate()
  const fileName = `${meetingDate}_Affaire ${affair.value.name}_Pv-n${pv.pvNumber}`

  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${fileName}.pdf`)
  document.body.appendChild(link)
  link.click()
}

function createPv() {
  if (pvs.value.length > 0) {
    pvData.value = PV_DATA
    const previousPv = pvs.value.reduce((acc, actuel) => {
      return actuel.pvId > acc.pvId ? actuel : acc
    }, pvs.value[0])
    if (previousPv.meetingNextDate) {
      pvData.value.meetingDate = previousPv.meetingNextDate
    }
    if (previousPv.meetingNextPlace) {
      pvData.value.meetingPlace = previousPv.meetingNextPlace
    }
  }
  isNewPv.value = true
  pvModifyDialog.value = true
  dialog.value = true
}

function closePvDialog(isSaved) {
  const index = pvs.value.findIndex((el) => el.pvId === pvData.value.pvId)
  if (isSaved) {
    Object.assign(pvs.value[index], pvData.value)
  }

  pvData.value = PV_DATA
  dialog.value = false
}

function cancelAffairDialog() {
  dialog.value = false
}

function archiveAffair() {
  Axios.put(`/affairs/archive/affairId`, { affairId: affair.value.affairId }).then(() => {
    router.push({ name: 'Board' })
  })
}
</script>
