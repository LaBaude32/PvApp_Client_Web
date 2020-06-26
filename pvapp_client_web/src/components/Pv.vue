<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="items" sort-by="position" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="pvDetails">Pv du {{ pvDetails.meeting_date | formatDate }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="800px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel Item</v-btn>
              </template>
              <v-card>
                <v-form v-model="valid">
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field
                            v-model="editedItem.position"
                            label="Position"
                            min="1"
                            type="number"
                            :rules="standardRequirement"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-if="meeting_type == 'Chantier'">
                          <v-select
                            v-model="editedItem.lotsToReturn"
                            :items="editedItem.lots"
                            item-text="name"
                            item-value="id_lot"
                            label="Lot"
                            chips
                            multiple
                            deletable-chips
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="4" md="4">
                          <v-switch v-model="editedItem.visible" label="Visible"></v-switch>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea v-model="editedItem.note" label="Note" counter auto-grow filled :rules="standardRequirement"></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-textarea v-model="editedItem.follow_up" label="Suite à donner" counter auto-grow filled></v-textarea>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.ressources" label="Ressources"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-combobox v-model="editedItem.completionToReturn" :items="editedItem.completion" label="Echéance"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="editedItem.completion_date" label="Date de l'echéance"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                    <v-btn :disabled="!valid" color="blue darken-1" text @click="save">Enregister</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" color="orange" dark>{{ lot.name }}</v-chip>
        </template>
        <template v-slot:item.visible="{ item }">
          <v-switch v-model="item.visible" role="switch" @change="changeVisible(item)"></v-switch>
        </template>
        <template v-slot:item.completion_date="{ item }">
          {{ item.completion_date | formatDate }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'item pour ce PV</p>
        </template>
      </v-data-table>
    </v-card>
    <v-divider class="my-10"></v-divider>

    <Users v-bind:users="pvUsers" />
  </div>
</template>

<script>
import Axios from "axios";
import Users from "@/components/Users.vue";
// import { getRouteName } from "../utilities/constantes";
import { mapGetters } from "vuex";
export default {
  name: "Pv",
  components: {
    Users
  },
  props: {
    meeting_type: String,
    pvDetails: Object,
    pvUsers: Array,
    items: Array
  },
  data: () => ({
    valid: false,
    standardRequirement: [v => !!v || "Requis"],
    search: "",
    idPv: "",

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
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    },
    test() {
      return this.$route.params.id;
    },
    ...mapGetters("user", {
      userId: "userId"
    })
  },
  watch: {
    dialog(val) {
      if (this.editedIndex == -1) {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.position = this.maxPosition();
      }
      val || this.close();
    }
  },
  mounted() {
    console.log(this.meeting_type);
    if (this.meeting_type == "Chantier") {
      this.headers.splice(1, 0, { text: "Lot", value: "lots" });
    }
    //Sinon passer le tableau en propriété si on le met dans un composant
  },
  created() {
    this.getData();
  },
  methods: {
    initialize() {},
    async getData() {
      this.idPv = this.$route.params.id;
      let dt = {
        params: {
          id_pv: this.$route.params.id,
          id_user: this.userId
        }
      };
      let res = await Axios.get("getPvDetails", dt);
      if (typeof res.data.items !== "string") {
        this.items = res.data.items;
      }
      this.pvDetails = res.data.pv_details;
      this.pvUsers = res.data.users;
      this.$store.dispatch("affair/loadAffairByPv", this.pvDetails.affair_id);
    },
    maxPosition() {
      return Math.max(...this.items.map(items => items.position)) + 1;
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editedItem = {
        ...item
      };
      this.editedItem.lotsToReturn = item.lots;
      this.editedItem.lots = this.pvDetails.lots;
      this.editedItem.completionToReturn = item.completion;
      this.editedItem.completion = [item.completion];
      this.editedItem.completion.push(...this.defaultItem.completion);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cette ligne ?") && this.items.splice(index, 1);
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
              // Object.assign(this.items[this.editedIndex], data);
              this.items[this.editedIndex] = { ...data };
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
