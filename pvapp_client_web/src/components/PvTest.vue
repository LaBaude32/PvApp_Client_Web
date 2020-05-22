<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="LocalItems" sort-by="position" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="LocalPvDetails">Pv du {{ LocalPvDetails.meeting_date | formatDate }} </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>

            <PvTestModal
              :meeting_type="meeting_type"
              :dialog="dialog"
              :maxPosition="maxPosition"
              :editedIndex="editedIndex"
              :editedItem="editedItem"
            />
          </v-toolbar>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" color="orange" dark>
            {{ lot.name }}
          </v-chip>
        </template>
        <template v-slot:item.visible="{ item }">
          <v-switch v-model="item.visible" role="switch" @change="changeVisible(item)"></v-switch>
        </template>
        <template v-slot:item.completion_date="{ item }">
          {{ item.completion_date | formatDate }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(LocalItems)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <p class="headline font-weight-medium mt-3">Il n'y a pas encore d'item pour ce PV</p>
        </template>
      </v-data-table>
    </v-card>
    <v-divider class="my-10"></v-divider>

    <!-- <Users v-bind:users="pvUsers" /> -->
  </div>
</template>

<script>
import Axios from "axios";
// import Users from "@/components/Users.vue";
import PvTestModal from "@/components/PvTestModal.vue";
// import { getRouteName } from "../utilities/constantes";
export default {
  name: "Pv",
  components: {
    // Users,
    PvTestModal
  },
  props: {
    meeting_type: String,
    pvDetails: Object,
    pvUsers: Array,
    items: Array
  },
  data() {
    return {
      LocalItems: this.items,
      LocalPvDetails: this.pvDetails,
      valid: false,
      standardRequirement: [v => !!v || "Requis"],
      search: "",
      dialog: false,
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
    formTitle() {
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    }
  },
  mounted() {
    console.log(this.meeting_type);
    if (this.meeting_type == "Chantier") {
      this.headers.splice(1, 0, { text: "Lot", value: "lots" });
    }
    //Sinon passer le tableau en propriété si on le met dans un composant
  },
  methods: {
    maxPosition() {
      let toReturn = Math.max(...this.LocalItems.map(LocalItems => LocalItems.position)) + 1;
      console.log(toReturn);
      console.log(typeof toReturn);

      return toReturn;
    },

    editItem(item) {
      this.editedIndex = this.LocalItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem = {
        ...item
      };
      this.editedItem.lotsToReturn = item.lots;
      this.editedItem.lots = this.LocalPvDetails.lots;
      this.editedItem.completionToReturn = item.completion;
      this.editedItem.completion = [item.completion];
      this.editedItem.completion.push(...this.defaultItem.completion);
      if (this.editedIndex == -1) {
        this.maxPosition = this.maxPosition();
        console.log(this.maxPosition);
      }
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.LocalItems.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cette ligne ?") && this.LocalItems.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
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
        Axios.post("/updateItem", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_item_updated === "number") {
              // Object.assign(this.LocalItems[this.editedIndex], data);
              this.LocalItems[this.editedIndex] = { ...data };
              // this.editedItem.completion = [];
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
              this.LocalItems.push(data);
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
    changeVisible(item) {
      console.log(item);
      let data = {
        id_item: item.id_item,
        visible: item.visible == true ? 1 : 0
      };
      console.log(data);
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
