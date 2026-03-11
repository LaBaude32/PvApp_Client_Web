<template>
  <v-card class="pa-2 pb-3">
    <div v-if="isSavingForm">
      <SavingLoader></SavingLoader>
    </div>
    <div v-else>
      <v-card-title v-if="isNewPv">Nouveau procès verbal</v-card-title>
      <v-card-title v-else>
        Modifier le PV du {{ $filters.formatDateWithA(pvData.meetingDate) }}
      </v-card-title>
      <v-card-text v-if="datasIsLoading" class="pa-4 text-center">
        <p>Chargement des données</p>
        <v-progress-circular color="primary" indeterminate="disable-shrink" size="70" width="5" />
      </v-card-text>
      <v-form v-else ref="my-form" v-model="isFormValid">
        <v-card-text>
          <v-row>
            <v-col cols="6" lg="6">
              <v-text-field
                label="Date de la réunion"
                readonly
                clearable
                @click:clear="pvData.meetingDateDate = null"
                @click:control="meetingDateDateDialog = true"
                prepend-inner-icon="mdi-calendar"
                v-model="displayMeetingDate"
                :rules="FormRequiredRules"
              ></v-text-field>
              <v-dialog v-model="meetingDateDateDialog" width="auto">
                <v-date-picker
                  title="Selectionner une date"
                  header="Nouvelle date"
                  v-model="pvData.meetingDateDate"
                ></v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6" sm="6">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    label="Heure de la réunion"
                    readonly
                    clearable
                    @click:clear="pvData.meetingDateTime = null"
                    prepend-inner-icon="mdi-clock-outline"
                    v-model="pvData.meetingDateTime"
                    :rules="FormRequiredRules"
                  ></v-text-field>
                </template>
                <v-time-picker
                  title="Selectionner l'heure"
                  format="24hr"
                  v-model="pvData.meetingDateTime"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="pvData.meetingPlace"
                counter
                label="Lieu de la réunion"
                :rules="FormRequiredRulesMin3"
              ></v-text-field>
            </v-col>
            <v-col cols="6" lg="6">
              <v-text-field
                v-model="displayNextMeetingDate"
                label="Date de la prochaine réunion"
                readonly
                clearable
                @click:clear="pvData.meetingNextDateDate = null"
                @click:control="meetingNextDateDialog = true"
                prepend-inner-icon="mdi-calendar"
              ></v-text-field>
              <v-dialog v-model="meetingNextDateDialog" width="auto">
                <v-date-picker
                  title="Selectionner une date"
                  header="Nouvelle date"
                  v-model="pvData.meetingNextDateDate"
                ></v-date-picker>
              </v-dialog>
            </v-col>
            <v-col cols="6" sm="6">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    label="Heure de la prochaine réunion"
                    readonly
                    clearable
                    @click:clear="pvData.meetingNextDateTime = null"
                    prepend-inner-icon="mdi-clock-outline"
                    v-model="pvData.meetingNextDateTime"
                  ></v-text-field>
                </template>
                <v-time-picker
                  title="Selectionner l'heure"
                  format="24hr"
                  v-model="pvData.meetingNextDateTime"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="pvData.meetingNextPlace"
                counter
                label="Lieu de la prochaine réunion"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="pvData.affairId"
                :items="affairs"
                item-title="name"
                item-value="affairId"
                label="Affaire"
                :rules="FormAffairRules"
                :disabled="props.affairId != undefined"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <!-- TODO:Ajouter un bouton pour supprimer un PV -->
          <v-btn color="error" @click="cancelForm">Annuler</v-btn>
          <v-spacer />
          <v-btn :disabled="!isFormValid" color="success" class="mr-4" @click="saveForm">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import Axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDate } from 'vuetify'

import { useMeetingDateFormater } from '@/composables/useMeetingDateFormater'
import { useNotificationStore } from '@/store/notification'
import routesCONST, {
  FormAffairRules,
  FormRequiredRules,
  FormRequiredRulesMin3
} from '@/utilities/constantes.ts'
import { PV_DATA } from '@/utilities/dataConst.ts'
import { useUserStore } from '../store/user'
import SavingLoader from './SavingLoader.vue'

const userStore = useUserStore()
const useNotification = useNotificationStore()
const date = useDate()
const router = useRouter()
const route = useRoute()

const isFormValid = ref(false)
const affairs = ref([])
const state = ref('En cours')
const pvData = ref(PV_DATA)
const datasIsLoading = ref(true)
const isSaved = ref(false)
const meetingDateDateDialog = ref(false)
const meetingNextDateDialog = ref(false)

