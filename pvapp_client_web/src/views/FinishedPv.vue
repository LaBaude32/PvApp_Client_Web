<template>
  <div class="mb-10">
    <v-container>
      <v-row>
        <v-col cols="12">
          <p class="text-uppercase">Opération :</p>
          <v-divider />
          <p>{{ affairInfos.name }}</p>
          <v-divider />
          <p>{{}}</p>
          <v-row>
            <v-col cols="6">
              <p class="text-uppercase text-left">Maitre d'ouvrage :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-uppercase text-right">{{}}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <p class="text-uppercase text-left">Maitre d'oeuvre :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-uppercase text-right">{{}}</p>
            </v-col>
          </v-row>
          <v-divider />
          <p>
            PV de la réunion de {{ meeting_type }} n°{{ test1 }} du {{ pvDetails.meeting_date | formatDate }}
            <span v-if="pvDetails.meeting_place != 'Indéfini'">, en {{ pvDetails.meeting_place }}</span>
          </p>
          <p v-if="pvDetails.meeting_next_place">
            Prochaine réunion : le {{ pvDetails.meeting_next_date | formatDate }} en {{ pvDetails.meeting_next_place }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers v-if="meeting_type" :users="pvUsers" :headers="UserHeaders" groupBy="userGroup" />
    <v-divider class="my-10" />
    <finishedPvItems v-if="meeting_type" :items="items" :headers="ItemHeaders" sortBy="position" />
  </div>
</template>

<script>
import finishedPvItems from "@/components/FinishedPvItems.vue";
import finishedPvUsers from "@/components/FinishedPvUsers.vue";
import Axios from "axios";
export default {
  components: {
    finishedPvUsers,
    finishedPvItems
  },
  data() {
    return {
      test1: "hello1",
      test4: "hello4",
      affairInfos: {},
      items: [],
      pvDetails: {},
      meeting_type: undefined,
      pvUsers: [],
      UserHeaders: [
        {
          text: "Prénom Nom",
          align: "start",
          value: "fullName"
        },
        {
          text: "Groupe",
          value: "userGroup",
          sortable: false
        },
        { text: "Fonction", value: "function" },
        { text: "Organisme", value: "organism" },
        { text: "Mail", value: "email", sortable: false },
        { text: "Téléphone", value: "phone", sortable: false },
        { text: "Statut", value: "status_PAE" }
      ],
      ItemHeaders: [
        {
          text: "Position",
          align: "center",
          value: "position"
        },
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "follow_up", sortable: false },
        { text: "Ressource", value: "ressources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completion_date" }
      ]
    };
  },
  mounted() {
    this.getPvData();
  },

  methods: {
    async getPvData() {
      this.idPv = this.$route.params.id;
      let dt = {
        params: {
          id_pv: this.$route.params.id
        }
      };
      let res = await Axios.get("getPvDetails", dt);
      if (typeof res.data.items !== "string") {
        this.items = [...res.data.items];
      }
      this.pvDetails = res.data.pv_details;
      this.pvUsers = res.data.users;
      this.meeting_type = res.data.pv_details.affair_meeting_type;
      if (this.meeting_type == "Chantier") {
        this.ItemHeaders.splice(1, 0, { text: "Lot", value: "lots" });
      }
      Axios.get("getAffairById", { params: { id_affair: this.pvDetails.affair_id } })
        .then(response => {
          this.affairInfos = response.data.affair_infos;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
