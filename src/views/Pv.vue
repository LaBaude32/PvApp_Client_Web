<template>
  <div>
    <ModalValidation v-model:dialog="ModalValidationDialog" :validate="pvValidation" />
    <v-container class="pt-0">
      <v-row>
        <v-col class="d-flex justify-center align-center">
          <v-btn @click="returnToAffair">Revenir à l'affaire</v-btn>
        </v-col>
        <v-col class="d-flex">
          <v-col class="d-flex flex-column ga-2" align-self="center">
            <v-btn color="success" @click.prevent="modifyProgress">
              <v-icon icon="mdi-clock-edit-outline" class="mr-2" />
              Avancement
              {{ pvDetails.affairMeetingType == 'Chantier' ? 'du chantier' : "de l'étude" }}
              s-1
            </v-btn>
            <v-btn color="success" @click.prevent="modifyAgenda">
              <v-icon icon="mdi-calendar-edit " class="mr-2" />
              Ordre du jour
            </v-btn>
            <v-btn color="success" @click.prevent="modifySchedule">
              <v-icon icon="mdi-calendar-plus" class="mr-2" />
              Prévisionnel
            </v-btn>
          </v-col>
          <v-col class="d-flex flex-column ga-2">
            <v-btn class="ml-5" color="warning" @click.prevent="downloadPDF">
              <v-icon icon="mdi-file-download" class="mr-2" />
              PDF provisoire
            </v-btn>
            <v-btn class="ml-5" color="primary" @click="ModalValidationDialog = true">
              <v-icon icon="mdi-check-all" class="mr-2" />
              Finaliser et diffuser le PV
            </v-btn>
          </v-col>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="mb-10"></v-divider>
    <Items
      v-if="meetingType"
      v-model:dialog="dialog"
      v-model:items="items"
      v-model:editedIndex="editedIndex"
      v-model:editedItem="editedItem"
      :pvDetails="pvDetails"
      :pvUsers="pvUsers"
      :meetingType="meetingType"
      :headers="headers"
      :formTitle="formTitle"
      :editItem="editItem"
      :deleteItem="deleteItem"
      :close="close"
      :save="save"
      :changeVisible="changeVisible"
      :isSavingForm="isSavingForm"
    />
    <v-skeleton-loader v-else class="mx-auto" max-width="1000" type="table"></v-skeleton-loader>

    <v-divider class="my-10"></v-divider>

    <Users
      v-if="pvUsers"
      v-model:users="pvUsers"
      v-model:allConnectedParticipants="pvConnectedParticipants"
    />

    <v-skeleton-loader v-else class="mx-auto" max-width="1000" type="table"></v-skeleton-loader>

    <v-dialog v-model="progressDialog" persistent max-width="80%">
      <ModifyProgress
        v-model:progresses="progresses"
        :lots="pvDetails.lots"
        :is-chantier="pvDetails.affairMeetingType == 'Chantier'"
        :pvId="pvId"
        @close-progresses-dialog="progressDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="agendaDialog" persistent max-width="80%">
      <ModifyAgenda
        v-model:agendas="agendas"
        :pvId="pvId"
        @close-agenda-dialog="agendaDialog = false"
      />
    </v-dialog>

    <v-dialog v-model="scheduleDialog" persistent max-width="80%">
      <ModifySchedule
        @close-schedule-dialog="scheduleDialog = false"
        v-model:schedules="schedules"
        :is-chantier="pvDetails.affairMeetingType == 'Chantier'"
        :lots="pvDetails.lots"
        :pv-id="pvId"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Items from '@/components/Items.vue'
import Users from '@/components/Users.vue'
import ModalValidation from '@/components/ModalValidation.vue'
import ModifyProgress from '@/components/ModifyProgress.vue'
import ModifyAgenda from '@/components/ModifyAgenda.vue'
import ModifySchedule from '@/components/ModifySchedule.vue'
import Axios from 'axios'
import { getRouteName } from '@/utilities/constantes.ts'
import { useRoute, useRouter } from 'vue-router'
import { DEFAULT_ITEM } from '@/utilities/dataConst.ts'
import { useNotificationStore } from '@/store/notification'
import { useAffairStore } from '@/store/affair'
import { useUserStore } from '@/store/user'
import { useDate } from 'vuetify'
import { DateTime, Settings } from 'luxon'
import Compressor from 'compressorjs'
Settings.defaultLocale = 'fr'

