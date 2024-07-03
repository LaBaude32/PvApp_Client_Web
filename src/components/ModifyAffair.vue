<template>
  <v-card>
    <v-card-title>Modifier l'affaire</v-card-title>
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="affairDatas.name"
                :counter="50"
                label="Nom de l'affaire"
                :rules="FormNameRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="affairDatas.address"
                counter
                label="Adresse de l'affaire"
                :rules="FormAddressRules"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="affairDatas.meetingType"
                :items="items"
                label="Phase"
                :rules="FormMeetingRules"
              ></v-combobox>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="affairDatas.description"
                auto-grow
                :counter="100"
                rows="1"
                label="Description de l'affaire"
                :rules="FormDescriptionRules"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">Valider</v-btn>
        <v-btn v-if="enableVider" color="error" class="mr-4" @click="reset">Vider</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { FormAddressRules, FormNameRules, FormDescriptionRules, FormMeetingRules } from '@/utilities/constantes'

defineProps({
  validate: Function,
  enableVider: Boolean //FIXME: logique étrange
})

const affairDatas = defineModel('affairDatas', { type: Object, required: true })

const valid = ref(false)

const items = ['Chantier', 'Etude']

function reset() {
  //FIXME: fonctionne pas
  this.$refs.form.reset()
}
</script>