const props = defineProps({
  affairId: { type: Number }
})
const isNewPv = defineModel('isNewPv', { type: Boolean, default: true })
const existingPvData = defineModel('pvData', { type: Object })
const emit = defineEmits(['closeDialog'])

const displayMeetingDate = computed({
  get: () =>
    pvData.value.meetingDateDate ? date.format(pvData.value.meetingDateDate, 'fullDate') : null,
  set: (val) => {
    pvData.value.meetingDateDate = val
  }
})
const displayNextMeetingDate = computed({
  get: () =>
    pvData.value.meetingNextDateDate
      ? date.format(pvData.value.meetingNextDateDate, 'fullDate')
      : null,
  set: (val) => {
    pvData.value.meetingNextDateDate = val
  }
})

const isSavingForm = ref(false)

/**
 * Formats a date and time into an ISO 8601 string
 * @param {string|DateInstance|null} date - The date to format
 * @param {string|null} time - The time to append
 * @returns {string|null} ISO 8601 formatted datetime string or null if either parameter is missing
 */
function formatDateTime(givenDate, time) {
  if (!givenDate || !time) {
    return null
  }
  try {
    return date.toISO(givenDate) + 'T' + time
  } catch (error) {
    console.error('Error formatting date:', error)
    return null
  }
}

/**
 * Validates that required fields are present before saving
 * @returns {boolean} True if all required fields are valid
 */
function validateFormData() {
  const hasMeetingNextDate = pvData.value.meetingNextDateDate && pvData.value.meetingNextDateTime

  if (!hasMeetingNextDate) {
    useNotification.error('Date de la prochaine réunion incomplète')
    return false
  }
  return true
}

function saveForm() {
  if (!validateFormData()) {
    isSavingForm.value = false
    return
  }

  isSavingForm.value = true
  const data = {
    meetingDate: formatDateTime(pvData.value.meetingDateDate, pvData.value.meetingDateTime),
    meetingPlace: pvData.value.meetingPlace,
    meetingNextDate: formatDateTime(
      pvData.value.meetingNextDateDate,
      pvData.value.meetingNextDateTime
    ),
    meetingNextPlace: pvData.value.meetingNextPlace || null,
    state: state.value,
    affairId: pvData.value.affairId
  }
  if (isNewPv.value) {
    Axios.post('pvs', data)
      .then((response) => {
        const pvId = response.data.pvId
        isSavingForm.value = false
        router.push({
          name: routesCONST.pv.name,
          params: { id: pvId }
        })
      })
      .catch((error) => {
        console.error('Error saving new PV:', error)
        isSavingForm.value = false
      })
  } else {
    data.pvId = pvData.value.pvId
    Axios.put('pvs', data)
      .then((res) => {
        pvData.value = res.data
        existingPvData.value = res.data
        isNewPv.value = false
        isSaved.value = true
        isSavingForm.value = false
        emit('closeDialog', isSaved.value)
      })
      .catch((error) => {
        console.error('Error updating PV:', error)
        isSavingForm.value = false
      })
  }
}

function cancelForm() {
  isSaved.value = false
  emit('closeDialog', isSaved.value)
  if (route.path === '/AddPv') {
    router.push('board')
  }
}

onMounted(() => {
  if (!isNewPv.value) {
    pvData.value = { ...existingPvData.value }
    pvData.value.meetingDateDate = useMeetingDateFormater(pvData.value.meetingDate).meetingDateDate
    pvData.value.meetingDateTime = useMeetingDateFormater(pvData.value.meetingDate).meetingDateTime
    if (pvData.value.meetingNextDate) {
      pvData.value.meetingNextDateDate = useMeetingDateFormater(
        pvData.value.meetingNextDate
      ).meetingDateDate
      pvData.value.meetingNextDateTime = useMeetingDateFormater(
        pvData.value.meetingNextDate
      ).meetingDateTime
    }
  } else {
    if (pvData.value.meetingDate) {
      pvData.value.meetingDateDate = useMeetingDateFormater(
        pvData.value.meetingDate
      ).meetingDateDate
      pvData.value.meetingDateTime = useMeetingDateFormater(
        pvData.value.meetingDate
      ).meetingDateTime
    }
    if (!pvData.value.pvId) {
      //TODO: Je sais pas trop pourquoi j'ai ça
      pvData.value = PV_DATA
    }
  }
  const dtAffairs = {
    params: {
      userId: userStore.user.userId
    }
  }
  Axios.get('affairs/userId', dtAffairs)
    .then(function (response) {
      affairs.value = response.data
    })
    .catch(function (error) {
      console.error('Error fetching affairs:', error)
    })

  if (props.affairId) {
    pvData.value.affairId = props.affairId
  }
  datasIsLoading.value = false
})
</script>
