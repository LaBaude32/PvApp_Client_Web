<template>
  <div>
    <Pv-v2
      v-if="meeting_type"
      :dialog.sync="dialog"
      :pvDetails="pvDetails"
      :pvUsers="pvUsers"
      :items.sync="items"
      :meeting_type="meeting_type"
      :headers="headers"
      :valid.sync="valid"
      :standardRequirement="standardRequirement"
      :editedIndex.sync="editedIndex"
      :editedItem.sync="editedItem"
      :defaultItem="defaultItem"
      :formTitle="formTitle"
      :formatedCompletion_date.sync="formatedCompletion_date"
      :computedDateFormattedCompletion="computedDateFormattedCompletion"
      :editItem="editItem"
      :deleteItem="deleteItem"
      :close="close"
      :save="save"
      :maxPosition="maxPosition"
      :changeVisible="changeVisible"
    />
    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>

    <v-divider class="my-10"></v-divider>

    <Users v-if="pvUsers" :users="pvUsers" />

    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>
  </div>
</template>

<script>
import moment from "moment";
import Pv_v2 from "@/components/Pv_v2.vue";
import Users from "@/components/Users.vue";
import Axios from "axios";
export default {
  components: {
    "Pv-v2": Pv_v2,
    Users
  },
  data() {
    return {
      dialog: false,
      valid: false,
      meeting_type: undefined,
      standardRequirement: [v => !!v || "Requis"],
      pvDetails: {},
      pvUsers: [],
      items: [],
      headers: [
        {
          text: "Position",
          align: "center",
          value: "position"
        },
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "follow_up", sortable: false },
        { text: "Ressource", value: "ressources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completion_date" },
        { text: "Visible", value: "visible" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        position: "",
        lotsToReturn: [],
        lots: [],
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        completion: [],
        completionToReturn: "",
        completion_date: "",
        completion_date_date: "",
        completion_date_time: "",
        visible: ""
      },
      defaultItem: {
        position: "",
        lotsToReturn: [],
        lots: [],
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        completion: ["A faire", "Urgent", "Fait"],
        completion_date: "",
        completion_date_date: "",
        completion_date_time: "",
        visible: true
      }
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    },
    formatedCompletion_date: {
      get() {
        return this.editedItem.completion_date ? moment(this.editedItem.completion_date).format("YYYY-MM-DD") : "";
      },
      set(val) {
        this.editedItem.completion_date = moment(val).format("YYYY-MM-DD");
      }
    },
    computedDateFormattedCompletion() {
      return this.editedItem.completion_date ? moment(this.editedItem.completion_date).format("ddd Do MMM YYYY") : "";
    }
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
      if (this.meeting_type == "Chantier") {
        this.headers.splice(1, 0, { text: "Lot", value: "lots" });
      }
      this.$store.dispatch("affair/loadAffairByPv", this.pvDetails.affair_id);
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = { ...item };
      this.editedItem.lotsToReturn = item.lots;
      this.editedItem.lots = this.pvDetails.lots;
      this.editedItem.completionToReturn = item.completion;
      this.editedItem.completion = [item.completion];
      this.editedItem.completion.push(...this.defaultItem.completion);

      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cet item ?") && this.items.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
    },

    save() {
      this.editedItem.lots = this.editedItem.lotsToReturn;
      this.editedItem.completion_date += " 00:00:00";
      let data;
      data = { ...this.editedItem };
      data.completion = data.completionToReturn;
      // data.completion_date += " 00:00:00";
      if (data.visible == true) {
        data.visible = 1;
      } else {
        data.visible = 0;
      }

      if (this.editedIndex > -1) {
        //Existing item
        Axios.post("/updateItem", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_item_updated === "number") {
              Object.assign(this.items[this.editedIndex], data);
              // this.items[this.editedIndex] = { ...data };
              this.editedItem.completion = [];
              this.close();
            } else {
              console.log(response);
              console.log(typeof response.data.id_item);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //New item
        data.pv_id = this.$route.params.id;
        data.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        Axios.post("/addItem", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_item === "number") {
              this.items.push(data);
              this.editedItem.completion = [];
              this.close();
            } else {
              console.log(response);
              console.log(typeof response.data.id_item);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    maxPosition() {
      return Math.max(...this.items.map(items => items.position)) + 1;
    },

    changeVisible(item) {
      let data = {
        id_item: item.id_item,
        visible: item.visible == true ? 1 : 0
      };
      Axios.post("/updateVisibleOfItem", data).catch(error => {
        console.log(error);
        item.visible = !item.visible;
      });
    }
  }
};
</script>
