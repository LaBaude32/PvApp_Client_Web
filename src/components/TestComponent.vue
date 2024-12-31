<template>
  <v-form v-model="isFormValid" ref="form">
    <v-container>
      <v-row>
        <v-col>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="Date de la réunion"
                readonly
                clearable
                @click:clear="meetingDateDate = null"
                prepend-inner-icon="mdi-calendar"
                v-model="displayMeetingDate"
              ></v-text-field>
            </template>
            <v-date-picker
              title="Selectionner une date"
              header="Nouvelle date"
              v-model="meetingDateDate"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu :close-on-content-click="false">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-bind="props"
                label="Heure de la réunion"
                readonly
                clearable
                @click:clear="meetingDateDate = null"
                prepend-inner-icon="mdi-clock-meetingDateTime-four-outline"
                v-model="meetingDateTime"
              ></v-text-field>
            </template>
            <v-time-picker title="Selectionner l'heure" format="24hr" v-model="meetingDateTime"></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    <v-btn :disabled="!isFormValid" color="success" class="mr-4" @click="validateForm">Valider</v-btn>
  </v-form>
</template>

<script setup>
import { useDate } from 'vuetify'
import { computed } from 'vue'

const date = useDate()

defineProps({
  validateForm: Function
})

const isFormValid = defineModel('isFormValid', { default: false, required: true })
const meetingDateDate = defineModel('meetingDateDate', { required: true })
const meetingDateTime = defineModel('meetingDateTime', { required: true })

const displayMeetingDate = computed(() => {
  return meetingDateDate.value ? date.format(meetingDateDate.value, 'fullDate') : null
})
</script>
