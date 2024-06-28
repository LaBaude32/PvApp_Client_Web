<template>
  <v-card class="pa-2 pb-3">
    <v-card-title v-if="modifyingType">
      Modifier le PV du {{ $filters.formatDateWithA(myPvData.meetingDate) }}
    </v-card-title>
    <v-card-title v-else>Nouveau procès verbal</v-card-title>
    <!-- {{ myPvData }} -->
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
                  @click:clear="myMeetingDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="myMeetingDateDate"
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
                  v-model="myMeetingDateTime"
                ></v-text-field>
              </template>
              <v-time-picker title="Selectionner l'heure" format="24hr" v-model="myMeetingDateTime"></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="myPvData.meetingPlace"
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
                  @click:clear="myMeetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                title="Selectionner une date"
                header="Nouvelle date"
                v-model="myMeetingNextDateDate"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu v-model="myMeetingNextDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="myMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-bind="props"
                  @click:clear="myMeetingNextDateDate = null"
                  prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="myMeetingNextDateDate"
                @change="MeetingNextDateDateMenu = false"
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
              :return-value.sync="myMeetingNextDateTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="myMeetingNextDateTime"
                  label="Heure de la prochaine réunion"
                  prepend-inner-icon="mdi-clock-outline"
                  readonly
                  v-bind="props"
                  clearable
                  @click:clear="myMeetingNextDateTime = null"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingNextDateTimeMenu"
                v-model="myMeetingNextDateTime"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef2.save(myMeetingNextDateTime)"
                :allowed-minutes="allowedStep"
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
            <v-switch
              v-model="myPvData.state"
              :label="myPvData.state"
              role="switch"
              false-value="En cours"
              true-value="Terminé"
            ></v-switch>
          </v-col>
          <v-col cols="12" v-if="!myPvData.affairId">
            <v-combobox
              v-model="myPvData.affairId"
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
import { ref } from 'vue'

defineProps({
  data: Object,
  affairs: Array,
  modifyingType: Boolean,
  validate: Function,
  cancel: Function
})

const isFormValid = defineModel('isFormValid', { default: false, required: true })
const meetingDateDate = defineModel('meetingDateDate', { required: true })
const meetingDateTime = defineModel('meetingDateTime', { required: true })
const meetingNextDateDate = defineModel('meetingNextDateDate', { required: true })
const meetingNextDateTime = defineModel('meetingNextDateTime', { required: true })

const myPvData = data
const valid = ref(false)
const affairRules = ref([(v) => !!v || 'Requis'])
const addressRules = ref([
  (v) => !!v || 'Requis',
  (v) => (v && v.length >= 10) || 'Doit être supérieur à 10 caractères'
])

const displayMeetingDate = computed({
  get: () => (myMeetingDateDate.value ? date.format(myMeetingDateDate.value, 'fullDate') : null),
  set: (val) => {
    myMeetingDateDate.value = val
  }
})

const displayNextMeetingDate = computed({
  get: () => (myMeetingNextDateDate.value ? date.format(myMeetingNextDateDate.value, 'fullDate') : null),
  set: (val) => {
    myMeetingNextDateDate.value = val
  }
})
</script>
