<template>
  <div class="mb-10">
    <v-container>
      <v-row>
        <v-col cols="12" class="d-flex">
          <v-spacer />
          <v-btn class="mr-10" color="success" x-large @click.prevent="print">Imprimer</v-btn>
        </v-col>
        <v-col cols="12">
          <p class="text-uppercase display-1">Opération :</p>
          <v-divider />
          <p class="mt-2 headline">{{ affairInfos.name }}</p>
          <v-divider />
          <p class="mt-2 subtitle-1">{{ affairInfos.description }}</p>
          <v-row v-if="maitreDOuvrage">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'ouvrage :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitreDOuvrage }}</p>
            </v-col>
          </v-row>
          <v-row v-if="maitresDOeuvre">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'oeuvre :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitresDOeuvre }}</p>
            </v-col>
          </v-row>
          <v-divider />
          <p class="text-uppercase mt-2 title">
            PV de la réunion de {{ meeting_type }} n°{{ pvDetails.pv_number }} du {{ pvDetails.meeting_date | formatDateWithA }}
            <span v-if="pvDetails.meeting_place">, {{ pvDetails.meeting_place }}</span>
          </p>
          <p v-if="pvDetails.meeting_next_date" class="red--text title">
            Prochaine réunion : le {{ pvDetails.meeting_next_date | formatDateWithA }}, {{ pvDetails.meeting_next_place }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers v-if="meeting_type" :users="pvUsers" :headers="UserHeaders" groupBy="userGroup" />
    <v-container>
      <v-divider class="my-10" />
    </v-container>
    <finishedPvItems v-if="meeting_type" :items="items" :headers="ItemHeaders" sortBy="position" />
    <v-container>
      <v-divider class="my-10" />
      <div v-if="pvDetails.meeting_next_date">
        <p class="text-uppercase">Prochaine réunion : le {{ pvDetails.meeting_next_date | formatDateWithA }}</p>
        <p class="font-italic body-2">Présence vivement souhaitée des intervenants conviés (cf. tableaux). Merci.</p>
      </div>
      <p>Fait et diffusé le {{ pvDetails.release_date | formatDateWithA }}</p>
      <p>{{ owner.firstName }} {{ owner.lastName }}</p>
    </v-container>
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
      owner: {},
      maitresDOeuvre: "",
      maitreDOuvrage: "",
      UserHeaders: [
        {
          text: "Prénom Nom",
          align: "start",
          value: "fullName"
        },
        {
          text: "Groupe",
          value: "userGroup"
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
      let res = await Axios.get("getPvReleasedDetails", dt);
      if (typeof res.data.items !== "string") {
        this.items = [...res.data.items];
      }
      this.pvDetails = res.data.pv_details;
      this.pvUsers = res.data.users;
      this.meeting_type = res.data.pv_details.affair_meeting_type;
      this.owner = res.data.owner;
      if (this.meeting_type == "Chantier") {
        this.ItemHeaders.splice(1, 0, { text: "Lot", value: "lots" });
      }
      this.affairInfos = res.data.affair.affair_infos;

      this.pvUsers.forEach(element => {
        if (element.userGroup == "Maîtrise d'oeuvre") {
          if (this.maitresDOeuvre == "") {
            this.maitresDOeuvre = element.organism;
          } else {
            this.maitresDOeuvre += " - " + element.organism;
          }
        }
        if (element.userGroup == "Maîtrise d'ouvrage") {
          if (this.maitreDOuvrage == "") {
            this.maitreDOuvrage = element.organism;
          } else {
            this.maitreDOuvrage += " - " + element.organism;
          }
        }
      });
    },
    print() {
      window.print();
    }
  }
};
</script>
