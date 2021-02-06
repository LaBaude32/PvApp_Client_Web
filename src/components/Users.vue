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
          <v-dialog v-model="dialogNewOrModifiedUser" persistent max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Créer une personne</v-btn>
            </template>

            <v-card>
              <v-form v-model="valid1" ref="form1">
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.firstName" label="Prénom" :rules="nameRules" clearable counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.lastName" label="Nom" :rules="nameRules" clearable counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-combobox
                          v-model="editedItem.userGroupToReturn"
                          :items="defaultItem.userGroup"
                          solo
                          label="Groupe"
                          counter="30"
                          clearable
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.userFunction" label="Fonction" clearable counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.organism" label="Organisme" clearable counter="30"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field v-model="editedItem.phone" label="Téléphone" :rules="phoneRules" clearable counter="10"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="8" md="8">
                        <v-text-field v-model="editedItem.email" label="Mail" :rules="emailRules" clearable></v-text-field>
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
                  <span class="text-h5">Choisir dans votre répertoire</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-combobox
                          v-model="connectedParticipant"
                          :items="connectedParticipants"
                          item-value="user_id"
                          label="Personne"
                          :rules="standardRequirement"
                        >
                          <template v-slot:selection="{ item }"> {{ item.firstName }} {{ item.lastName }} </template>
                          <template v-slot:item="{ item }"> {{ item.firstName }} {{ item.lastName }} </template>
                        </v-combobox>
                      </v-col>
                      <v-row v-if="connectedParticipant">
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.firstName" label="Prénom" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.lastName" label="Nom" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.userGroup" label="Groupe" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.email" label="Mail" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.phone" label="Téléphone" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.userFunction" label="Fonction" readonly></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                          <v-text-field v-model="connectedParticipant.organism" label="Organisme" readonly></v-text-field>
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
        <v-icon small @click="deleteItem(item)" v-if="!(item.id_user == userId)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'utilisateurs pour ce PV</p>
        <!-- <v-btn color="primary" class="mb-4" @click="initialize">Afficher</v-btn> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import Axios from "axios";
import { mapGetters, mapState } from "vuex";

//TODO: Plutôt que faire deux boutons avec 2 modals pour ajouter une personne, faire un seul modal avec un bouton dedans pour choisir une personne existante dans une liste

export default {
  name: "Users",
  props: { users: Array, connectedParticipants: Array },
  data: () => ({
    pvId: Number,
    valid1: false,
    valid2: false,
    nameRules: [
      v => !!v || "Requis",
      v => (v && v.length >= 2) || "Doit être supérieur 1 charactère",
      v => (v && v.length <= 30) || "Doit être inférieur à 30 charactères"
    ],
    standardRules: [v => (v && v.length <= 30) || "Doit être inférieur à 30 charactères"],
    emailRules: [v => /.+@.+\..+/.test(v) || "Le mail doit être valide"],
    phoneRules: [v => /\d{10}/.test(v) || "Doit être un numéro de téléphone valide"],
    statusRules: [v => !!v || "Requis"],
    standardRequirement: [v => !!v || "Requis"],
    search: "",
    dialogNewOrModifiedUser: false,
    dialogExistingUser: false,
    connectedParticipant: "",
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
        userFunction: "dev",
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
      { text: "Fonction", value: "userFunction" },
      { text: "Organisme", value: "organism" },
      { text: "Mail", value: "email", sortable: false },
      { text: "Téléphone", value: "phone", sortable: false },
      { text: "Statut", value: "status_PAE" },
      { text: "Modifier", value: "actions", sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      fullName: "",
      userGroupToReturn: "",
      userGroup: [],
      userFunction: "",
      organism: "",
      email: "",
      phone: "",
      status_PAE: "",
      firstName: "",
      lastName: ""
    },
    defaultItem: {
      fullName: "",
      userGroup: [
        "Maitrise d'ouvrage",
        "Assistance à la maitrise d'ouvrage",
        "Maitrise d'oeuvre",
        "Concessionnaire",
        "Personne public associée",
        "COPIL",
        "COTEC",
        "Divers"
      ],
      userFunction: "",
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
    ...mapState("user", {
      userId: "userId"
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Ajouter une personne" : "Modifier une personne";
    }
  },
  mounted() {
    this.pvId = this.$route.params.id;
  },

  // watch: {
  //   dialogNewOrModifiedUser(val) {
  //     val || this.closeNewOrModifiedUser();
  //   },
  //   dialogExistingUser(val) {
  //     val || this.closeExistingUser();
  //   }
  // },

  methods: {
    test(item) {
      alert(item);
    },
    formReset() {
      this.$refs.form1.resetValidation();
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogNewOrModifiedUser = true;
    },

    deleteItem(item) {
      const index = this.users.indexOf(item);
      confirm("Etes-vous sûr de vouloir supprimer cette personne?") &&
        Axios.delete("deleteParticipant", { params: { id_user: item.id_user, id_pv: this.pvId } })
          .then(response => {
            if (response.data == "success") {
              this.$store.dispatch("notification/success", "L'utilisateur à bien été supprimé");
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
        this.formReset();
      }, 300);
    },

    saveNewOrModifiedUser() {
      let data = { ...this.editedItem };
      data.pvId = this.pvId;
      data.userGroup = data.userGroupToReturn;
      if (this.editedIndex > -1) {
        //Exisiting User
        Axios.post("/updateParticipant", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_user === "number") {
              Object.assign(this.users[this.editedIndex], this.editedItem);
              let message = "Le participant à bien été mis à jour";
              this.$store.dispatch("notification/success", message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        //New User
        data.password = this.affair_name;
        Axios.post("/addUser", data)
          .then(response => {
            if (response.status == 201 && typeof response.data.id_user === "number") {
              data.id_user = response.data.id_user;
              this.users.push(data);
              let message = "Le participant à bien été ajouté";
              this.$store.dispatch("notification/success", message);
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
        this.connectedParticipant = null;
        this.editedIndex = -1;
      }, 300);
    },

    saveExistingUser() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem);
      } else {
        this.users.push(this.connectedParticipant);
      }
      this.closeExistingUser();
    }
  }
};
</script>
