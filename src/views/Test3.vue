<template>
  <div>
    <!-- <v-form v-model="valid" ref="form" v-if="affairs != ''">
      <v-container class="text-center">
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Valider</v-btn>
      </v-container>
    </v-form> -->
    <v-form v-model="valid" ref="form" v-if="affairs != ''">
      <v-container>
        <v-row>
          <v-col cols="6" lg="6">
            <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :value="computedDateFormattedMeetingDate"
                  label="Jour de la réunion"
                  readonly
                  @click:clear="meetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="meetingDateDate" @change="menu1 = false" locale="fr-fr"></v-date-picker>
            </v-menu>
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
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

const store = useStore()
// const date = useDate()

const valid = ref(false)
const menu1 = ref(false)
const meetingDateDate = ref(new Date().toISOString().substr(0, 10))
const meetingDateTime = ref(DateTime.now().toFormat('T').substr(0, 2) + ':00')
const meetingNextDateDate = ref('')
const meetingNextDateTime = ref('')
const meetingNextDate = ref('')
const affairs = ref()
const state = ref('En cours')
const meetingPlace = ref('')
const meetingNextPlace = ref('')
const affairId = ref('')

const computedDateFormattedMeetingDate = computed(() => {
  return meetingDateDate ? DateTime.fromSQL(meetingDateDate).toFormat('DDDD') : ''
})

onMounted(async () => {
  // let self = this
  const dtAffairs = {
    params: {
      // userId: userId
      userId: 42
    }
  }
  let res
  if (typeof userId != undefined) {
    Axios.get('affairs/userId', dtAffairs)
      .then(function (response) {
        // handle success
        self.affairs = response.data
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
  } else {
    this.$store.dispatch('auth/authLogout')
  }
})

function validate() {
  if (meetingNextDateDate == 'empty string') {
    meetingNextDate.value = meetingNextDateDate + ' ' + meetingNextDateTime + ':00'
  } else {
    meetingNextDate.value = null
  }
  let pvData = {
    meetingDate: meetingDateDate.value + ' ' + meetingDateTime + ':00',
    meetingPlace: meetingPlace,
    meetingNextDate: meetingNextDate,
    meetingNextPlace: meetingNextPlace,
    state: state,
    affairId: affairId.id_affair
  }
  Axios.post('addPv', pvData)
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
</script>
