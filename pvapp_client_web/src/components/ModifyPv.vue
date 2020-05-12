<template>
  <v-card class="pa-2 pb-3">
    <v-card-title>Modifier le PV du {{ myPvData.meeting_date | formatDateWithA }}</v-card-title>
    <!-- {{ myPvData }} -->
    <v-form>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-menu v-model="meetingDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMeetingDate"
                  label="Jour de la réunion"
                  readonly
                  v-on="on"
                  @click:clear="myPvData.meeting_date_date = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="myPvData.meeting_date_date" @change="meetingDateDateMenu = meetingDateDateMenu" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6"
            ><v-menu
              ref="menu"
              v-model="meetingDateTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="myPvData.meeting_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="myPvData.meeting_date_time"
                  label="Heure de la réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingDateTimeMenu"
                v-model="myPvData.meeting_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menu.save(myPvData.meeting_date_time)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="myPvData.meeting_place" counter label="Lieu de la réunion" :rules="addressRules"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-menu v-model="meetingNextDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-on="on"
                  @click:clear="meeting_next_date_date = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="myPvData.meeting_next_date_date" @change="meetingNextDateDateMenu = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="menu"
              v-model="meetingNextDateTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="myPvData.meeting_next_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="myPvData.meeting_next_date_time"
                  label="Heure de la prochaine réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingNextDateTimeMenu"
                v-model="myPvData.meeting_next_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menu.save(myPvData.meeting_next_date_time)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="myPvData.meeting_next_place" counter label="Lieu de la prochaine réunion"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="myPvData.state" :label="myPvData.state" role="switch" false-value="En cours" true-value="Terminé"></v-switch>
          </v-col>
          <v-col cols="12" v-if="!modifyingType">
            <v-combobox
              v-model="myPvData.affair_id"
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
        <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import moment from "moment";
export default {
  name: "ModifyPv",
  props: {
    data: Object,
    affairs: Array,
    modifyingType: Boolean,
    validate: Function
  },
  data() {
    return {
      meetingDateDateMenu: false,
      meetingDateTimeMenu: false,
      meetingNextDateDateMenu: false,
      meetingNextDateTimeMenu: false,
      myPvData: this.data,
      valid: false,
      addressRules: [v => !!v || "Requis", v => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"],
      affairRules: [v => !!v || "Requis"]
    };
  },
  computed: {
    computedDateFormattedMeetingDate() {
      return this.myPvData.meeting_date_date ? moment(this.myPvData.meeting_date_date).format("dddd LL") : "";
    },
    computedDateFormattedMMeetingNextDate() {
      return this.myPvData.meeting_next_date_date ? moment(this.myPvData.meeting_next_date_date).format("dddd LL") : "";
    }
  },
  methods: {
    allowedStep: m => m % 5 === 0
  }
};
</script>
