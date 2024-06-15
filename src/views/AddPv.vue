<template>
  <div>
    <v-form v-model="valid" ref="form" v-if="affairs != ''">
      <v-container>
        <v-row>
          <v-col cols="6" lg="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="displayMeetingDate"
                  label="Date de la réunion"
                  readonly
                  clearable
                  @click:clear="meetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="meetingDateDate"
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
                  @click:clear="meetingDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="meetingDateTime"
                ></v-text-field>
              </template>
              <v-time-picker title="Selectionner l'heure" format="24hr" v-model="meetingDateTime"></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="meetingPlace"
              counter
              label="Lieu de la réunion"
              :rules="addressRules"
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
                  @click:clear="meetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="meetingNextDateDate"
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
                  @click:clear="meetingNextDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="meetingNextDateTime"
                ></v-text-field>
              </template>
              <v-time-picker title="Selectionner l'heure" format="24hr" v-model="meetingNextDateTime"></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="meetingNextPlace" counter label="Lieu de la prochaine réunion"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="affairId"
              :items="affairs"
              item-title="name"
              item-value="affairId"
              label="Affaire"
              :rules="affairRules"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="text-center">
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Valider</v-btn>
      </v-container>
    </v-form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Axios from 'axios'
import { useStore } from 'vuex'
import routesCONST, { getRouteName } from '../utilities/constantes'
import { useDate } from 'vuetify'

const store = useStore()
const date = useDate()

const valid = ref(false)
const meetingDateDate = ref()
const meetingDateTime = ref()
const meetingNextDateDate = ref()
const meetingNextDateTime = ref()
const affairs = ref()
const state = ref('En cours')
const meetingPlace = ref()
const meetingNextPlace = ref()
const affairId = ref()
const affairRules = ref([(v) => !!v || 'Requis'])
const addressRules = ref([
  (v) => !!v || 'Requis',
  (v) => (v && v.length >= 10) || 'Doit être supérieur à 10 caractères'
])

const displayMeetingDate = computed({
  get: () => (meetingDateDate.value ? date.format(meetingDateDate.value, 'fullDate') : null),
  set: (val) => {
    meetingDateDate.value = val
  }
})

const displayNextMeetingDate = computed({
  get: () => (meetingNextDateDate.value ? date.format(meetingNextDateDate.value, 'fullDate') : null),
  set: (val) => {
    meetingNextDateDate.value = val
  }
})

function validate() {
  let pvData = {
    // meetingDate: meetingDateDate.value + ' ' + meetingDateTime + ':00',
    meetingDate: date.toISO(meetingDateDate.value) + 'T' + meetingDateTime.value,
    meetingPlace: meetingPlace.value,
    meetingNextDate: meetingNextDateDate.value
      ? date.toISO(meetingNextDateDate.value) + 'T' + meetingNextDateTime.value
      : null,
    meetingNextPlace: meetingNextPlace.value,
    state: state.value,
    affairId: affairId.value
  }
  console.log(pvData)
  Axios.post('pvs', pvData)
    .then((response) => {
      let pvId = response.data.pv.pvId
      this.$router.push({
        name: routesCONST.pv.name,
        params: { id: pvId }
      })
    })
    .catch((error) => {
      console.log(error)
    })
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
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    store.dispatch('auth/authLogout')
  }
})
</script>
