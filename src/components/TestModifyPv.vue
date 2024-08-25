<template>
  <v-card class="pa-2 pb-3">
    <v-card-title v-if="isNewPv">Nouveau procès verbal</v-card-title>
    <v-card-title v-else>Modifier le PV du {{ $filters.formatDateWithA(myPvData.meetingDate) }}</v-card-title>
    <v-card-text v-if="datasLoaded" class="pa-4 text-center">
      <p>Chargement des données</p>
      <v-progress-circular color="primary" indeterminate="disable-shrink" size="70" width="5" />
    </v-card-text>
    <v-form v-else v-model="isFormValid">
      <v-card-text>
        <v-row>
          <v-col cols="6" lg="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  label="Date de la réunion"
                  readonly
                  clearable
                  @click:clear="myPvData.meetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                  v-model="displayMeetingDate"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="myPvData.meetingDateDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  label="Heure de la réunion"
                  readonly
                  clearable
                  @click:clear="myPvData.meetingDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="myPvData.meetingDateTime"
                ></v-text-field>
              </template>
              <v-time-picker
                title="Selectionner l'heure"
                format="24hr"
                v-model="myPvData.meetingDateTime"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="myPvData.meetingPlace"
              counter
              label="Lieu de la réunion"
              :rules="FormAddressRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6" lg="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="displayNextMeetingDate"
                  label="Date de la réunion"
                  readonly
                  clearable
                  @click:clear="myPvData.meetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="myPvData.meetingNextDateDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  label="Heure de la réunion"
                  readonly
                  clearable
                  @click:clear="myPvData.meetingNextDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="myPvData.meetingNextDateTime"
                ></v-text-field>
              </template>
              <v-time-picker
                title="Selectionner l'heure"
                format="24hr"
                v-model="myPvData.meetingNextDateTime"
              ></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="myPvData.meetingNextPlace"
              counter
              label="Lieu de la prochaine réunion"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="myPvData.affairId"
              :items="affairs"
              item-title="name"
              item-value="affairId"
              label="Affaire"
              :rules="FormAffairRules"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" @click="cancelForm">Annuler</v-btn>
        <v-btn :disabled="!isFormValid" color="success" class="mr-4" @click="validate">Enregistrer</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useDate } from 'vuetify'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Axios from 'axios'

import routesCONST, { FormAddressRules, FormAffairRules } from '@/utilities/constantes'
import { pvData } from '@/utilities/types'

const store = useStore()
const date = useDate()
const router = useRouter()

const isFormValid = ref(false)
const affairs = ref([])
const state = ref('En cours')
const myPvData = ref(pvData)
const datasLoaded = ref(true)

const isNewPv = defineModel('isNewPv', { type: Boolean, required: false, default: true })

const emit = defineEmits(['closeDialog'])

const displayMeetingDate = computed({
  get: () => (myPvData.value.meetingDateDate ? date.format(myPvData.value.meetingDateDate, 'fullDate') : null),
  set: (val) => {
    myPvData.value.meetingDateDate = val
  }
})

const displayNextMeetingDate = computed({
  get: () => (myPvData.value.meetingNextDateDate ? date.format(myPvData.value.meetingNextDateDate, 'fullDate') : null),
  set: (val) => {
    myPvData.value.meetingNextDateDate = val
  }
})

function validate() {
  const data = {
    meetingDate: date.toISO(myPvData.value.meetingDateDate) + 'T' + myPvData.value.meetingDateTime,
    meetingPlace: myPvData.value.meetingPlace,
    meetingNextDate: myPvData.value.meetingNextDateDate
      ? date.toISO(myPvData.value.meetingNextDateDate) + 'T' + myPvData.value.meetingNextDateTime
      : null,
    meetingNextPlace: myPvData.value.meetingNextPlace ? myPvData.value.meetingNextPlace : null,
    state: state.value,
    affairId: myPvData.value.affairId
  }
  Axios.post('pvs', data)
    .then((response) => {
      const pvId = response.data.pvId
      router.push({
        name: routesCONST.pv.name,
        params: { id: pvId }
      })
    })
    .catch((error) => {
      console.log(error)
    })
}

function cancelForm() {
  for (const key in myPvData.value) {
    myPvData.value[key] = null
  }
  isNewPv.value = false
  emit('closeDialog')
  router.back()
}

onMounted(async () => {
  const dtAffairs = {
    params: {
      userId: store.state.user.userId
    }
  }
  if (typeof userId != undefined) {
    Axios.get('affairs/userId', dtAffairs)
      .then(function (response) {
        affairs.value = response.data
        datasLoaded.value = false
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    store.dispatch('auth/authLogout')
  }
})
</script>
