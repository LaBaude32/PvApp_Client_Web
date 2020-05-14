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
          <v-dialog v-model="dialogNewOrModifiedUser" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Créer une personne</v-btn>
            </template>

            <v-card>
              <v-form v-model="valid1">
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.firstName" label="Prénom" :rules="nameRules" counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.lastName" label="Nom" :rules="nameRules" counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.userGroup" label="Groupe" :rules="standardRules" counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.function" label="Fonction" :rules="standardRules" counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.organism" label="Organisme" :rules="standardRules" counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.phone" label="Téléphone" :rules="phoneRules" counter="10"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8" md="8">
                        <v-text-field v-model="editedItem.email" label="Mail" :rules="emailRules"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="4" md="4">
                        <v-radio-group v-model="editedItem.status_PAE" label="Statut" :rules="statusRules">
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
                  <v-btn color="blue darken-1" text @click="closeNewOrModifiedUser">Annuler</v-btn>
                  <v-btn :disabled="!valid1" color="blue darken-1" text @click="saveNewOrModifiedUser">Enregistrer</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogExistingUser" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="green" dark class="mb-2 ml-2" v-on="on">Ajouter de votre répertoire</v-btn>
            </template>
            <v-card>
              <v-form v-model="valid2">
                <v-card-title>
                  <span class="headline">Choisir dans votre répertoire</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="connectedUser"
                          :items="connectedUsers"
                          item-text="fullName"
                          item-value="user_id"
                          label="Personne"
                          :rules="standardRequirement"
                        ></v-combobox>
                      </v-col>
                      <v-row v-if="connectedUser">
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedUser.fullName" label="Prénom NOM" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedUser.userGroup" label="Groupe" readonly></v-text-field>
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
                  <v-btn color="blue darken-1" text @click="closeExistingUser">Annuler</v-btn>
                  <v-btn :disabled="!valid2" color="blue darken-1" text @click="saveExistingUser">Enregistrer</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.status_PAE="{ item }">
        <v-radio-group v-model="item.status_PAE" row>
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
import { mapGetters } from "vuex";

//TODO: Plutôt que faire deux boutons avec 2 modals pour ajouter une personne, faire un seul modal avec un bouton dedans pour choisir une personne existante dans une liste

export default {
  name: "Users",
  props: { users: Array },
  data: () => ({
    valid1: false,
    valid2: false,
    nameRules: [
      v => !!v || "Requis",
      v => (v && v.length >= 2) || "Doit être supérieur 1 charactère",
      v => (v && v.length <= 30) || "Doit être inférieur à 30 charactères"
    ],
    standardRules: [
      v => !!v || "Requis",
      v => (v && v.length >= 3) || "Doit être supérieur 2 charactère",
      v => (v && v.length <= 30) || "Doit être inférieur à 30 charactères"
    ],
    emailRules: [v => !!v || "Requis", v => /.+@.+\..+/.test(v) || "Le mail doit être valide"],
    phoneRules: [
      v => !!v || "Requis",
      v => (v && v.length == 10) || "Doit être égal à 10 charactère",
      v => /\d/.test(v) || "Doit être consituté de chiffres uniquement"
    ],
    statusRules: [v => !!v || "Requis"],
    standardRequirement: [v => !!v || "Requis"],
    search: "",
    dialogNewOrModifiedUser: false,
    dialogExistingUser: false,
    connectedUser: "",
    //TODO: récuperer les connected User via l'API
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
        fullName: "Omb Bollo",
        firstName: "Omb",
        lastName: "Bollo"
      },
      {
        user_id: 3,
        fullName: "Sam Coup",
        firstName: "Sam",
        lastName: "Coup"
      }
    ],
    headers: [
      {
        text: "Prénom Nom",
        align: "start",
        value: "fullName"
      },
      {
        text: "Groupe",
        value: "userGroup",
        sortable: false
      },
      { text: "Fonction", value: "function" },
      { text: "Organisme", value: "organism" },
      { text: "Mail", value: "email", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Statut", value: "status_PAE" },
      { text: "Modifier", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      fullName: "",
      userGroup: "",
      function: "",
      organism: "",
      email: "",
      phone: "",
      status_PAE: "",
      firstName: "",
      lastName: ""
    },
    defaultItem: {
      fullName: "",
      userGroup: "",
      function: "",
      organism: "",
      email: "",
      phone: "",
      status_PAE: "",
      firstName: "",
      lastName: ""
    }
  }),

  computed: {
    ...mapGetters("affair", {
      affair_name: "name"
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Ajouter une personne" : "Modifier une personne";
    }
  },

  watch: {
    dialogNewOrModifiedUser(val) {
      val || this.closeNewOrModifiedUser();
    },
    dialogExistingUser(val) {
      val || this.closeExistingUser();
    }
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogNewOrModifiedUser = true;
    },

    deleteItem(item) {
      //TODO:SESSION : problème de primary key / unique / foreight key
      const index = this.users.indexOf(item);
      confirm("Etes-vous sûr de vouloir supprimer cette personne?") &&
        Axios.delete("deleteUser", { params: { id_user: item.id_user } })
          .then(response => {
            if (response == "success") {
              this.users.splice(index, 1);
            }
          })
          .catch(error => {
            console.log(error);
          });
    },

    closeNewOrModifiedUser() {
      this.dialogNewOrModifiedUser = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    saveNewOrModifiedUser() {
      if (this.editedIndex > -1) {
        //Exisiting User
        let data = this.editedItem;
        data.pvId = this.$route.params.id;
        Axios.post("/updateParticipant", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_user === "number") {
              Object.assign(this.users[this.editedIndex], this.editedItem);
            } else {
              console.log(response);
              console.log(typeof response.data.id_user);
            }
          })
          .catch(error => {
            console.log(error);
          });

        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        //New User
        let data = this.editedItem;
        data.password = this.affair_name;
        data.pvId = this.$route.params.id;
        Axios.post("/addUser", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_user === "number") {
              this.users.push(data);
            } else {
              console.log(response);
              console.log(typeof response.data.id_user);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
      this.closeNewOrModifiedUser();
    },

    closeExistingUser() {
      this.dialogExistingUser = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.connectedUser = null;
        this.editedIndex = -1;
      }, 300);
    },

    saveExistingUser() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.connectedUser);
      }
      this.closeExistingUser();
    }
  }
};
</script>
