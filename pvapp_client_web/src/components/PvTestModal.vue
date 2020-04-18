<template>
  <v-dialog v-model="LocalDialog" max-width="800px">
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
                <v-select v-model="editedItem.lotsToReturn" :items="editedItem.lots" item-text="name" item-value="id_lot" label="Lot" chips multiple deletable-chips></v-select>
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
                <!-- TODO: SESSION Mettre en forme la date -->
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
</template>

<script>
import Axios from "axios";

export default {
  name: "PvTestModal",
  props: {
    meeting_type: String,
    dialog: Boolean,
    maxPosition: [Function, Number],
    editedIndex: Number,
    editedItem: Object
  },
  data() {
    return {
      LocalDialog: this.dialog,
      valid: false,
      standardRequirement: [v => !!v || "Requis"],
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
  mounted() {},
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nouvel item" : "Modifier l'item";
    }
    // LocalDialog: function() {
    //   return this.dialog;
    // }
    // Test: {
    //   set: function() {
    //     this.dialog
    //   }
    // }
  },
  watch: {
    Localdialog(val) {
      if (this.editedIndex == -1) {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItem.position = this.maxPosition;
      }
      val || this.close();
    }
  },
  methods: {
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
      this.Localdialog = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      confirm("Etes vous sûr de vouloir supprimer cette ligne ?") &&
        this.items.splice(index, 1);
    },

    close() {
      this.Localdialog = false;
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
            if (
              response.status == 201 &&
              typeof response.data.id_item_updated === "number"
            ) {
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
            if (
              response.status == 201 &&
              typeof response.data.id_item === "number"
            ) {
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
