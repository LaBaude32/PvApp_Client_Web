<template>
  <v-card max-width="95%" class="mx-auto mb-10">
    <v-data-table :headers="headers" :items="users" :search="search" dense>
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Personnes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Chercher" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Créer une nouvelle personne</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <!-- TODO: comment mettre des règles dans ce form ? faut-il transformer en form ? -->
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.firstName" label="Prénom"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.lastName" label="Nom"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.function" label="Fonction"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.organism" label="Organisme"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.email" label="Mail"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.phone" label="Téléphone"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-radio-group v-model="editedItem.status" label="Statut" row>
                        <v-radio value="Présent" label="Présent"></v-radio>
                        <v-radio value="Absent" label="Absent"></v-radio>
                        <v-radio value="Excusé" label="Excusé"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="save">Enregistrer</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialog2" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="green" dark class="mb-2 ml-2" v-on="on">Ajouter une personne de votre répertoire</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Choisir dans votre répertoire</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-combobox v-model="connectedUser" :items="connectedUsers" item-text="fullName" item-value="user_id" label="Personne"></v-combobox>
                    </v-col>
                    <v-row v-if="connectedUser">
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="connectedUser.fullName" label="Prénom NOM" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="connectedUser.email" label="Mail" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="connectedUser.phone" label="Téléphone" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="connectedUser.function" label="Fonction" readonly></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="connectedUser.organism" label="Organisme" readonly></v-text-field>
                      </v-col>
                    </v-row>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close2">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="save2">Enregistrer</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <v-radio-group v-model="item.status" row>
          <v-radio value="Présent" label="Présent"></v-radio>
          <v-radio value="Absent" label="Absent"></v-radio>
          <v-radio value="Excusé" label="Excusé"></v-radio>
        </v-radio-group>
      </template>
      <template v-slot:item.fullName="{ item }">
        <div>{{ item.firstName }} {{ item.lastName }}</div>
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
        <p class="headline font-weight-medium mt-3">Il n'y a pas encore d'utilisateurs pour ce PV</p>
        <!-- <v-btn color="primary" class="mb-4" @click="initialize">Afficher</v-btn> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from "axios";
export default {
  name: "Users",
  // props: { users: Array }, //FIXME: SESSION me renvoie une erreur
  data: () => ({
    search: "",
    dialog: false,
    dialog2: false,
    users: [],
    connectedUser: "",
    connectedUsers: [
      {
        user_id: 1,
        fullName: "Baud Coup",
        firstName: "Baud",
        lastName: "Coup",
        email: "baud@baud.fr",
        phone: "0675",
        function: "dev",
        organism: "SAS"
      },
      {
        user_id: 2,
        fullName: "Omb Bolo",
        firstName: "Omb",
        lastName: "Bolo"
      },
      {
        user_id: 3,
        fullName: "Sam Coup"
      }
    ],
    headers: [
      {
        text: "Prénom Nom",
        align: "start",
        value: "fullName"
      },
      { text: "Fonction", value: "function" },
      { text: "Organisme", value: "organism" },
      { text: "Mail", value: "email", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Statut", value: "status" },
      { text: "Modifier", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      fullName: "",
      function: "",
      organism: "",
      email: "",
      phone: "",
      status: ""
    },
    defaultItem: {
      fullName: "",
      function: "",
      organism: "",
      email: "",
      phone: "",
      status: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Ajouter une personne"
        : "Modifier une personne";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialog2(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      //TODO: Pas top, préférable de récuperer les données avec des props
      this.idPv = this.$route.params.id;
      let dt = {
        params: {
          id_pv: this.$route.params.id
        }
      };
      Axios.get("getPvDetails", dt).then(response => {
        this.users = response.data.users;
      });
    },

    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Etes-vous sûr de vouloir supprimer cette personne?") &&
        this.users.splice(index, 1);
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
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.editedItem);
      }
      this.close();
    },

    close2() {
      this.dialog2 = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save2() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.connectedUser);
      }
      this.close2();
    }
  }
};
</script>
