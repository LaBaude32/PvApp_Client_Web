<template>
  <v-card class="pa-2 pb-3">
    <v-card-title v-if="isNewPv">Nouveau procès verbal</v-card-title>
    <v-card-title v-else>Modifier le PV du {{ $filters.formatDateWithA(pvData.meetingDate) }}</v-card-title>
    <v-card-text v-if="datasIsLoading" class="pa-4 text-center">
      <p>Chargement des données</p>
      <v-progress-circular color="primary" indeterminate="disable-shrink" size="70" width="5" />
    </v-card-text>
    <v-form v-else ref="my-form" v-model="isFormValid">
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
                  @click:clear="pvData.meetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                  v-model="displayMeetingDate"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="pvData.meetingDateDate"
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
                  @click:clear="pvData.meetingDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="pvData.meetingDateTime"
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
                  @click:clear="pvData.meetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="pvData.meetingNextDateDate"
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
            <v-text-field v-model="pvData.meetingNextPlace" counter label="Lieu de la prochaine réunion"></v-text-field>
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
import { useRoute, useRouter } from 'vue-router'
import Axios from 'axios'

import routesCONST, { FormAddressRules, FormAffairRules } from '@/utilities/constantes'
import { PV_DATA } from '@/utilities/types'

const props = defineProps({
  affairId: { type: Number }
})

const store = useStore()
const date = useDate()
const router = useRouter()
const route = useRoute()

const isFormValid = ref(false)
const affairs = ref([])
const state = ref('En cours')
const pvData = ref(PV_DATA)
const datasIsLoading = ref(true)

const isNewPv = defineModel('isNewPv', { type: Boolean, default: true })
const existingPvData = defineModel('pvData', { type: Object })

const emit = defineEmits(['closeDialog', isSaved])

const displayMeetingDate = computed({
  get: () => (pvData.value.meetingDateDate ? date.format(pvData.value.meetingDateDate, 'fullDate') : null),
  set: (val) => {
    pvData.value.meetingDateDate = val
  }
})

const displayNextMeetingDate = computed({
  get: () => (pvData.value.meetingNextDateDate ? date.format(pvData.value.meetingNextDateDate, 'fullDate') : null),
  set: (val) => {
    pvData.value.meetingNextDateDate = val
  }
})

function validate() {
  const data = {
    meetingDate: date.toISO(pvData.value.meetingDateDate) + 'T' + pvData.value.meetingDateTime,
    meetingPlace: pvData.value.meetingPlace,
    meetingNextDate: pvData.value.meetingNextDateDate
      ? date.toISO(pvData.value.meetingNextDateDate) + 'T' + pvData.value.meetingNextDateTime
      : null,
    meetingNextPlace: pvData.value.meetingNextPlace ? pvData.value.meetingNextPlace : null,
    state: state.value,
    affairId: pvData.value.affairId
  }
  if (isNewPv.value) {
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
  } else {
    data.pvId = pvData.value.pvId
    Axios.put('pvs/pvId', data).then((res) => {
      pvData.value = res.data
      existingPvData.value = res.data
      console.log(res.data)
      isNewPv.value = false
      emit('closeDialog' , true)
    })
  }
}

function cancelForm() {
  emit('closeDialog')
  if (route.path == '/AddPv') {
    router.push('board')
  }
}

onMounted(() => {
  if (!isNewPv.value) {
    pvData.value = { ...existingPvData.value }
    pvData.value.meetingDateDate = date.parseISO(pvData.value.meetingDate.slice(0, 10))
    pvData.value.meetingDateTime = pvData.value.meetingDate.slice(-8)
    pvData.value.meetingNextDateDate ? date.parseISO(pvData.value.meetingNextDate.slice(0, 10)) : null
    pvData.value.meetingNextDateTime ? pvData.value.meetingNextDate.slice(-8) : null
  }
  const dtAffairs = {
    params: {
      userId: store.state.user.userId
    }
  }
  if (typeof userId != undefined) {
    Axios.get('affairs/userId', dtAffairs)
      .then(function (response) {
        affairs.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    store.dispatch('auth/authLogout')
  }
  if (props.affairId) {
    pvData.value.affairId = props.affairId
  }
  datasIsLoading.value = false
})
</script>
