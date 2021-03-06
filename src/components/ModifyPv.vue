<template>
  <v-card class="pa-2 pb-3">
    <v-card-title v-if="modifyingType">Modifier le PV du {{ myPvData.meeting_date | formatDateWithA }}</v-card-title>
    <v-card-title v-else>Nouveau procès verbal</v-card-title>
    <!-- {{ myPvData }} -->
    <v-form v-model="valid" ref="form">
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-menu v-model="meetingDateDateMenu" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field :value="meetingDate" label="Jour de la réunion" readonly v-on="on" prepend-icon="mdi-calendar"></v-text-field>
              </template>
              <v-date-picker v-model="myMeeting_date_date" @change="meetingDateDateMenu = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6"
            ><v-menu
              ref="menuRef1"
              v-model="meetingDateTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="myMeeting_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="myMeeting_date_time"
                  label="Heure de la réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingDateTimeMenu"
                v-model="myMeeting_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef1.save(myMeeting_date_time)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="myPvData.meeting_place" counter clearable label="Lieu de la réunion" :rules="addressRules"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-menu v-model="meetingNextDateDateMenu" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="myMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-on="on"
                  @click:clear="myMeeting_next_date_date = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="myMeeting_next_date_date" @change="meetingNextDateDateMenu = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6">
            <v-menu
              ref="menuRef2"
              v-model="meetingNextDateTimeMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="myMeeting_next_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="myMeeting_next_date_time"
                  label="Heure de la prochaine réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                  clearable
                  @click:clear="myMeeting_next_date_time = null"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="meetingNextDateTimeMenu"
                v-model="myMeeting_next_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef2.save(myMeeting_next_date_time)"
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
          <v-col cols="12" v-if="!myPvData.affair_id">
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
        <v-btn v-if="!modifyingType" color="error" @click.prevent="cancel">Annuler</v-btn>
        <v-btn :disabled="!valid" color="success" class="mr-4" @click.prevent="validate">
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
    meetingDate: String,
    meetingNextDate: String,
    meeting_date_date: String,
    meeting_date_time: String,
    meeting_next_date_date: String,
    meeting_next_date_time: String,
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
      addressRules: [v => v.length >= 3 || "Doit être supérieur à 3 caractères"],
      affairRules: [v => !!v || "Requis"]
    };
  },
  computed: {
    myMeeting_date_date: {
      get() {
        return this.meeting_date_date;
      },
      set(val) {
        this.$emit("update:meeting_date_date", val);
      }
    },
    myMeeting_date_time: {
      get() {
        return this.meeting_date_time;
      },
      set(val) {
        this.$emit("update:meeting_date_time", val);
      }
    },
    myMeeting_next_date_date: {
      get() {
        return this.meeting_next_date_date;
      },
      set(val) {
        this.$emit("update:meeting_next_date_date", val);
      }
    },
    myMeeting_next_date_time: {
      get() {
        return this.meeting_next_date_time;
      },
      set(val) {
        this.$emit("update:meeting_next_date_time", val);
      }
    },

    myMeetingDate: {
      get() {
        return this.meetingDate;
      },
      set(val) {
        this.$emit("update:meetingDate", val);
      }
    },
    myMeetingNextDate: {
      get() {
        return this.meetingNextDate;
      },
      set(val) {
        this.$emit("update:meetingNextDate", val);
      }
    },
    computedDateFormattedMeetingDate() {
      return this.myMeeting_date_date ? moment(this.myPvData.myMeeting_date_date).format("dddd LL") : "";
    },
    computedDateFormattedMeetingNextDate() {
      return this.myPvData.meeting_next_date_date ? moment(this.myPvData.meeting_next_date_date).format("dddd LL") : "";
    }
  },
  methods: {
    allowedStep: m => m % 5 === 0
  }
};
</script>
