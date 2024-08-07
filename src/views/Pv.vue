<template>
  <div>
    <ModalValidation v-model:dialog="ModalValidationDialog" :validate="pvValidation" />
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn @click="returnToAffair">Revenir à l'affaire</v-btn>
          <v-btn color="primary" @click="ModalValidationDialog = true">Finaliser et diffuser le PV</v-btn>
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
      :standardRequirement="standardRequirement"
      :formTitle="formTitle"
      :editItem="editItem"
      :deleteItem="deleteItem"
      :close="close"
      :save="save"
      :changeVisible="changeVisible"
    />
    <v-skeleton-loader v-else class="mx-auto" max-width="1000" type="table"></v-skeleton-loader>

    <v-divider class="my-10"></v-divider>

    <Users v-if="pvUsers" v-model:users="pvUsers" :allConnectedParticipants="pvConnectedParticipants" />

    <v-skeleton-loader v-else class="mx-auto" max-width="1000" type="table"></v-skeleton-loader>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Items from '@/components/Items.vue'
import Users from '@/components/Users.vue'
import ModalValidation from '@/components/ModalValidation.vue'
import Axios from 'axios'
import { getRouteName } from '../utilities/constantes'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

const store = useStore()
const route = useRoute()
const router = useRouter()

const pvId = ref(Number)
const dialog = ref(false)
const ModalValidationDialog = ref(false)
const meetingType = ref(null)
const standardRequirement = [(v) => !!v || 'Requis']
const pvDetails = ref(Object)
const pvUsers = ref(Array)
const pvConnectedParticipants = ref(Array)
const items = ref(Array)
const newImage = ref('')
const headers = ref([
  {
    title: 'Position',
    align: 'center',
    value: 'position'
  },
  { title: 'Note', value: 'note', sortable: false },
  { title: 'Suite à donner', value: 'followUp', sortable: false },
  { title: 'Ressource', value: 'resources', sortable: false },
  { title: 'Echeance', value: 'completion', sortable: false },
  { title: "Date d'echéance", value: 'completionDate' },
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
  completionDateDate: '',
  completionDateTime: '',
  image: null,
  visible: '',
  isNewImage: false
})
const defaultItem = ref({
  position: Number,
  lotsToReturn: [],
  lots: [],
  note: null,
  followUp: null,
  resources: null,
  completion: ['A faire', 'Urgent', 'Fait'],
  completionDate: '',
  completionDateDate: '',
  completionDateTime: '',
  image: null,
  visible: true,
  isNewImage: false
})

const userId = computed(() => store.getters['user/userId'])
const formTitle = computed(() => (editedIndex === -1 ? 'Nouvel item' : "Modifier l'item"))

onMounted(() => {
  getData()
})

async function getData() {
  pvId = route.params.id
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
  pvDetails.value = res.data.pv
  pvUsers.value = res.data.users
  pvConnectedParticipants.value = res.data.connectedParticipants
  meetingType.value = res.data.pv.affairMeetingType
  if (meetingType.value == 'Chantier') {
    headers.value.splice(1, 0, { text: 'Lot', value: 'lots' })
    // headers.splice(1, 0, { text: 'Lot', value: 'lots' })
    defaultItem.value.lots = pvDetails.lots
  }
  store.dispatch('affair/loadAffairByPv', pvDetails.value.affairId)
}

function editItem(item) {
  editedIndex.value = items.value.indexOf(item)
  editedItem.value = { ...item }
  editedItem.value.lotsToReturn = item.lots
  pvDetails.value.lots ? (editedItem.lots = pvDetails.lots) : (editedItem = undefined)
  editedItem.value.completionToReturn = item.completion
  editedItem.value.completion = [item.completion]
  editedItem.value.completion.push(...defaultItem.completion)
  item.image ? (editedItem.value.isNewImage = false) : (editedItem.value.isNewImage = true)

  dialog = true
}

function deleteItem(item) {
  const index = items.value.indexOf(item)
  confirm('Etes-vous sûr de vouloir supprimer cet item?') &&
    Axios.delete('items/itemId', { params: { itemId: item.itemId, pvId: pvId } })
      .then((response) => {
        if (response.status == 204) {
          store.dispatch('notification/success', "L'item à bien été supprimé")
          items.value.splice(index, 1)
        }
      })
      .catch((error) => {
        store.dispatch('notification/error', `Erreur : l'item n'a pas été supprimé en base de donnée. ${error}`)
      })
}

function close() {
  dialog = false
  editedItem = { ...defaultItem }
  editedIndex = -1
}

function save() {
  editedItem.lots = editedItem.lotsToReturn
  if (editedItem.completionDate == '' || editedItem.completionDate == 'Invalid date') {
    editedItem.completionDate = null
  }

  const fd = new FormData()
  fd.append('position', editedItem.position)
  fd.append('note', editedItem.note)
  fd.append('followUp', editedItem.followUp)
  fd.append('resources', editedItem.resources)
  fd.append('completion', editedItem.completionToReturn)
  fd.append('completionDate', editedItem.completionDate)
  fd.append('image', editedItem.image)
  fd.append('thumbnail', null)
  fd.append('visible', editedItem.visible)
  fd.append('lots', null)
  fd.append('pvId', pvId)

  if (meetingType == 'Chantier' && editedItem.lotsToReturn) {
    let lotTransit = []
    editedItem.lotsToReturn.forEach((element) => {
      lotTransit.push(element.lotId)
    })
    fd.set('lots', lotTransit)
  }

  if (editedIndex > -1) {
    //EXISTING ITEM
    fd.append('itemId', editedItem.itemId)
    if (editedItem.image != null && editedItem.isNewImage == true) {
      updateItem(fd)
    }
  } else {
    //NEW ITEM
    postItem(fd)
  }
  editedItem = { ...defaultItem }
}

function postItem(fd) {
  Axios.post('/items', fd)
    .then((response) => {
      if (response.status == 201) {
        items.push(response.data)
        close()
        $store.dispatch('notification/success', "Ajout de l'item effectué")
      } else {
        console.log(response)
        console.log(typeof response.data.itemId)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

async function updateItem(fd) {
  //Upload new image
  if (editedItem.image != null && editedItem.isNewImage == true) {
    const fdImage = new FormData()
    fdImage.append('itemId', editedItem.itemId)
    fdImage.append('image', editedItem.image)
    const res = await Axios.post('items/updateImage', fdImage)
    fd.set('image', res.data.image)
  }

  let data = {}
  fd.forEach((value, key) => (data[key] = value))
  for (const iterator in data) {
    if (data[iterator] == 'null') {
      data[iterator] = null
    }
  }

  Axios.put('items/itemId', data)
    .then((response) => {
      if (response.status == 200) {
        editedItem.completion = editedItem.completionToReturn
        Object.assign(items[editedIndex], data)
        editedItem.completion = []
        close()
        $store.dispatch('notification/success', "Mise à jour de l'item effectué")
      } else {
        console.log(response)
        console.log(typeof response.data.itemId)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function changeVisible(item) {
  let data = {
    itemId: item.itemId,
    visible: item.visible
  }
  Axios.put('items/itemId/visibility', data)
    .then((response) => {
      if (response.status == 200) {
        $store.dispatch('notification/success', "L'item a été mis à jour")
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function pvValidation() {
  Axios.put('pvs/pvId/validation', { pvId: pvId })
    .then((response) => {
      if (response.status == 204) {
        router.push({ name: getRouteName('finishedPv'), params: { id: pvId } })
        ModalValidationDialog = false
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
function returnToAffair() {
  router.push({ name: getRouteName('affair'), params: { id: pvDetails.affairId } })
}
</script>
