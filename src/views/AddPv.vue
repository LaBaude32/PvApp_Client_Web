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
    <TestModifyPv v-model="isNewPv" @close-dialog="dialog = false" />
  </v-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import TestModifyPv from '../components/TestModifyPv.vue'

const dialog = ref(false)
const isNewPv = ref(true)

onMounted(() => {
  dialog.value = true
})
</script>
