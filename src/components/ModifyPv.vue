<template>
  <v-card class="pa-2 pb-3">
    <v-card-title v-if="modifyingType">
      Modifier le PV du {{ $filters.formatDateWithA(pvData.meetingDate) }}
    </v-card-title>
    <v-card-title v-else>Nouveau procès verbal</v-card-title>
    <!-- {{ pvData }} -->
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-row>
          <v-col cols="6">
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
          <v-col cols="6">
            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  label="Heure de la réunion"
                  readonly
                  clearable
                  @click:clear="meetingDateTime = null"
                  prepend-inner-icon="mdi-clock-outline"
                  v-model="meetingNextDateTime"
                ></v-text-field>
              </template>
              <v-time-picker title="Selectionner l'heure" format="24hr" v-model="meetingNextDateTime"></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="pvData.meetingPlace"
              counter
              label="Lieu de la réunion"
              :rules="addressRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="displayNextMeetingDate"
                  label="Date de la prochaine réunion"
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
          <v-col cols="6">
            <v-menu v-model="meetingNextDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="displayNextMeetingDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-bind="props"
                  @click:clear="meetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="meetingNextDateDate"
                @change="meetingNextDateDateMenu = false"
                locale="fr-fr"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="menuRef2"
              v-model="meetingNextDateTimeMenu"
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
                  @click:clear="meetingNextDateTime = null"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingNextDateTimeMenu"
                v-model="meetingNextDateTime"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef2.save(meetingNextDateTime)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="pvData.meetingNextPlace" counter label="Lieu de la prochaine réunion"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch
              v-model="pvData.state"
              :label="pvData.state"
              role="switch"
              false-value="En cours"
              true-value="Terminé"
            ></v-switch>
          </v-col>
          <v-col cols="12" v-if="!pvData.affairId">
            <v-combobox
              v-model="pvData.affairId"
              :items="affairs"
              item-text="name"
              item-value="id_affair"
              label="Affaire"
              :rules="affairRules"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <!-- <v-btn v-if="!modifyingType" color="error" @click.prevent="cancel">Annuler</v-btn> -->
        <v-btn color="error" @click.prevent="cancel">Annuler</v-btn>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click.prevent="validate">Enregistrer</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDate } from 'vuetify'

const date = useDate()
defineProps({
  data: Object,
  affairs: Array,
  modifyingType: Boolean,
  validate: Function,
  cancel: Function
})

const isFormValid = defineModel('isFormValid', { type: Boolean, default: false, required: true })
const meetingDateDate = defineModel('meetingDateDate', { required: true })
const meetingDateTime = defineModel('meetingDateTime', { required: true })
const meetingNextDateDate = defineModel('meetingNextDateDate', { required: true })
const meetingNextDateTime = defineModel('meetingNextDateTime', { required: true })
const pvData = defineModel('data', { type: Object, required: true })

const valid = ref(false)
const meetingNextDateDateMenu = ref(false)
const meetingNextDateTimeMenu = ref(false)
const affairRules = ref([(v) => !!v || 'Requ  is'])
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

// const computedDateFormattedMeetingDate = computed(() => {
//   return meetingDateDate.value ? DateTime.fromSQL(meetingDateDate.value).toFormat('DDDD') : ''
// })
// const computedDateFormattedMeetingNextDate = computed(() => {
//   return meetingNextDateDate.value ? DateTime.fromSQL(meetingNextDateDate.value).toFormat('DDDD') : ''
// })
</script>
