<template>
  <div>
    <ModalValidation :dialog.sync="ModalValidationDialog" :validate="pvValidation" />
    <v-container class="pt-0">
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn @click="returnToAffair">Revenir à l'affaire</v-btn>
          <v-btn color="primary" @click="ModalValidationDialog = true">Finaliser et diffuser le PV</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="mb-10"></v-divider>
    <Pv-v2 v-if="meetingType" :dialog.sync="dialog" :pvDetails="pvDetails" :pvUsers="pvUsers" :items.sync="items"
      :meetingType="meetingType" :headers="headers" :valid.sync="valid" :standardRequirement="standardRequirement"
      :editedIndex.sync="editedIndex" :editedItem.sync="editedItem" :defaultItem="defaultItem" :formTitle="formTitle"
      :formatedCompletion_date.sync="formatedCompletion_date"
      :computedDateFormattedCompletion="computedDateFormattedCompletion" :editItem="editItem" :deleteItem="deleteItem"
      :close="close" :save="save" :maxPosition="maxPosition" :changeVisible="changeVisible" />
    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>

    <v-divider class="my-10"></v-divider>

    <Users v-if="pvUsers" :users="pvUsers" :connectedParticipants="pvConnectedParticipants" />

    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>
  </div>
</template>

<script>
import moment from "moment";
import Pv_v2 from "@/components/Pv_v2.vue";
import Users from "@/components/Users.vue";
import ModalValidation from "@/components/ModalValidation.vue";
import Axios from "axios";
import { getRouteName } from "../utilities/constantes";
import { mapGetters } from "vuex";

export default {
  components: {
    "Pv-v2": Pv_v2,
    Users,
    ModalValidation
  },
  data() {
    return {
      pvId: Number,
      dialog: false,
      ModalValidationDialog: false,
      valid: false,
      meetingType: undefined,
      standardRequirement: [v => !!v || "Requis"],
      pvDetails: {},
      pvUsers: [],
      pvConnectedParticipants: [],
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
    ...mapGetters("user", {
      userId: "userId"
    }),
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
      this.pvId = this.$route.params.id;
      let dt = {
        params: {
          pvId: this.pvId,
          userId: this.userId
        }
      };
      let res = await Axios.get("pvs/pvId", dt);
      if (res.data.items) {
        this.items = [...res.data.items];
      }
      this.pvDetails = res.data.pv;
      this.pvUsers = res.data.users;
      this.pvConnectedParticipants = res.data.connectedParticipants;
      this.meetingType = res.data.pv.affairMeetingType;
      if (this.meetingType == "Chantier") {
        this.headers.splice(1, 0, { text: "Lot", value: "lots" });
        this.defaultItem.lots = this.pvDetails.lots;
      }
      this.$store.dispatch("affair/loadAffairByPv", this.pvDetails.affairId);
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
      confirm("Etes-vous sûr de vouloir supprimer cet item?") &&
        Axios.delete("deleteItemHasPv", { params: { id_item: item.id_item, pvId: this.pvId } })
          .then(response => {
            if (response.data == "success") {
              this.$store.dispatch("notification/success", "L'item à bien été supprimé");
              this.items.splice(index, 1);
            }
          })
          .catch(error => {
            this.$store.dispatch("notification/error", `Erreur : l'item n'a pas été supprimé en base de donnée. ${error}`);
          });
    },

    close() {
      this.dialog = false;
      this.editedItem = { ...this.defaultItem };
      this.editedIndex = -1;
    },

    save() {
      this.editedItem.lots = this.editedItem.lotsToReturn;
      // if (this.editedItem.completion_date != "" && this.editedItem.completion_date.lenght < 12) {
      //   this.editedItem.completion_date += " 00:00:00";
      // } else if (this.editedItem.completion_date == "" || this.editedItem.completion_date == "Invalid date") {
      //   this.editedItem.completion_date = null;
      // }
      if (this.editedItem.completion_date == "" || this.editedItem.completion_date == "Invalid date") {
        this.editedItem.completion_date = null;
      }
      // this.editedItem.completion = this.editedItem.completionToReturn;
      let data;
      data = { ...this.editedItem };
      data.completion = data.completionToReturn;
      if (this.meetingType == "Chantier" && data.lots) {
        let lotTransit = [];
        data.lots.forEach(element => {
          lotTransit.push(element.id_lot);
        });
        data.lots = lotTransit;
        console.log(data.lots);
      }
      if (data.visible == true) {
        data.visible = 1;
      } else {
        data.visible = 0;
      }

      if (this.editedIndex > -1) {
        //Existing item
        Axios.post("/updateItem", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.item_updated.id_item === "number") {
              this.editedItem.completion = this.editedItem.completionToReturn;
              Object.assign(this.items[this.editedIndex], this.editedItem);
              // this.items[this.editedIndex] = { ...data };
              this.editedItem.completion = [];
              this.close();
              this.$store.dispatch("notification/success", "Mise à jour de l'item effectué");
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
        data.pv_id = this.pvId;
        data.created_at = moment().format("YYYY-MM-DD HH:mm:ss");
        Axios.post("/addItem", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_item === "number") {
              data.id_item = response.data.id_item;
              data.lots = this.editedItem.lots;
              this.items.push(data);
              this.editedItem.completion = [];
              this.close();
              this.$store.dispatch("notification/success", "Ajout de l'item effectué");
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
      Axios.post("/updateVisibleOfItem", data)
        .then(response => {
          if (response.data.id_item_updated) {
            this.$store.dispatch("notification/success", "L'item a été mis à jour");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    pvValidation() {
      Axios.post("validatePv", { pvId: this.pvId })
        .then(response => {
          if (response.data == "success") {
            this.$router.push({ name: getRouteName("finishedPv"), params: { id: this.pvId } });
            this.ModalValidationDialog = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    returnToAffair() {
      this.$router.push({ name: getRouteName("affair"), params: { id: this.pvDetails.affairId } });
    }
  }
};
</script>
