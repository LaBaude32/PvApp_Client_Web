<template>
  <v-card max-width="95%" class="mx-auto mb-10">
    <v-data-table :headers="headers" :items="users" :search="search">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Participants</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Chercher"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialogNewOrModifiedUser" persistent max-width="600px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">Créer une personne</v-btn>
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
                        <v-text-field
                          v-model="editedItem.firstName"
                          label="Prénom"
                          :rules="FormNameRules"
                          clearable
                          counter="30"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.lastName"
                          label="Nom"
                          :rules="FormNameRules"
                          clearable
                          counter="30"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.userGroupToReturn"
                          :items="defaultItem.userGroup"
                          label="Groupe"
                          :rules="FormRequiredRules"
                          clearable
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.userFunction"
                          label="Fonction"
                          clearable
                          counter="30"
                          :rules="FormNameRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.organism"
                          label="Organisme"
                          clearable
                          counter="30"
                          :rules="FormNameRules"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.phone"
                          label="Téléphone"
                          :rules="FormPhoneRules"
                          clearable
                          counter="10"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Mail"
                          :rules="FormEmailRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-select
                          v-model="editedItem.statusPAE"
                          :items="defaultItem.statusPAE"
                          label="Status"
                          clearable
                          :rules="FormRequiredRules"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="closeNewOrModifiedUser">Annuler</v-btn>
                  <v-btn :disabled="!valid1" color="green darken-1" text @click="saveNewOrModifiedUser">
                    Enregistrer
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogExistingUser" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="green" dark class="mb-2 ml-2">Ajouter de votre répertoire</v-btn>
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
                        <v-select
                          v-model="connectedParticipant"
                          :items="connectedUsers"
                          item-title="fullName"
                          :rules="FormRequiredRules"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-row v-if="connectedParticipant">
                        <v-col class="ml-3">
                          <p>
                            <b>Prénom :</b>
                            {{ connectedParticipant.firstName }}
                          </p>
                          <p>
                            <b>Nom :</b>
                            {{ connectedParticipant.lastName }}
                          </p>
                          <p>
                            <b>Email :</b>
                            {{ connectedParticipant.email }}
                          </p>
                          <p>
                            <b>Téléphone :</b>
                            {{ connectedParticipant.phone }}
                          </p>
                          <p>
                            <b>Fonction :</b>
                            {{ connectedParticipant.userFunction }}
                          </p>
                          <p>
                            <b>Organisme :</b>
                            {{ connectedParticipant.organism }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="closeExistingUser">Annuler</v-btn>
                  <v-btn :disabled="!valid2" color="green darken-1" text @click="saveExistingUser">Enregistrer</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.statusPAE="{ item }">
        <v-select
          v-model="item.statusPAE"
          :items="defaultItem.statusPAE"
          @update:modelValue="statusChange(item)"
        ></v-select>
      </template>
      <template v-slot:item.fullName="{ item }">
        <div>{{ item.firstName }} {{ item.lastName }}</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)" v-if="!(item.userId == userId)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'utilisateurs pour ce PV</p>
        <!-- <v-btn color="primary" class="mb-4" @click="initialize">Afficher</v-btn> -->
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import Axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { FormNameRules, FormEmailRules, FormPhoneRules, FormRequiredRules } from '@/utilities/constantes'

const store = useStore()
const route = useRoute()

//TODO: Plutôt que faire deux boutons avec 2 modals pour ajouter une personne, faire un seul modal avec un bouton dedans pour choisir une personne existante dans une liste

defineProps({
  allConnectedParticipants: Array
})

const users = defineModel('users', { type: Array, required: true })

const pvId = ref(Number)
const valid1 = ref(false)
const valid2 = ref(false)

