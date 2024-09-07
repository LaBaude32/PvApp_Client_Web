<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="items" :sort-by="[{ key: 'position', order: 'desc' }]" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="pvDetails">Pv du {{ $filters.formatDate(pvDetails.meetingDate) }}</v-toolbar-title>
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
                <v-btn v-bind="props" color="primary" dark class="mb-2">Nouvel item</v-btn>
              </template>
              <v-card>
                <v-form>
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
                            v-if="pvDetails.affairMeetingType == 'Chantier'"
                            v-model="editedItem.lotsToReturn"
                            :items="pvDetails.lots"
                            item-title="name"
                            item-value="lotId"
                            label="Lot"
                            chips
                            multiple
                            deletable-chips
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-switch
                            v-model="editedItem.visible"
                            label="Visible"
                            :color="editedItem.visible ? 'success' : ''"
                          ></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea v-model="editedItem.note" label="Note" counter auto-grow filled></v-textarea>
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
                          <v-text-field v-model="editedItem.resources" label="Ressources"></v-text-field>
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
                          <!-- <v-text-field
                            v-bind="props"
                            id="date-picker-activator"
                            :value="computedDateFormattedCompletion"
                            label="Date de l'echéance"
                            readonly
                            clearable
                            @click:clear="formatedCompletionDate = null"
                            prepend-inner-icon="mdi-calendar"
                          ></v-text-field>
                          <v-menu v-model="ItemModelDatePicker" :close-on-content-click="false" max-width="290">
                            <template v-slot:activator="{ props }"></template>
                            <v-date-picker
                              v-model="formatedCompletionDate"
                              @change="ItemModelDatePicker = false"
                              locale="fr-fr"
                              show-current
                            ></v-date-picker>
                          </v-menu> -->
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-text-field
                                v-bind="props"
                                v-model="displayDateFormattedCompletion"
                                label="Date de l'echéance"
                                readonly
                                clearable
                                @click:clear="editedItem.completionDate = null"
                                prepend-inner-icon="mdi-calendar"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              title="Selectionner une date"
                              header="Nouvelle date"
                              v-model="editedItem.completionDate"
                            ></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <div v-if="editedItem.image == null || editedItem.isImageChange == true">
                            <v-file-input
                              id="picture"
                              label="Photo"
                              accept="image/*"
                              prepend-icon="mdi-camera"
                              @change="onObjectSelected"
                            ></v-file-input>
                          </div>
                          <div v-else>
                            <p>
                              Photo :
                              <v-btn icon @click="removeImage(editedItem)">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </p>
                            <v-img max-height="300" max-width="700" :src="MyThumbnail(editedItem.image)"></v-img>
                          </div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Enregister</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" color="orange" dark>
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
import { ref, watch, computed, onMounted } from 'vue'
import { useDate } from 'vuetify'
import { DEFAULT_ITEM } from '../utilities/types'
import { FormRequiredRules } from '../utilities/constantes'

const date = useDate()

const imgURL = import.meta.env.VITE_BACKEND_IMAGE_URL

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
  changeVisible: Function
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
    maxPosition.value > 0 ? (defaultItem.value.position = maxPosition.value) : (defaultItem.value.position = 1)
    editedItem.value = Object.assign({}, defaultItem.value)
  }
  val || close()
})

function onObjectSelected(event) {
  // objectThumbnailFile.value = event
  // editedItem.value.image = objectThumbnailFile.value
  editedItem.value.image = document.getElementById('picture').files[0]
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

const maxPosition = computed(() => {
  return Math.max(...items.value.map((items) => items.position)) + 1
})

const displayDateFormattedCompletion = computed(() => {
  return editedItem.value.completionDate ? date.format(editedItem.value.completionDate, 'fullDate') : null
})
</script>
