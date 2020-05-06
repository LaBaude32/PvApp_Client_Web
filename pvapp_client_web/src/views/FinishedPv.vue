<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <p class="text-uppercase">Opération :</p>
          <v-divider />
          <p>{{}}</p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers v-if="meeting_type" :users="pvUsers" :headers="UserHeaders" :data="UserData" />
    <v-divider class="my-10" />
    <finishedPvItems v-if="meeting_type" :items="items" />
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
      UserData: [
        {
          name: "Frozen Yogurt",
          category: "Ice cream"
        },
        {
          name: "Ice cream sandwich",
          category: "Ice cream"
        },
        {
          name: "Eclair",
          category: "Cookie"
        },
        {
          name: "Cupcake",
          category: "Pastry"
        },
        {
          name: "Gingerbread",
          category: "Cookie"
        },
        {
          name: "Jelly bean",
          category: "Candy"
        },
        {
          name: "Lollipop",
          category: "Candy"
        },
        {
          name: "Honeycomb",
          category: "Toffee"
        },
        {
          name: "Donut",
          category: "Pastry"
        },
        {
          name: "KitKat",
          category: "Candy"
        }
      ]
    };
  },
  mounted() {
    this.getData();
  },

  methods: {
    async getData() {
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
      // if (this.meeting_type == "Chantier") {
      //   this.headers.splice(1, 0, { text: "Lot", value: "lots" });
      // }
    }
  }
};
</script>
