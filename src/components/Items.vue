<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table
        :headers="headers"
        :items="items"
        :sort-by="[{ key: 'position', order: 'desc' }]"
        :search="search"
        items-per-page="-1"
      >
        <template v-slot:top>
          <v-toolbar class="py-3">
            <v-toolbar-title v-if="pvDetails">
              Pv du {{ $filters.formatDate(pvDetails.meetingDate) }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Chercher"
              single-line
              hide-details
            ></v-text-field>
            <v-dialog v-model="dialog" max-width="80%">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="tonal" color="warning" class="mx-4" size="x-large"
                  >Nouvel item</v-btn
                >
              </template>
              <v-card>
                <div v-if="isSavingForm">
                  <SavingLoader></SavingLoader>
                </div>
                <v-form v-else>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="editedItem.position"
                            label="Position"
                            min="1"
                            type="number"
                            :rules="FormRequiredRules"
                          ></v-text-field>
                        </v-col>
                        <v-col
                          cols="12"
                          sm="4"
                          md="4"
                          v-if="pvDetails.affairMeetingType == 'Chantier'"
                        >
                          <v-select
                            v-if="pvDetails.affairMeetingType == 'Chantier' && pvDetails.lots"
                            v-model="editedItem.lotsToReturn"
                            :items="pvDetails.lots"
                            item-title="name"
                            item-value="lotId"
                            label="Lot"
                            chips
                            multiple
                            closable-chips
                          >
                            <template v-slot:chip="{ props, item }">
                              <v-chip
                                v-bind="props"
                                :text="item.name"
                                :value="item.lotId"
                                :color="item.color"
                              ></v-chip>
                            </template>
                          </v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" class="d-flex justify-center">
                          <v-switch
                            v-model="editedItem.visible"
                            label="Visible"
                            :color="editedItem.visible ? 'success' : ''"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea
                            v-model="editedItem.note"
                            label="Note"
                            counter
                            auto-grow
                            filled
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea
                            v-model="editedItem.followUp"
                            label="Suite à donner"
                            counter
                            auto-grow
                            filled
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="editedItem.resources"
                            label="Ressources"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-select
                            clearable
                            v-model="editedItem.completionToReturn"
                            :items="defaultItem.completion"
                            label="Echéance"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field
                            v-model="displayDateFormattedCompletion"
                            label="Date de l'echéance"
                            readonly
                            clearable
                            @click:clear="editedItem.completionDate = null"
                            @click:control="completionDateDialog = true"
                            prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                          <v-dialog v-model="completionDateDialog" width="auto">
                            <v-date-picker
                              title="Selectionner une date"
                              header="Nouvelle date"
                              v-model="editedItem.completionDate"
                            ></v-date-picker>
                          </v-dialog>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field v-model="editedItem.reminder" label="Rappel" clearable />
                        </v-col>
                      </v-row>
                      <v-row class="align-center text-button">
                        <v-col>
                          <v-chip
                            prepend-icon="mdi-check-decagram"
                            color="primary"
                            v-if="editedItem.isAnnotated"
                            >Image annotée</v-chip
                          >
                          <div v-else-if="!editedItem.image || editedItem.isImageChange == true">
                            <v-file-input
                              id="picture"
                              label="Photo"
                              accept="image/*"
                              prepend-icon="mdi-camera"
                              @change="onObjectSelected"
                              hide-details
                            ></v-file-input>
                          </div>
                          <div v-else>
                            <p class="mb-2">
                              <v-icon>mdi-camera</v-icon>
                              Photo :
                              <v-chip
                                class="l-2"
                                prepend-icon="mdi-delete"
                                color="red"
                                @click="removeImage(editedItem)"
                                >Supprimer l'image</v-chip
                              >
                            </p>
                            <v-img
                              v-if="!editedItem.isAnnotated"
                              max-height="300"
                              max-width="700"
                              :src="MyThumbnail(editedItem.image)"
                            ></v-img>
                          </div>
                        </v-col>
                        <v-btn
                          v-if="editedItem.image && !editedItem.isAnnotated"
                          color="primary"
                          prepend-icon="mdi-draw"
                          @click="openAnnotationEditor"
                        >
                          Annoter
                        </v-btn>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" @click="close">Annuler</v-btn>
                    <v-btn color="primary" @click="save">Enregister</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-dialog v-model="annotationDialog" fullscreen>
              <v-card>
                <v-toolbar color="primary">
                  <v-btn icon @click="closeAnnotationEditor">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title>Éditeur d'annotations</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <div v-if="!editedItem.image" class="pa-4">
                    <v-alert type="error">Aucune image sélectionnée</v-alert>
                  </div>
                  <div
                    v-else-if="
                      typeof editedItem.image === 'string' && !MyThumbnail(editedItem.image)
                    "
                    class="pa-4"
                  >
                    <v-alert type="error">URL de l'image invalide</v-alert>
                  </div>
                  <Editor
                    v-else
                    :targetImage="editedItem.image"
                    @save="openConfirmSaveDialog"
                    @close="closeAnnotationEditor"
                  />
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-dialog v-model="confirmSaveDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"> Confirmer l'enregistrement </v-card-title>
                <v-card-text>
                  <v-alert type="warning" class="mb-4">
                    En enregistrant, l'image sera remplacée par la version annotée et les
                    annotations ne pourront plus être modifiées.
                  </v-alert>
                  <p>Voulez-vous continuer ?</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="teriary" variant="text" @click="confirmSaveDialog = false">
                    Annuler
                  </v-btn>
                  <v-btn color="error" variant="text" @click="confirmAndSaveAnnotations">
                    Enregistrer les annotations
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.position="{ item }">
          <v-btn
            icon="mdi-arrow-up-drop-circle-outline"
            variant="plain"
            v-if="items?.indexOf(item) > 1"
            @click="pushUpItem(item)"
          ></v-btn>
          <v-btn
            icon="mdi-arrow-down-drop-circle-outline"
            variant="plain"
            v-if="items?.indexOf(item) > 0 && items?.indexOf(item) < items?.length - 1"
            @click="pushDownItem(item)"
          ></v-btn>
        </template>
        <template v-slot:item.note="{ item }">
          <div style="white-space: pre-wrap">{{ item.note }}</div>
        </template>
        <template v-slot:item.followUp="{ item }">
          <div style="white-space: pre-wrap">{{ item.followUp }}</div>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" :color="lot.color">
            {{ lot.name }}
          </v-chip>
        </template>
        <template v-slot:item.visible="{ item }">
          <v-switch
            v-model="item.visible"
            role="switch"
            @change="changeVisible(item)"
            :color="item.visible ? 'success' : ''"
          ></v-switch>
        </template>
        <template v-slot:item.completionDate="{ item }">
          {{ $filters.formatDateShortDayOnly(item.completionDate) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:item.image="{ item }">
          <v-img
            v-if="item.image"
            max-width="150"
            :src="MyThumbnail(item.image)"
            @click="OpenImage(item.image)"
          ></v-img>
        </template>
        <template v-slot:no-data>
          <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'item pour ce PV</p>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="MyImageDialog" max-width="800px">
      <v-card>
        <v-img contain max-height="750" :src="MyImageSrc"></v-img>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="MyImageDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/store/notification'
import type { Item } from '@/utilities/types.ts'
import Axios from 'axios'
import Compressor from 'compressorjs'
import { computed, onMounted, ref, watch } from 'vue'
import { useDate } from 'vuetify'
import { FormRequiredRules } from '../utilities/constantes.ts'
import { DEFAULT_ITEM, ITEM_HEADERS } from '../utilities/dataConst'
import Editor from './ImageEditor/Editor.vue'
import SavingLoader from './SavingLoader.vue'

const date = useDate()
const notifStore = useNotificationStore()
const imgURL = import.meta.env.VITE_BACKEND_IMAGE_URL

const props = defineProps({
  pvDetails: Object
})

// --- State ---
const items = ref([])
const dialog = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({ ...DEFAULT_ITEM })
const defaultItem = ref({ ...DEFAULT_ITEM })
const isSavingForm = ref(false)
const search = ref()
const MyImageDialog = ref(false)
const MyImageSrc = ref(String)
const completionDateDialog = ref(false)
const annotationDialog = ref(false)
const confirmSaveDialog = ref(false)

// --- Headers dynamiques ---
const headers = computed(() => {
  if (props.pvDetails?.affairMeetingType === 'Chantier') {
    const h = [...ITEM_HEADERS]
    h.splice(1, 0, { title: 'Lot', value: 'lots' })
    return h
  }
  return ITEM_HEADERS
})

// --- Fetch des items ---
onMounted(async () => {
  await fetchItems()
  if (props.pvDetails?.affairMeetingType === 'Chantier' && props.pvDetails?.lots) {
    defaultItem.value.lots = props.pvDetails.lots
  }
})

async function fetchItems() {
  const res = await Axios.get('items', { params: { pvId: props.pvDetails.pvId } })
  items.value = (res.data || []).map((el) => ({
    ...el,
    visible: el.visible == 1 ? true : el.visible
  }))
}

// --- Computed ---
const formTitle = computed(() => (editedIndex.value === -1 ? 'Nouvel item' : "Modifier l'item"))

const maxPosition = computed(() => {
  if (items.value.length === 0) return 1
  return Math.max(...items.value.map((i) => i.position)) + 1
})

const displayDateFormattedCompletion = computed(() => {
  return editedItem.value.completionDate
    ? date.format(editedItem.value.completionDate, 'fullDate')
    : null
})

// --- Watch dialog pour initialiser un nouvel item ---
watch(dialog, (val) => {
  if (editedIndex.value === -1) {
    maxPosition.value > 0
      ? (defaultItem.value.position = maxPosition.value)
      : (defaultItem.value.position = 1)
    editedItem.value = Object.assign({}, defaultItem.value)
  }
  val || close()
})

// --- Actions CRUD ---
function editItem(item) {
  editedItem.value = { ...item }
  editedIndex.value = items.value.findIndex((element) => element.itemId === editedItem.value.itemId)
  editedItem.value.lotsToReturn = item.lots
  props.pvDetails.lots ? (editedItem.value.lots = props.pvDetails.lots) : null
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
    Axios.delete('items/itemId', { params: { itemId: item.itemId, pvId: props.pvDetails.pvId } })
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

async function save() {
  isSavingForm.value = true
  const itemToBeSend = formatItemToBeSend()
  let message
  if (editedIndex.value > -1) {
    const itemUpdated = await updateItem(itemToBeSend)
    itemUpdated.visible == 1 ? (itemUpdated.visible = true) : (itemUpdated.visible = false)
    Object.assign(items.value[editedIndex.value], itemUpdated)
    message = "Mise à jour de l'item effectué"
  } else {
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
          resolve(blob)
        },
        error(err) {
          reject(err)
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
    const res = await Axios.put('items/itemId', itemWithoutImage)
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
  itemToBeSend.pvId = props.pvDetails.pvId
  delete itemToBeSend.isImageChange
  delete itemToBeSend.completionToReturn
  delete itemToBeSend.lotsToReturn
  if (typeof itemToBeSend.image != 'string') {
    delete itemToBeSend.image
    delete itemToBeSend.thumbnail
  }
  if (
    props.pvDetails?.affairMeetingType == 'Chantier' &&
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

function saveOrder() {
  const itemsData = items.value.map((user, index) => ({
    pvId: pvId.value,
    userId: user.userId,
    position: index
  }))
  Axios.put('/items/updatePositions', itemsData)
    .then((response) => {
      if (response.status === 200) {
        items.value = response.data
        sortItemsByPosition()
        notifStore.success("L'ordre des items a bien été sauvegardé")
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la sauvegarde des positions:', error)
      notifStore.error('Erreur lors de la sauvegarde des positions')
    })
}

// --- Image & Annotation ---
function onObjectSelected(event) {
  editedItem.value.image = event.target.files[0]
  editedItem.value.isImageChange = true
}
function MyThumbnail(imageName) {
  return imgURL + imageName
}
function OpenImage(imageName) {
  MyImageSrc.value = imgURL + imageName
  MyImageDialog.value = true
}
function removeImage(item) {
  item.image = null
  item.isImageChange = true
}

function openAnnotationEditor() {
  if (editedItem.value.image) {
    if (editedItem.value.itemId) {
      editedItem.value.image = MyThumbnail(editedItem.value.image)
    }
    annotationDialog.value = true
  }
}

function closeAnnotationEditor() {
  if (window.tempAnnotationData) {
    const confirmClose = confirm(
      'Vous avez des annotations non sauvegardées. Voulez-vous vraiment fermer sans sauvegarder ?'
    )
    if (confirmClose) {
      annotationDialog.value = false
      delete window.tempAnnotationData
    }
  } else {
    annotationDialog.value = false
  }
}

function openConfirmSaveDialog(data) {
  window.tempAnnotationData = data
  confirmSaveDialog.value = true
}

function confirmAndSaveAnnotations() {
  if (window.tempAnnotationData) {
    const data = window.tempAnnotationData
    annotationDialog.value = false
    confirmSaveDialog.value = false

    if (data.state) {
      editedItem.value.annotationState = data.state
    }
    if (data.renderedImage) {
      editedItem.value.image = data.renderedImage
      editedItem.value.isImageChange = true
    }
    if (data.isAnnotated) {
      editedItem.value.isAnnotated = data.isAnnotated
    }
    console.log('Annotations et image rendue sauvegardées:', data)

    delete window.tempAnnotationData
  }
}

// --- Manage position ---

function sortItemsByPosition() {
  if (items.value) {
    items.value.sort((a, b) => (a.position || 0) - (b.position || 0))
  }
}

function pushUpItem(item: Item) {
  const oldIndex = items.value.indexOf(item)
  const movedItem = items.value.splice(items.value?.indexOf(item), 1)[0]
  items.value?.splice(oldIndex - 1, 0, movedItem)
  saveOrder()
}

function pushDownItem(item: Item) {
  const oldIndex = items.value.indexOf(item)
  const movedItem = items.value.splice(items.value?.indexOf(item), 1)[0]
  items.value?.splice(oldIndex + 1, 0, movedItem)
  saveOrder()
}
</script>
