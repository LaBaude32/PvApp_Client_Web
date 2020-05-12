<template>
  <div>
    <v-form v-model="valid" ref="form" v-if="affairs != ''">
      <v-container>
        <v-row>
          <v-col cols="6" lg="6">
            <v-menu v-model="menu1" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMeetingDate"
                  label="Jour de la réunion"
                  readonly
                  v-on="on"
                  @click:clear="meeting_date_date = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="meeting_date_date" @change="menu1 = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu
              ref="menuRef2"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="meeting_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="meeting_date_time"
                  label="Heure de la réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="meeting_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menuRef2.save(meeting_date_time)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="meeting_place" counter label="Lieu de la réunion" :rules="addressRules"></v-text-field>
          </v-col>

          <v-col cols="6" lg="6">
            <v-menu v-model="menu3" :close-on-content-click="false" max-width="290">
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMeetingNextDate"
                  clearable
                  label="Jour de la prochaine réunion"
                  readonly
                  v-on="on"
                  @click:clear="meeting_next_date_date = null"
                  prepend-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-date-picker v-model="meeting_next_date_date" @change="menu3 = false" locale="fr-fr"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="6">
            <v-menu
              ref="menu"
              v-model="menu4"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="meeting_next_date_time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="meeting_next_date_time"
                  label="Heure de la prochaine réunion"
                  prepend-icon="mdi-clock-outline"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu4"
                v-model="meeting_next_date_time"
                format="24hr"
                full-width
                @click:minute="$refs.menu.save(meeting_next_date_time)"
                :allowed-minutes="allowedStep"
              ></v-time-picker>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <v-text-field v-model="meeting_next_place" counter label="Lieu de la prochaine réunion"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="state" :label="state" role="switch" false-value="En cours" true-value="Terminé"></v-switch>
          </v-col>
          <v-col cols="12">
            <v-combobox
              v-model="affair_id"
              :items="affairs"
              item-text="name"
              item-value="id_affair"
              label="Affaire"
              :rules="affairRules"
            ></v-combobox>
          </v-col>
        </v-row>
      </v-container>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
        Valider
      </v-btn>
    </v-form>
    <div v-else>
      <v-row justify="center">
        <v-alert type="warning" border="top" prominent class="pa-10">
          Vous n'avez pas encore d'affaire <br />
          Veuillez commancer par en créer une
        </v-alert>
      </v-row>
      <v-row justify="center">
        <v-btn color="success darken-1" dark @click="createAffair"> <v-icon left>mdi-pencil</v-icon>Créer une affaire </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import moment from "moment";
import { mapState } from "vuex";
import routesCONST, { getRouteName } from "../utilities/constantes";
// import DateTimePicker from "@/components/DateTimePicker.vue";

export default {
  // components: {
  //   DateTimePicker
  // },
  data() {
    return {
      dialog: false,
      valid: false,
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      meeting_date_date: new Date().toISOString().substr(0, 10),
      meeting_date_time:
        moment()
          .format("LT")
          .substr(0, 2) + ":00",
      meeting_next_date_date: "",
      meeting_next_date_time: "",
      meeting_next_date: "",
      meeting_date: "",
      affairs: [],
      state: "En cours",
      meeting_place: "",
      meeting_next_place: "",
      affair_id: "",
      affairRules: [v => !!v || "Requis"],
      addressRules: [v => !!v || "Requis", v => (v && v.length >= 10) || "Doit être supérieur à 10 caractères"]
    };
  },
  methods: {
    createAffair() {
      this.$router.push(getRouteName("addAffair"));
    },
    validate() {
      if (this.meeting_next_date_date == "empty string") {
        this.meeting_next_date = this.meeting_next_date_date + " " + this.meeting_next_date_time + ":00";
      } else {
        this.meeting_next_date = null;
      }
      let pvData = {
        meeting_date: this.meeting_date_date + " " + this.meeting_date_time + ":00",
        meeting_place: this.meeting_place,
        meeting_next_date: this.meeting_next_date,
        meeting_next_place: this.meeting_next_place,
        state: this.state,
        affair_id: this.affair_id.id_affair
      };
      console.log(pvData);
      Axios.post("addPv", pvData)
        .then(response => {
          let pvId = response.data.id_pv;
          this.$router.push({
            name: routesCONST.pv.name,
            params: { id: pvId }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    allowedStep: m => m % 5 === 0
  },
  mounted() {
    let self = this;
    const dtAffairs = {
      params: {
        user_id: this.userId
      }
    };
    if (typeof this.userId != undefined) {
      Axios.get("getAffairsByUserId", dtAffairs)
        .then(function(response) {
          // handle success
          self.affairs = response.data;
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    } else {
      this.$store.dispatch("auth/authLogout");
    }
  },
  computed: {
    ...mapState("user", {
      userId: "userId"
    }),
    computedDateFormattedMeetingDate() {
      return this.meeting_date_date ? moment(this.meeting_date_date).format("dddd LL") : "";
    },
    computedDateFormattedMeetingNextDate() {
      return this.meeting_next_date_date ? moment(this.meeting_next_date_date).format("dddd LL") : "";
    }
  }
};
</script>
