<template>
  <div>
    {{ test }}
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="MyHeaders" :items="MyDesserts" sort-by="calories" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>My CRUD</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="MyDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">New item</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="MyEditedItem.name" label="Dessert name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="MyEditedItem.calories" label="Calories"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="MyEditedItem.fat" label="Fat (g)"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="MyEditedItem.carbs" label="Carbs (g)"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="MyEditedItem.protein" label="Protein (g)"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="fermer()">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Pv-V2",
  props: {
    test: String,
    dialog: Boolean,
    headers: Array,
    desserts: Array,
    editedIndex: Number,
    editedItem: Object,
    defaultItem: Object,
    editItem: Function,
    deleteItem: Function,
    fermer: Function,
    save: Function
  },
  data() {
    return {
      // MyDialog: this.dialog,
      MyHeaders: this.headers,
      MyDesserts: this.desserts,
      MyEditedIndex: this.editedIndex,
      MyEditedItem: this.editedItem,
      MyDefaultItem: this.defaultItem
    };
  },
  //TODO: SESSION : Avec cette archi il faut conserver les computed et les watch dans le composant enfant ?
  computed: {
    formTitle() {
      return this.MyEditedIndex === -1 ? "New Item" : "Edit Item";
    },
    MyDialog: {
      get: function() {
        return this.dialog;
      },
      set: function(val) {
        console.log("watch " + val);
        val || this.fermer();
      }
    }
  },

  watch: {
    MyDialog(val) {
      console.log(val);
    }
  }
};
</script>