const search = ref('')
const dialogNewOrModifiedUser = ref(false)
const dialogExistingUser = ref(false)
const connectedParticipant = ref()
//TODO: récuperer les connected User via l'API
const connectedUsers = [
  {
    userId: 1,
    fullName: 'Baud Coup',
    firstName: 'Baud',
    lastName: 'Coup',
    email: 'baud@baud.fr',
    phone: '0675',
    userFunction: 'dev',
    organism: 'SAS'
  },
  {
    userId: 2,
    fullName: 'Omb Bollo',
    firstName: 'Omb',
    lastName: 'Bollo'
  },
  {
    userId: 3,
    fullName: 'Sam Coup',
    firstName: 'Sam',
    lastName: 'Coup'
  }
]
const headers = [
  {
    title: 'Prénom Nom',
    align: 'start',
    value: 'fullName'
  },
  {
    title: 'Groupe',
    value: 'userGroup',
    sortable: false
  },
  { title: 'Fonction', value: 'userFunction' },
  { title: 'Organisme', value: 'organism' },
  { title: 'Mail', value: 'email', sortable: false },
  { title: 'Téléphone', value: 'phone', sortable: false },
  { title: 'Statut', value: 'statusPAE' },
  { title: 'Modifier', value: 'actions', sortable: false }
]
const editedIndex = ref(-1)
//TODO: mettre dans types.js
const editedItem = ref({
  fullName: '',
  userGroupToReturn: '',
  userGroup: [],
  userFunction: '',
  organism: '',
  email: '',
  phone: '',
  statusPAE: '',
  firstName: '',
  lastName: ''
})
//TODO: mettre dans types.js
const defaultItem = {
  fullName: '',
  userGroup: [
    "Maîtrise d'ouvrage",
    "Assistance à la maîtrise d'ouvrage",
    "Maîtrise d'oeuvre",
    'Entreprise',
    'Concessionnaire',
    'Personne public associée',
    'COPIL',
    'COTEC',
    'Divers'
  ],
  userFunction: '',
  organism: '',
  email: '',
  phone: '',
  statusPAE: ['Présent', 'Absent', 'Excusé'],
  firstName: '',
  lastName: ''
}

const formTitle = computed(() => {
  return editedIndex === -1 ? 'Ajouter une personne' : 'Modifier une personne'
})
const affairName = computed(() => store.getters['affair/name'])
const userId = computed(() => store.getters['user/userId'])

onMounted(() => {
  pvId.value = route.params.id
})

function editItem(item) {
  editedIndex.value = users.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  editedItem.value.userGroupToReturn = item.userGroup
  dialogNewOrModifiedUser.value = true
}

function deleteItem(item) {
  const index = users.value.indexOf(item)
  confirm('Etes-vous sûr de vouloir supprimer cette personne?') &&
    Axios.delete('participants/userId', { params: { userId: item.userId, pvId: pvId.value } })
      .then((response) => {
        if (response.status == 204) {
          store.dispatch('notification/success', "L'utilisateur à bien été supprimé")
          users.value.splice(index, 1)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}

function closeNewOrModifiedUser() {
  dialogNewOrModifiedUser.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem)
    editedIndex.value = -1
    // formReset()
  }, 300)
}

function saveNewOrModifiedUser() {
  let data = { ...editedItem.value }
  data.pvId = pvId.value
  data.userGroup = data.userGroupToReturn
  if (editedIndex.value > -1) {
    //Exisiting User
    Axios.put('participants/userId', data)
      .then((response) => {
        if (response.status == 200) {
          Object.assign(users.value[editedIndex.value], editedItem.value)
          store.dispatch('notification/success', 'Le participant à bien été mis à jour')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  } else {
    //New User
    data.password = affairName.value
    Axios.post('users', data)
      .then((response) => {
        if (response.status == 201) {
          data.userId = response.data.userId
          users.value.push(data)
          store.dispatch('notification/success', 'Le participant à bien été ajouté')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  closeNewOrModifiedUser()
}

function closeExistingUser() {
  dialogExistingUser.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, defaultItem)
    connectedParticipant.value = null
    editedIndex.value = -1
  }, 300)
}

function saveExistingUser() {
  if (editedIndex.value > -1) {
    Object.assign(users[editedIndex], editedItem.value)
  } else {
    users.value.push(connectedParticipant.value)
    //TODO: mettre en place l'API pour cette fontion
  }
  closeExistingUser()
}
function statusChange(item) {
  let statusData = {}
  statusData.pvId = pvId.value
  statusData.userId = item.userId
  statusData.statusPAE = item.statusPAE
  Axios.put('participants/userId/updateStatus', statusData)
    .then((response) => {
      if (response.status == 200) {
        store.dispatch('notification/success', 'Le status à bien été mis à jour')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>
