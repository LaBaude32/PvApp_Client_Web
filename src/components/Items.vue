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
            <v-dialog v-model="MyDialog" max-width="80%">
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
                        <v-col cols="12" sm="4" md="4" v-if="meetingType == 'Chantier'">
                          <v-select
                            v-if="pvDetails.affairMeetingType == 'Chantier' && pvDetails.lots"
                            v-model="editedItem.lotsToReturn"
                            :items="pvDetails.lots"
                            item-title="name"
                            item-value="lotId"
                            label="Lot"
                            chips
                            multiple
                            deletable-chips
                          >
                            <template v-slot:chip="{ props, item }">
                              <v-chip
                                v-bind="props"
                                :text="item.raw.name"
                                :value="item.raw.lotId"
                                :color="item.raw.color"
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
                      <v-row class="align-center">
                        <v-col>
                          <div v-if="!editedItem.image || editedItem.isImageChange == true">
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
                            <p>
                              Photo :
                              <v-btn icon @click="removeImage(editedItem)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </p>
                            <v-img
                              max-height="300"
                              max-width="700"
                              :src="MyThumbnail(editedItem.image)"
                            ></v-img>
                          </div>
                        </v-col>
                        <v-btn
                          v-if="editedItem.image"
                          color="primary"
                          @click="openAnnotationEditor"
                        >
                          <v-icon left>mdi-draw</v-icon>
                          Annoter
                        </v-btn>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="teriary" text @click="close">Annuler</v-btn>
                    <v-btn color="primary" text @click="save">Enregister</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>

            <v-dialog v-model="annotationDialog" fullscreen>
              <v-card>
                <v-toolbar dark color="primary">
                  <v-btn icon dark @click="closeAnnotationEditor">
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
                  <v-btn color="teriary" text @click="confirmSaveDialog = false"> Annuler </v-btn>
                  <v-btn color="error" text @click="confirmAndSaveAnnotations">
                    Enregistrer les annotations
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.note="{ item }">
          <div style="white-space: pre-wrap">{{ item.note }}</div>
        </template>
        <template v-slot:item.followUp="{ item }">
          <div style="white-space: pre-wrap">{{ item.followUp }}</div>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" :color="lot.color" dark>
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
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
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

<script setup>
import { ref, watch, computed } from 'vue'
import { useDate } from 'vuetify'
import { DEFAULT_ITEM } from '../utilities/dataConst'
import { FormRequiredRules } from '../utilities/constantes.ts'
import SavingLoader from './SavingLoader.vue'
import Editor from './Editor.vue'

const date = useDate()

const imgURL = import.meta.env.VITE_BACKEND_IMAGE_URL

const annotationDialog = ref(false)
const confirmSaveDialog = ref(false)

defineProps({
  pvUsers: Array,
  pvDetails: Object,
  meetingType: String,
  headers: Array,
  formTitle: String,
  editItem: Function,
  deleteItem: Function,
  close: Function,
  save: Function,
  changeVisible: Function,
  isSavingForm: Boolean
})
const dialog = defineModel('dialog', { type: Boolean, required: true, default: false })
const items = defineModel('items', { type: Array, required: true })
const editedIndex = defineModel('editedIndex', { type: Number, required: true })
const editedItem = defineModel('editedItem', { type: Object, required: true })

const search = ref()
// const objectThumbnailFile = ref(null)
const MyImageDialog = ref(false)
const MyImageSrc = ref(String)
const defaultItem = ref(DEFAULT_ITEM)

const completionDateDialog = ref(false)

const MyDialog = computed({
  get() {
    return dialog.value
  },
  set(val) {
    dialog.value = val
  }
})

watch(MyDialog, (val) => {
  if (editedIndex.value === -1) {
    maxPosition.value > 0
      ? (defaultItem.value.position = maxPosition.value)
      : (defaultItem.value.position = 1)
    editedItem.value = Object.assign({}, defaultItem.value)
  }
  val || close()
})

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

function handleEditorClose() {
  annotationDialog.value = false
}

function closeAnnotationEditor() {
  // Vérifier si des annotations ont été faites
  if (window.tempAnnotationData) {
    // Demander confirmation avant de fermer sans sauvegarder
    const confirmClose = confirm(
      'Vous avez des annotations non sauvegardées. Voulez-vous vraiment fermer sans sauvegarder ?'
    )
    if (confirmClose) {
      annotationDialog.value = false
      // Nettoyer les données temporaires
      delete window.tempAnnotationData
    }
  } else {
    annotationDialog.value = false
  }
}

function openConfirmSaveDialog(data) {
  // Stocker temporairement les données pour utilisation après confirmation
  window.tempAnnotationData = data
  confirmSaveDialog.value = true
}

function confirmAndSaveAnnotations() {
  if (window.tempAnnotationData) {
    const data = window.tempAnnotationData
    annotationDialog.value = false
    confirmSaveDialog.value = false

    // Stocker l'état des annotations et l'image rendue
    if (data.state) {
      editedItem.value.annotationState = data.state
    }
    if (data.renderedImage) {
      editedItem.value.image = data.renderedImage
      editedItem.value.isImageChange = true
    }
    console.log('Annotations et image rendue sauvegardées:', data)

    // Nettoyer les données temporaires
    delete window.tempAnnotationData
  }
}

const maxPosition = computed(() => {
  return Math.max(...items.value.map((items) => items.position)) + 1
})

const displayDateFormattedCompletion = computed(() => {
  return editedItem.value.completionDate
    ? date.format(editedItem.value.completionDate, 'fullDate')
    : null
})
</script>
