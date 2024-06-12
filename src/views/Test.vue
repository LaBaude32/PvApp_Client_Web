<template>
  <v-form v-model="valid" ref="form">
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
                @click:clear="meeting_date_date = null"
                prepend-inner-icon="mdi-calendar"
                v-model="displayMeetingDate"
              ></v-text-field>
            </template>
            <v-date-picker
              title="Selectionner une date"
              header="Nouvelle date"
              v-model="meeting_date_date"
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
                @click:clear="meeting_date_date = null"
                prepend-inner-icon="mdi-clock-meeting_date_time-four-outline"
                v-model="meeting_date_time"
              ></v-text-field>
            </template>
            <v-time-picker title="Selectionner l'heure" format="24hr" v-model="meeting_date_time"></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate2">Valider</v-btn>
  </v-form>
</template>

<script setup>
import { useDate } from 'vuetify'
import { ref, onMounted, computed } from 'vue'

const valid = ref(false)
const date = useDate()
const meeting_date_date = ref(null)
const meeting_date_time = ref(null)

function validate2() {
  console.log(date.toISO(meeting_date_date.value))
  console.log(meeting_date_time.value)
}

// onMounted(() => {
//   console.log(date.format(meeting_date_date, 'keyboardDate'))
// })

// const userId = computed(() => store.state.userId)

const displayMeetingDate = computed(() => {
  return meeting_date_date.value ? date.format(meeting_date_date.value, 'fullDate') : null
})
</script>