const userStore = useUserStore()
const notifStore = useNotificationStore()
const affairStore = useAffairStore()
const route = useRoute()
const router = useRouter()
const date = useDate()

const pvId = ref(Number)
const dialog = ref(false)
const progressDialog = ref(false)
const agendaDialog = ref(false)
const scheduleDialog = ref(false)
const ModalValidationDialog = ref(false)
const initialLots = ref([])
const meetingType = ref(null)
const pvDetails = ref({})
const pvUsers = ref([])
const pvConnectedParticipants = ref([])
const items = ref([])
const headers = ref([
  {
    title: 'Position',
    align: 'center',
    value: 'position'
  },
  { title: 'Note', value: 'note', sortable: false },
  { title: 'Suite à donner', value: 'followUp', sortable: false },
  { title: 'Ressource', value: 'resources', sortable: false },
  { title: 'Échéance', value: 'completion', sortable: false },
  { title: 'Date d’échéance', value: 'completionDate' },
  { title: 'Rappel', value: 'reminder', sortable: false },
  { title: 'Visible', value: 'visible' },
  { title: 'Photo', value: 'image' },
  { title: 'Actions', value: 'actions', sortable: false }
])
const editedIndex = ref(-1)
const editedItem = ref({
  position: Number,
  lotsToReturn: [],
  lots: [],
  note: '',
  followUp: '',
  resources: '',
  completion: '',
  completionToReturn: null,
  completionDate: '',
  reminder: '',
  image: null,
  visible: '',
  isImageChange: false
})
const agendas = ref([])
const schedules = ref([])
const progresses = ref([])
const defaultItem = ref(DEFAULT_ITEM)

const userId = computed(() => {
  return userStore.user.userId
})
const formTitle = computed(() => (editedIndex === -1 ? 'Nouvel item' : "Modifier l'item"))

onMounted(() => {
  getData()
})

async function getData() {
  pvId.value = Number(route.params.id)
  let dt = {
    params: {
      pvId: pvId.value,
      userId: userId.value
    }
  }
  let res = await Axios.get('pvs/pvId', dt)
  if (res.data.items) {
    items.value = [...res.data.items]
  }
  items.value.forEach((element) => {
    element.visible == 1 ? (element.visible = true) : false
  })
  //FIXME:ici il faut récup les lots avec l'API
  pvDetails.value = res.data.pv
  pvUsers.value = res.data.participants
  pvConnectedParticipants.value = res.data.connectedParticipants
  agendas.value = res.data.pv.agendas
  schedules.value = res.data.pv.schedules
  progresses.value = res.data.pv.progresses
  meetingType.value = res.data.pv.affairMeetingType
  if (meetingType.value == 'Chantier') {
    headers.value.splice(1, 0, { title: 'Lot', value: 'lots' })
    defaultItem.value.lots = pvDetails.value.lots
  }
  affairStore.getAffairById(pvDetails.value.affairId)
}

function editItem(item) {
  editedItem.value = { ...item }
  editedIndex.value = items.value.findIndex((element) => element.itemId === editedItem.value.itemId)
  editedItem.value.lotsToReturn = item.lots
  pvDetails.value.lots ? (editedItem.value.lots = pvDetails.value.lots) : null
  editedItem.value.completionToReturn = item.completion
  editedItem.value.completion = [defaultItem.value.completion]
  editedItem.value.completionDate
    ? (editedItem.value.completionDate = new Date(editedItem.value.completionDate))
    : ''
  editedItem.value.isImageChange = false
  dialog.value = true
}

function deleteItem(item) {
  const index = items.value.indexOf(item)
  confirm('Êtes-vous sûr de vouloir supprimer cet item?') &&
    Axios.delete('items/itemId', { params: { itemId: item.itemId, pvId: pvId.value } })
      .then((response) => {
        if (response.status == 204) {
          notifStore.success("L'item à bien été supprimé")
          items.value.splice(index, 1)
        }
      })
      .catch((error) => {
        notifStore.error(`Erreur : l'item n'a pas été supprimé en base de donnée. ${error}`)
      })
}

function close() {
  dialog.value = false
  editedItem.value = { ...defaultItem.value }
  editedIndex.value = -1
}

const isSavingForm = ref(false)

