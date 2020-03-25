<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="items" sort-by="position" :search="search">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title v-if="pvDetails">Pv du {{ pvDetails.meeting_date | formatDate }} </v-toolbar-title>
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
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="4" md="4">
                          <v-text-field v-model="editedItem.position" label="Position" min="1" type="number" :rules="standardRequirement"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="4" md="4" v-if="meeting_type == 'Chantier'">
                          <v-text-field v-model="editedItem.lot" label="Lot" min="1" type="number" :rules="standardRequirement"></v-text-field>
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
                          <!-- <v-combobox v-model="editedItem.completion" :items="editedItem.completion" label="Echéance"></v-combobox> -->
                          <v-text-field v-model="editedItem.completion" label="Echéance"></v-text-field>
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
        <template v-slot:item.visible="{ item }">
          <v-switch v-model="item.visible" role="switch"></v-switch>
        </template>
        <template v-slot:item.completion_date="{ item }">
          {{ item.completion_date | formatDate }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <p class="headline font-weight-medium mt-3">Il n'y a pas encore d'item pour ce PV</p>
          <!-- <v-btn color="primary" class="mb-4" @click="initialize">Afficher</v-btn> -->
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
import { mapGetters } from "vuex";
export default {
  components: {
    Users
  },
  data() {
    return {
      valid: false,
      standardRequirement: [v => !!v || "Requis"],
      search: "",
      idPv: "",
      pvDetails: {},
      pvUsers: [],
      dialog: false,
      headers: [
        {
          text: "Position",
          align: "start",
          value: "position"
        },
        { text: "Lot", value: "lot" },
        //TODO: Récuperer les lots via l'API
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "follow_up", sortable: false },
        { text: "Ressource", value: "ressources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completion_date" },
        { text: "Visible", value: "visible" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        position: "",
        lot: "",
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        completion: "",
        completion_date: "",
        visible: ""
      },
      defaultItem: {
        position: "",
        lot: "",
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        // completion: ["A faire", "Urgent", "Fait"],
        // TODO: SESSION : faire fonctionner ça
        completion: "",
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
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    }
  },
  watch: {
    dialog(val) {
      this.editedItem.position = this.maxPosition();
      val || this.close();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.idPv = this.$route.params.id;
      let dt = {
        params: {
          id_pv: this.$route.params.id
        }
      };
      Axios.get("getPvDetails", dt).then(response => {
        if (typeof response.data.items !== "string") {
          this.items = response.data.items;
        }
        this.pvDetails = response.data.pv_details;
        this.pvUsers = response.data.users;
      });
    },
    maxPosition() {
      return Math.max(...this.items.map(items => items.position)) + 1;
    },

    editItem(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cette ligne ?") &&
        this.items.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.items.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>
