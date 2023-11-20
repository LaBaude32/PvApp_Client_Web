<template>
  <div class="mb-10">
    <v-container>
      <v-row>
        <v-col v-if="!isPrinted" cols="12" class="d-flex">
          <v-spacer />
          <v-btn class="mr-16" color="success" x-large @click.prevent="print">Imprimer</v-btn>
        </v-col>
        <v-col cols="12">
          <p class="text-uppercase text-h4">Opération :</p>
          <v-divider />
          <p class="mt-2 text-h5">{{ affairInfos.name }}</p>
          <v-divider />
          <p class="mt-2 text-subtitle-1-1">{{ affairInfos.description }}</p>
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
          <p class="text-uppercase mt-2 text-h6">
            PV de la réunion de {{ meetingType }} n°{{ pvDetails.pvNumber }} du {{ pvDetails.meetingDate | formatDateWithA }}
            <span v-if="pvDetails.meetingPlace">, {{ pvDetails.meetingPlace }}</span>
          </p>
          <p v-if="pvDetails.meetingNextDate" class="red--text text-h6">
            Prochaine réunion : le {{ pvDetails.meetingNextDate | formatDateWithA }}, {{ pvDetails.meetingNextPlace }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers v-if="meetingType" :users="pvUsers" :headers="UserHeaders" groupBy="userGroup" />
    <v-container>
      <v-divider class="my-10" />
    </v-container>
    <finishedPvItems v-if="meetingType" :items="items" :headers="ItemHeaders" sortBy="position" />
    <v-container>
      <v-divider class="my-10" />
      <div v-if="pvDetails.meetingNextDate">
        <p class="text-uppercase">Prochaine réunion : le {{ pvDetails.meetingNextDate | formatDateWithA }}</p>
        <p class="font-italic body-2">Présence vivement souhaitée des intervenants conviés (cf. tableaux). Merci.</p>
      </div>
      <p>Fait et diffusé le {{ pvDetails.releaseDate | formatDateWithA }}</p>
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
      isPrinted: false,
      test1: "hello1",
      test4: "hello4",
      affairInfos: {},
      items: [],
      pvDetails: {},
      meetingType: undefined,
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
        { text: "Statut", value: "statusPAE" }
      ],
      ItemHeaders: [
        {
          text: "Position",
          align: "center",
          value: "position"
        },
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "followUp", sortable: false },
        { text: "Ressource", value: "resources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completionDate" }
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
          pvId: this.$route.params.id
        }
      };
      let res = await Axios.get("pvs/pvId/released", dt);
      if (res.status == 200) {
        if (res.data.items) {
          this.items = [...res.data.items];
        }
      }
      this.pvDetails = res.data.pv;
      this.pvUsers = res.data.users;
      this.meetingType = res.data.pv.affairMeetingType;
      this.owner = res.data.owner;
      if (this.meetingType == "Chantier") {
        this.ItemHeaders.splice(1, 0, { text: "Lot", value: "lots" });
      }
      this.affairInfos = res.data.affair.affairInfos;

      this.pvUsers.forEach((element) => {
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
      this.isPrinted = true;
      setTimeout(function () {
        window.print();
      }, 200);
    }
  }
};
</script>
