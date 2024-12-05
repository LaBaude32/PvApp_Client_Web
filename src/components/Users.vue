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
          <v-dialog v-model="dialogNewOrModifiedUser" persistent max-width="80%">
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
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.organism"
                          label="Organisme"
                          clearable
                          counter="30"
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
                      <v-col cols="12" sm="6">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Mail"
                          :rules="FormEmailRules"
                          clearable
                        ></v-text-field>
                      </v-col>
                      <UserFormStatus v-model:editedItem="editedItem" />
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="closeNewOrModifiedUser">Annuler</v-btn>
                  <v-btn
                    :disabled="!valid1"
                    color="green darken-1"
                    text
                    @click="saveNewOrModifiedUser"
                  >
                    Enregistrer
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogExistingUser" max-width="80%">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" color="green" dark class="mb-2 ml-2">
                Ajouter de votre répertoire
              </v-btn>
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
                        <v-autocomplete
                          v-model="connectedParticipant"
                          :items="allConnectedParticipants"
                          :item-props="participantItemProps"
                          :rules="FormRequiredRules"
                          no-data-text="Tous les participants avec lesquels vous avez déjà travaillé sont déjà ici"
                        ></v-autocomplete>
                      </v-col>
                      <v-row v-if="connectedParticipant">
                        <v-container>
                          <v-col cols="12">
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
                          <UserFormStatus v-model:editedItem="connectedParticipant" />
                        </v-container>
                      </v-row>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="closeExistingUser">Annuler</v-btn>
                  <v-btn :disabled="!valid2" color="green darken-1" text @click="saveExistingUser">
                    Enregistrer
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.fullName="{ item }">
        <div>{{ item.firstName }} {{ item.lastName }}</div>
      </template>
      <template v-slot:item.statusPAE="{ item }">
        <v-select
          v-model="item.statusPAE"
          :items="PARTICIPANT_STATUS_PAE"
          @update:modelValue="statusChange(item, 'PAE')"
        ></v-select>
      </template>
      <template v-slot:item.invitedCurrentMeeting="{ item }">
        <v-checkbox
          v-model="item.invitedCurrentMeeting"
          :indeterminate="item.invitedCurrentMeeting == null"
          :color="item.invitedCurrentMeeting ? 'success' : ''"
          @update:modelValue="statusChange(item, 'invitedCurrentMeeting')"
        />
      </template>
      <template v-slot:item.invitedNextMeeting="{ item }">
        <v-checkbox
          v-model="item.invitedNextMeeting"
          :indeterminate="item.invitedNextMeeting == null"
          :color="item.invitedNextMeeting ? 'success' : ''"
          @update:modelValue="statusChange(item, 'invitedNextMeeting')"
        />
      </template>
      <template v-slot:item.distribution="{ item }">
        <v-checkbox
          v-model="item.distribution"
          :indeterminate="item.distribution == null"
          :color="item.distribution ? 'success' : ''"
          @update:modelValue="statusChange(item, 'distribution')"
        />
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
import { useRoute } from 'vue-router'
import {
  FormNameRules,
  FormEmailRules,
  FormPhoneRules,
  FormRequiredRules
} from '@/utilities/constantes.ts'
import { useNotificationStore } from '../store/notification'
import { useUserStore } from '../store/user'
import { useAffairStore } from '../store/affair'
import UserFormStatus from './UserFormStatus.vue'
import { PARTICIPANT_STATUS_PAE } from '@/utilities/dataConst'

const userStore = useUserStore()
const affairStore = useAffairStore()
const notifStore = useNotificationStore()
const route = useRoute()

const users = defineModel('users', { type: Array, required: true })
//On utilise un model parce qu'on retire les éléments quand ils sont ajouté dans les users
const allConnectedParticipants = defineModel('allConnectedParticipants', {
  type: Array,
  required: true
})

const pvId = ref(Number)
const valid1 = ref(false)
const valid2 = ref(false)

const search = ref('')
const dialogNewOrModifiedUser = ref(false)
const dialogExistingUser = ref(false)
const connectedParticipant = ref()

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
  { title: 'C1', value: 'invitedCurrentMeeting' },
  { title: 'C2', value: 'invitedNextMeeting' },
  { title: 'Diffusion', value: 'distribution' },
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
  statusPAE: undefined,
  invitedCurrentMeeting: undefined,
  invitedNextMeeting: undefined,
  distribution: undefined,
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
  statusPAE: undefined,
  invitedCurrentMeeting: undefined,
  invitedNextMeeting: undefined,
  distribution: undefined,
  firstName: '',
  lastName: ''
}

const formTitle = computed(() => {
  return editedIndex === -1 ? 'Ajouter une personne' : 'Modifier une personne'
})
const affairName = computed(() => affairStore.affair.name)
const userId = computed(() => userStore.user.userId)

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
          notifStore.success("L'utilisateur à bien été supprimé")
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

function registerUser(user) {
  return new Promise((resolve, reject) => {
    Axios.post('users', user)
      .then((response) => {
        if (response.status == 201) {
          user.userId = response.data.userId
          users.value.push(user)
          resolve(user)
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

function saveParticipant(participant) {
  Axios.put('/participants/userId/updateStatus', participant)
    .then((response) => {
      if (response.status == 200) {
        Object.assign(users.value[editedIndex.value], response.data)
        notifStore.success('Le participant à bien été ajouté')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function saveNewOrModifiedUser() {
  let data = { ...editedItem.value }
  data.pvId = Number(pvId.value)
  data.userGroup = data.userGroupToReturn
  if (editedIndex.value > -1) {
    saveParticipant(data)
  } else {
    //l'utilisateur n'existe pas, il faut le creer
    data.password = affairName.value
    registerUser(data).then((newUser) => {
      newUser.statusPAE = data.statusPAE
      data.invitedCurrentMeeting
        ? (newUser.invitedCurrentMeeting = data.invitedCurrentMeeting)
        : (newUser.invitedCurrentMeeting = null)
      data.invitedNextMeeting
        ? (newUser.invitedNextMeeting = data.invitedNextMeeting)
        : (newUser.invitedNextMeeting = null)
      data.distribution ? (newUser.distribution = data.distribution) : (newUser.distribution = null)
      saveParticipant(newUser)
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
  let data = { ...connectedParticipant.value }
  data.pvId = pvId.value
  Axios.post('participants', data).then((response) => {
    if (response.status == 201) {
      users.value.push(response.data)
      const indexToRemove = allConnectedParticipants.value.findIndex(
        (obj) => obj.userId === response.data.userId
      )
      if (indexToRemove !== -1) {
        allConnectedParticipants.value.splice(indexToRemove, 1)
      }
      notifStore.success('Le participant à bien été ajouté')
    }
  })
  closeExistingUser()
}
function statusChange(item, typeOfChange) {
  let statusData = {}
  statusData.pvId = pvId.value
  statusData.userId = item.userId
  statusData.statusPAE = item.statusPAE
  statusData.invitedCurrentMeeting = item.invitedCurrentMeeting
  statusData.invitedNextMeeting = item.invitedNextMeeting
  statusData.distribution = item.distribution
  Axios.put('participants/userId/updateStatus', statusData)
    .then((response) => {
      if (response.status == 200) {
        notifStore.success('Le status à bien été mis à jour')
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function participantItemProps(params) {
  return {
    title: `${params.firstName} ${params.lastName}`,
    subtitle: `${params.organism} - ${params.userFunction}`
  }
}
</script>
