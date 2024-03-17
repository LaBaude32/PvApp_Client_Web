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
            <v-menu v-model="meetingDateDateMenu" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="meetingDate"
                  label="Jour de la réunion"
                  readonly
                  v-bind="props"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="myMeetingDateDate"
                @change="meetingDateDateMenu = false"
                locale="fr-fr"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="menuRef1"
              v-model="meetingDateTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="myMeetingDateTime"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="myMeetingDateTime"
                  label="Heure de la réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingDateTimeMenu"
                v-model="myMeetingDateTime"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef1.save(myMeetingDateTime)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="myPvData.meetingPlace"
              counter
              clearable
              label="Lieu de la réunion"
              :rules="addressRules"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-menu v-model="meetingNextDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ props }">
                <v-text-field
                  :value="myMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-bind="props"
                  @click:clear="myMeetingNextDateDate = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="myMeetingNextDateDate"
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
                  prepend-icon="mdi-clock-outline"
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

<script>
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

export default {
  name: 'ModifyPv',
  props: {
    data: Object,
    meetingDate: String,
    meetingNextDate: String,
    meetingDateDate: String,
    meetingDateTime: String,
    meetingNextDateDate: String,
    meetingNextDateTime: String,
    affairs: Array,
    modifyingType: Boolean,
    validate: Function,
    cancel: Function
  },
  data() {
    return {
      meetingDateDateMenu: false,
      meetingDateTimeMenu: false,
      meetingNextDateDateMenu: false,
      meetingNextDateTimeMenu: false,
      myPvData: this.data,
      valid: false,
      addressRules: [(v) => v.length >= 3 || 'Doit être supérieur à 3 caractères'],
      affairRules: [(v) => !!v || 'Requis']
    }
  },
  computed: {
    myMeetingDateDate: {
      get() {
        return this.meetingDateDate
      },
      set(val) {
        this.$emit('update:meetingDateDate', val)
      }
    },
    myMeetingDateTime: {
      get() {
        return this.meetingDateTime
      },
      set(val) {
        this.$emit('update:meetingDateTime', val)
      }
    },
    myMeetingNextDateDate: {
      get() {
        return this.meetingNextDateDate
      },
      set(val) {
        this.$emit('update:meetingNextDateDate', val)
      }
    },
    myMeetingNextDateTime: {
      get() {
        return this.meetingNextDateTime
      },
      set(val) {
        this.$emit('update:meetingNextDateTime', val)
      }
    },

    myMeetingDate: {
      get() {
        return this.meetingDate
      },
      set(val) {
        this.$emit('update:meetingDate', val)
      }
    },
    myMeetingNextDate: {
      get() {
        return this.meetingNextDate
      },
      set(val) {
        this.$emit('update:meetingNextDate', val)
      }
    },
    computedDateFormattedMeetingDate() {
      return this.myMeetingDateDate ? DateTime.fromSQL(this.myPvData.meetingDateDate).toFormat('DDDD') : ''
    },
    computedDateFormattedMeetingNextDate() {
      return this.myPvData.meetingNextDateDate
        ? DateTime.fromSQL(this.myPvData.meetingNextDateDate).toFormat('DDDD')
        : ''
    }
  },
  methods: {
    allowedStep: (m) => m % 5 === 0
  }
}
</script>