async function save() {
  isSavingForm.value = true
  const itemToBeSend = formatItemToBeSend()
  let message
  if (editedIndex.value > -1) {
    //EXISTING ITEM
    const itemUpdated = await updateItem(itemToBeSend)
    itemUpdated.visible == 1 ? (itemUpdated.visible = true) : (itemUpdated.visible = false)
    Object.assign(items.value[editedIndex.value], itemUpdated)
    message = "Mise à jour de l'item effectué"
  } else {
    //NEW ITEM
    let item = await postItem(itemToBeSend)
    if (editedItem.value.image) {
      item = await uploadImage(item.itemId)
    }
    item.visible == 1 ? (item.visible = true) : (item.visible = false)
    items.value.push(item)
    message = "Ajout de l'item effectué"
  }
  isSavingForm.value = false
  close()
  editedItem.value = { ...defaultItem.value }
  notifStore.success(message)
}

async function postItem(itemWithoutImage) {
  try {
    const res = await Axios.post('/items', itemWithoutImage)
    return res.data
  } catch (error) {
    throw new Error('Erreur : ' + error)
  }
}

async function uploadImage(itemId) {
  if (!editedItem.value.image) {
    return Promise.reject(new Error("Aucune image n'est sélectionnée"))
  }

  const promisfiedCompressor = (file, quality = 0.7, maxHeight = 1080, maxWidth = 1920) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: quality,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        success(blob) {
          resolve(blob) // Promise succeeded
        },
        error(err) {
          reject(err) // abort the Promise
        }
      })
    })
  }
  try {
    const compressedImage = await promisfiedCompressor(editedItem.value.image)
    const fdImage = new FormData()
    fdImage.append('itemId', itemId)
    fdImage.append('image', compressedImage)
    try {
      const res = await Axios.post('items/uploadImage', fdImage)
      return res.data
    } catch (error) {
      console.log('Upload failed:', error)
    }
  } catch (err) {
    console.error('Compression failed:', err)
  }
}

async function updateItem(itemWithoutImage) {
  try {
    // 1. MAJ l'item
    const res = await Axios.put('items/itemId', itemWithoutImage)
    // 2. si besoin MAJ l'image
    if (editedItem.value.image !== null && editedItem.value.isImageChange === true) {
      const fdImage = new FormData()
      fdImage.append('itemId', editedItem.value.itemId)
      fdImage.append('image', editedItem.value.image)
      const res = await Axios.post('items/updateImage', fdImage)
      return res.data
    }
    return res.data
  } catch (error) {
    throw new Error('Erreur : ' + error)
  }
}

function changeVisible(item) {
  let data = {
    itemId: item.itemId,
    visible: item.visible
  }
  Axios.put('items/itemId/visibility', data)
    .then((response) => {
      if (response.status == 200) {
        notifStore.success("L'item a été mis à jour")
      }
    })
    .catch((error) => {
      console.log(error)
    })
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

function formatItemToBeSend() {
  if (
    editedItem.value.completionDate == '' ||
    editedItem.value.completionDate == 'Invalid date' ||
    editedItem.value.completionDate === null
  ) {
    editedItem.value.completionDate = null
  } else {
    editedItem.value.completionDate = date.toISO(editedItem.value.completionDate)
  }
  editedItem.value.lots = editedItem.value.lotsToReturn
  editedItem.value.completion = editedItem.value.completionToReturn
  let itemToBeSend = { ...editedItem.value }
  itemToBeSend.pvId = pvId.value
  delete itemToBeSend.isImageChange
  delete itemToBeSend.completionToReturn
  delete itemToBeSend.lotsToReturn
  if (typeof itemToBeSend.image != 'string') {
    delete itemToBeSend.image
    delete itemToBeSend.thumbnail
  }
  if (
    meetingType.value == 'Chantier' &&
    itemToBeSend.lots &&
    typeof itemToBeSend.lots[0] == 'object'
  ) {
    let lotTransit = []
    editedItem.value.lotsToReturn.forEach((element) => {
      lotTransit.push(element.lotId)
    })
    itemToBeSend.lots = lotTransit
  }

  return itemToBeSend
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
  // if (pvDetails.value.lots == null) {
  //   pvDetails.value.lots = affairStore.affair.lots
  // }
  initialLots.value = JSON.parse(JSON.stringify(pvDetails.value.lots))
  progressDialog.value = true
}

function modifyAgenda() {
  agendaDialog.value = true
}

function modifySchedule() {
  scheduleDialog.value = true
}
// id
// description - string
// deadline - string
//TODO: la question a se poser (comme pour l'avancement) c'est de savoir le numéro du lot est purement informatif ou si c'est une donnée qu'on pourrait avoir besoin de remonter dans l'autre sens
</script>
