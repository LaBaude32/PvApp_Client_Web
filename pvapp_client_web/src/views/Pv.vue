<template>
  <div max-width="800px">
    <v-data-table :headers="headers" :items="items" sort-by="position" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Pv du {{ pv.pv_details.meeting_date | formatDate }} </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel Item</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.position" label="Position" min="1" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-switch v-model="editedItem.visible" label="Visible"></v-switch>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-textarea v-model="editedItem.note" label="Note" counter auto-grow filled></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-textarea v-model="editedItem.follow_up" label="Suite à donner" counter auto-grow filled></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.ressources" label="Ressources"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
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
                <v-btn color="blue darken-1" text @click="save">Enregister</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.visible="{ item }">
        <v-switch v-model="item.visible" role="switch"></v-switch>
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
        <v-btn color="primary" @click="initialize">Afficher</v-btn>
      </template>
    </v-data-table>

    <v-divider class="mt-10 mb-3"></v-divider>
    {{ display }}
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      idPv: "",
      pv: "",
      dialog: false,
      headers: [
        {
          text: "Position",
          align: "start",
          value: "position"
        },
        { text: "Note", value: "note", sortable: false },
        { text: "Suite à donner", value: "follow_up", sortable: false },
        { text: "Ressource", value: "ressources", sortable: false },
        { text: "Echeance", value: "completion", sortable: false },
        { text: "Date d'echéance", value: "completion_date", sortable: false },
        { text: "Visible", value: "visible", sortable: false },
        { text: "Actions", value: "actions", sortable: false }
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        completion: "",
        completion_date: "",
        visible: ""
      },
      defaultItem: {
        name: "",
        note: "",
        follow_up: "",
        resources: "",
        completion: "",
        completion_date: "",
        visible: true
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    },
    display() {
      return this.items;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.initialize(); //TODO: SESSION pourquoi les données ne s'affichent pas au chargement?
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
        this.pv = response.data;
      });
      this.items = this.pv.items;
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
