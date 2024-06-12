<template>
  <div>
    <v-form v-model="valid" ref="form" v-if="affairs != ''">
      <v-container>
        <v-row>
          <v-col cols="6" lg="6">
            <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="computedDateFormattedMeetingDate"
                  label="Jour de la réunion"
                  readonly
                  v-bind="props"
                  @click:clear="meetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="meetingDateDate" @change="menu1 = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu
              ref="menuRef2"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="meetingDateTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="meetingDateTime"
                  label="Heure de la réunion"
                  prepend-inner-icon="mdi-clock-outline"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="meetingDateTime"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef2.save(meetingDateTime)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
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
            <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="computedDateFormattedMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-bind="props"
                  @click:clear="meetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="meetingNextDateDate" @change="menu3 = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu
              ref="menu"
              v-model="menu4"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="meetingNextDateTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="meetingNextDateTime"
                  label="Heure de la prochaine réunion"
                  prepend-inner-icon="mdi-clock-outline"
                  readonly
                  v-bind="props"
                  clearable
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu4"
                v-model="meetingNextDateTime"
                format="24hr"
                full-width
                @click:minute="$refs.menu.save(meetingNextDateTime)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
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
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

const store = useStore()
// const date = useDate()

const dialog = ref(false)
const valid = ref(false)
const menu1 = ref(false)
const menu2 = ref(false)
const menu3 = ref(false)
const menu4 = ref(false)
const meetingDateDate = ref(new Date().toISOString().substr(0, 10))
const meetingDateTime = ref(DateTime.now().toFormat('T').substr(0, 2) + ':00')
const meetingNextDateDate = ref('')
const meetingNextDateTime = ref('')
const meetingNextDate = ref('')
const meetingDate = ref('')
const affairs = ref([])
const state = ref('En cours')
const meetingPlace = ref('')
const meetingNextPlace = ref('')
const affairId = ref('')
const affairRules = ref([(v) => !!v || 'Requis'])
const addressRules = ref([
  (v) => !!v || 'Requis',
  (v) => (v && v.length >= 10) || 'Doit être supérieur à 10 caractères'
])

const userId = computed(() => store.state.userId)

const computedDateFormattedMeetingDate = computed(() => {
  return meetingDateDate ? DateTime.fromSQL(meetingDateDate).toFormat('DDDD') : ''
})

const computedDateFormattedMeetingNextDate = computed(() => {
  return meetingNextDateDate ? DateTime.fromSQL(meetingNextDateDate).toFormat('DDDD') : ''
})

function createAffair() {
  this.$router.push(getRouteName('addAffair'))
}
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
function allowedStep(m) {
  m % 5 === 0
}

onMounted(async () => {
  // let self = this
  const dtAffairs = {
    params: {
      userId: userId
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
</script>
