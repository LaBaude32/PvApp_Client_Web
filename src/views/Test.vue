<template>
  <v-form v-model="valid" ref="form">
    <v-container>
      <v-row>
        <v-col cols="6" sm="6">
          <v-menu
            ref="menux"
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
              @click:minute="$refs.menux.save(meeting_next_date_time)"
              :allowed-minutes="allowedStep"
            ></v-time-picker>
          </v-menu>
        </v-col>
        <v-col cols="6" sm="6">
          <v-menu
            ref="menu"
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
                label="Heure de la prochaine réunion"
                prepend-icon="mdi-clock-outline"
                readonly
                v-on="on"
                clearable
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menu2"
              v-model="meeting_date_time"
              format="24hr"
              full-width
              @click:minute="$refs.menu.save(meeting_date_time)"
              :allowed-minutes="allowedStep"
            ></v-time-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>
    <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
      Valider
    </v-btn>
  </v-form>
</template>

<script>
import Axios from "axios";
import moment from "moment";
import { mapState } from "vuex";
import routesCONST, { getRouteName } from "../utilities/constantes";

export default {
  data() {
    return {
      valid: false,
      menu2: false,
      menu4: false,
      meeting_date_time: "",
      meeting_next_date_time: ""
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
