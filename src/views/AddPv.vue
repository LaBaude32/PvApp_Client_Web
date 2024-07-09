<template>
  <!-- <div>
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
  </div> -->
  <v-dialog v-model="dialog" max-width="80%">
    <TestModifyPv
      v-model:pvData="pvData"
      v-model:isFormValid="isFormValid"
      :validateForm="validate"
      :affairs="affairsForPv"
      :pvModifyingType="pvModifyingType"
      :cancel="cancelForm"
      :isNewPv="isNewPv"
    />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import Axios from 'axios'
import { useStore } from 'vuex'
import routesCONST from '../utilities/constantes'
import { useDate } from 'vuetify'
import TestModifyPv from '../components/TestModifyPv.vue'
import { useRouter } from 'vue-router'

const store = useStore()
const date = useDate()
const router = useRouter()

const isFormValid = ref(false)
const affairsForPv = ref([])
const pvModifyingType = ref(false)
const dialog = ref(false)
const isNewPv = ref(true)
const state = ref('En cours')

//TODO:changer la reactive par une ref
const pvData = reactive({
  meetingDateDate: ref(null),
  meetingDateTime: ref(null),
  meetingNextDateDate: ref(null),
  meetingNextDateTime: ref(null),
  meetingPlace: ref(null),
  meetingNextPlace: ref(null),
  affairId: ref(null)
})

function validate() {
  let data = {
    meetingDate: date.toISO(pvData.meetingDateDate) + 'T' + pvData.meetingDateTime,
    meetingPlace: pvData.meetingPlace,
    meetingNextDate: pvData.meetingNextDateDate
      ? date.toISO(pvData.meetingNextDateDate) + 'T' + pvData.meetingNextDateTime
      : null,
    meetingNextPlace: pvData.meetingNextPlace ? pvData.meetingNextPlace : null,
    state: state.value,
    affairId: pvData.affairId
  }
  console.log(data)
  Axios.post('pvs', data)
    .then((response) => {
      let pvId = response.data.pvId
      // this.$router.push({
      //   name: routesCONST.pv.name,
      //   params: { id: pvId }
      // })
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
  for (const key in pvData) {
    pvData[key] = null
  }
  isNewPv.value = false
  dialog.value = false
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
        affairsForPv.value = response.data
        dialog.value = true
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    store.dispatch('auth/authLogout')
  }
})
</script>
