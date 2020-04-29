<template>
  <Pv-v2
    v-if="meeting_type"
    test="hello"
    :dialog.sync="dialog"
    :pvDetails="pvDetails"
    :pvUsers="pvUsers"
    :items="items"
    :meeting_type="meeting_type"
    :headers="headers"
    :valid.sync="valid"
    :standardRequirement="standardRequirement"
    :editedIndex.sync="editedIndex"
    :editedItem.sync="editedItem"
    :defaultItem="defaultItem"
    :formTitle="formTitle"
    :editItem="editItem"
    :deleteItem="deleteItem"
    :close="close"
    :save="save"
    :checkMeetingType="checkMeetingType"
    :maxPosition="maxPosition"
    :changeVisible="changeVisible"
  />
  <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>
</template>

<script>
import Pv_v2 from "@/components/Pv_v2.vue";
import { mapGetters } from "vuex";
import Axios from "axios";
export default {
  components: {
    "Pv-v2": Pv_v2
  },
  data() {
    return {
      dialog: false,
      valid: false,
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
        completion: "",
        completionToReturn: "",
        completion_date: "",
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
        visible: true
      }
    };
  },

  computed: {
    ...mapGetters("affair", {
      meeting_type: "meeting_type"
    }),
    formTitle() {
      //TODO: Retirer ça d'ici
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
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
        this.items = res.data.items;
      }
      this.pvDetails = res.data.pv_details;
      this.pvUsers = res.data.users;
      this.$store.dispatch("affair/loadAffairByPv", this.pvDetails.affair_id);

      //TODO: SESSION Sinon passer le tableau en propriété si on le met dans un composant
      //SESSION peut on rendre le store sychrone ? Avec des promesses ?
    },

    editItem(item) {
      console.log(item);
      console.log(this.editedItem.completion);

      this.editedIndex = this.items.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      this.editedItem = {
        ...item
      };
      this.editedItem.lotsToReturn = item.lots;
      this.editedItem.lots = this.pvDetails.lots;
      this.editedItem.completionToReturn = item.completion;
      this.editedItem.completion = [item.completion];
      this.editedItem.completion.push(...this.defaultItem.completion);
      console.log(this.editedItem);

      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cet item ?") && this.items.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        // this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      this.editedItem.lots = this.editedItem.lotsToReturn;
      let data;
      data = this.editedItem;
      data.completion = data.completionToReturn;
      console.log(data);
      if (data.visible == true) {
        data.visible = 1;
      } else {
        data.visible = 0;
      }

      if (this.editedIndex > -1) {
        //Existing item
        //TODO: faire des promesses synchrone
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

    checkMeetingType() {
      if (this.meeting_type == "Chantier") {
        this.headers.splice(1, 0, { text: "Lot", value: "lots" });
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
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
