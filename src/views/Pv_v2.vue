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
    <Pv-v2
      v-if="meetingType"
      :dialog.sync="dialog"
      :pvDetails="pvDetails"
      :pvUsers="pvUsers"
      :items.sync="items"
      :meetingType="meetingType"
      :headers="headers"
      :valid.sync="valid"
      :standardRequirement="standardRequirement"
      :editedIndex.sync="editedIndex"
      :editedItem.sync="editedItem"
      :defaultItem="defaultItem"
      :formTitle="formTitle"
      :formatedCompletionDate.sync="formatedCompletionDate"
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

    <Users v-if="pvUsers" :users="pvUsers" :connectedParticipants="pvConnectedParticipants" />

    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>
  </div>
</template>

<script>
import Pv_v2 from "@/components/Pv_v2.vue";
import Users from "@/components/Users.vue";
import ModalValidation from "@/components/ModalValidation.vue";
import Axios from "axios";
import { getRouteName } from "../utilities/constantes";
import { mapGetters } from "vuex";
import { DateTime, Settings } from "luxon";
Settings.defaultLocale = "fr";

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
      standardRequirement: [(v) => !!v || "Requis"],
      pvDetails: {},
      pvUsers: [],
      pvConnectedParticipants: [],
      items: [],
      newImage: "lala",
      headers: [
        {
          text: "Position",
          align: "center",
          value: "position"
        },
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "followUp", sortable: false },
        { text: "Ressource", value: "resources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completionDate" },
        { text: "Visible", value: "visible" },
        { text: "Photo", value: "image" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        position: "",
        lotsToReturn: [],
        lots: [],
        note: "",
        followUp: "",
        resources: "",
        completion: [],
        completionToReturn: "",
        completionDate: "",
        completionDateDate: "",
        completionDateTime: "",
        image: null,
        visible: 1,
        isImageChange: false
      },
      defaultItem: {
        position: "",
        lotsToReturn: [],
        lots: [],
        note: null,
        followUp: null,
        resources: null,
        completion: ["A faire", "Urgent", "Fait"],
        completionDate: "",
        completionDateDate: "",
        completionDateTime: "",
        image: null,
        visible: 1,
        isImageChange: false
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
    formatedCompletionDate: {
      get() {
        return this.editedItem.completionDate ? DateTime.fromSQL(this.editedItem.completionDate).toFormat("yyyy-LL-dd") : "";
      },
      set(val) {
        this.editedItem.completionDate = DateTime.fromSQL(val).toFormat("yyyy-LL-dd");
      }
    },
    computedDateFormattedCompletion() {
      return this.editedItem.completionDate ? DateTime.fromSQL(this.editedItem.completionDate).toFormat("ccc d LLL yyyy") : "";
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
      this.editedItem.isImageChange = false;

      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes-vous sûr de vouloir supprimer cet item?") &&
        Axios.delete("items/itemId", { params: { itemId: item.itemId, pvId: this.pvId } })
          .then((response) => {
            if (response.status == 204) {
              this.$store.dispatch("notification/success", "L'item à bien été supprimé");
              this.items.splice(index, 1);
            }
          })
          .catch((error) => {
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
      if (this.editedItem.completionDate == "" || this.editedItem.completionDate == "Invalid date") {
        this.editedItem.completionDate = null;
      }

      const fd = new FormData();
      fd.append("position", this.editedItem.position);
      fd.append("note", this.editedItem.note);
      fd.append("followUp", this.editedItem.followUp);
      fd.append("resources", this.editedItem.resources);
      fd.append("completion", this.editedItem.completionToReturn);
      fd.append("completionDate", this.editedItem.completionDate);
      fd.append("image", this.editedItem.image);
      fd.append("thumbnail", null);
      fd.append("visible", this.editedItem.visible);
      fd.append("lots", null);
      fd.append("pvId", this.pvId);

      if (this.meetingType == "Chantier" && this.editedItem.lotsToReturn) {
        let lotTransit = [];
        this.editedItem.lotsToReturn.forEach((element) => {
          lotTransit.push(element.lotId);
        });
        fd.set("lots", lotTransit);
      }

      if (this.editedIndex > -1) {
        //EXISTING ITEM
        fd.append("itemId", this.editedItem.itemId);
        this.updateItem(fd);
      } else {
        //NEW ITEM
        this.postItem(fd);
      }
      this.editedItem = { ...this.defaultItem };
    },

    postItem(fd) {
      Axios.post("/items", fd)
        .then((response) => {
          if (response.status == 201) {
            let newItem = response.data;
            newItem.visible == 1 ? (newItem.visible = true) : (newItem.visible = false);
            this.items.push(newItem);
            this.close();
            this.$store.dispatch("notification/success", "Ajout de l'item effectué");
          } else {
            console.log(response);
            console.log(typeof response.data.itemId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async updateItem(fd) {
      //Upload new image
      if (this.editedItem.image != null && this.editedItem.isImageChange == true) {
        const fdImage = new FormData();
        fdImage.append("itemId", this.editedItem.itemId);
        fdImage.append("image", this.editedItem.image);
        const res = await Axios.post("items/updateImage", fdImage);
        fd.set("image", res.data.image);
      }

      let data = {};
      fd.forEach((value, key) => (data[key] = value));
      for (const iterator in data) {
        if (data[iterator] == "null") {
          data[iterator] = null;
        }
      }

      Axios.put("items/itemId", data)
        .then((response) => {
          if (response.status == 200) {
            let itemUpdated = response.data;
            itemUpdated.visible == 1 ? (itemUpdated.visible = true) : (itemUpdated.visible = false);
            Object.assign(this.items[this.editedIndex], itemUpdated);
            this.editedItem.completion = [];
            this.close();
            this.$store.dispatch("notification/success", "Mise à jour de l'item effectué");
          } else {
            console.log(response);
            console.log(typeof response.data.itemId);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    maxPosition() {
      return Math.max(...this.items.map((items) => items.position)) + 1;
    },

    changeVisible(item) {
      let data = {
        itemId: item.itemId,
        visible: item.visible
      };
      Axios.put("items/itemId/visibility", data)
        .then((response) => {
          if (response.status == 200) {
            this.$store.dispatch("notification/success", "L'item a été mis à jour");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    pvValidation() {
      Axios.put("pvs/pvId/validation", { pvId: this.pvId })
        .then((response) => {
          if (response.status == 204) {
            this.$router.push({ name: getRouteName("finishedPv"), params: { id: this.pvId } });
            this.ModalValidationDialog = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    returnToAffair() {
      this.$router.push({ name: getRouteName("affair"), params: { id: this.pvDetails.affairId } });
    }
  }
};
</script>
