<template>
  <v-card max-width="95%" class="mx-auto mb-10">
    <v-data-table
      :headers="PARTICIPANT_HEADERS"
      :items="participants"
      :search="search"
      items-per-page="-1"
      :sort-by="[{ key: 'position', order: 'asc' }]"
    >
      <template v-slot:top>
        <v-toolbar class="py-3">
          <v-toolbar-title>Participants</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-text-field
            class="mr-5"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Chercher"
            single-line
            hide-details
          ></v-text-field>
          <v-dialog v-model="dialogNewOrModifiedUser" persistent max-width="80%">
            <template v-slot:activator="{ props }">
              <v-btn variant="tonal" color="primary" v-bind="props">Créer une personne</v-btn>
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
                          v-model="editedItem.userGroup"
                          :items="USER_GROUPE_ITEMS"
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
                  <v-btn color="error" variant="text" @click="closeNewOrModifiedUser">Annuler</v-btn>
                  <v-btn
                    :disabled="!valid1"
                    color="success"
                    variant="text"
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
              <v-btn class="ml-2" v-bind="props" variant="tonal" color="tertiary"> Ajouter de votre répertoire </v-btn>
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
                  <v-btn color="error" variant="text" @click="closeExistingUser">Annuler</v-btn>
                  <v-btn :disabled="!valid2" color="success" variant="text" @click="saveExistingUser">
                    Enregistrer
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-dialog>
          <v-btn prepend-icon="mdi-qrcode-scan" @click="generateQrCode">Qr-code</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.position="{ item }">
        <v-btn
          icon="mdi-arrow-up-drop-circle-outline"
          variant="plain"
          v-if="participants?.indexOf(item) > 1"
          @click="pushUpParticipant(item)"
        ></v-btn>
        <v-btn
          icon="mdi-arrow-down-drop-circle-outline"
          variant="plain"
          v-if="
            participants?.indexOf(item) > 0 &&
            participants?.indexOf(item) < participants?.length - 1
          "
          @click="pushDownParticipant(item)"
        ></v-btn>
      </template>
      <template v-slot:item.fullName="{ item }">
        <div>{{ item.firstName }} {{ item.lastName }}</div>
      </template>
      <template v-slot:item.statusPAE="{ item }">
        <v-select
          v-model="item.statusPAE"
          :items="PARTICIPANT_STATUS_PAE"
          @update:modelValue="statusChange(item)"
        ></v-select>
      </template>
      <template v-slot:item.invitedCurrentMeeting="{ item }">
        <v-checkbox
          v-model="item.invitedCurrentMeeting"
          :indeterminate="item.invitedCurrentMeeting == null"
          :color="item.invitedCurrentMeeting ? 'success' : ''"
          @update:modelValue="statusChange(item)"
        />
      </template>
      <template v-slot:item.invitedNextMeeting="{ item }">
        <v-checkbox
          v-model="item.invitedNextMeeting"
          :indeterminate="item.invitedNextMeeting == null"
          :color="item.invitedNextMeeting ? 'success' : ''"
          @update:modelValue="statusChange(item)"
        />
      </template>
      <template v-slot:item.distribution="{ item }">
        <v-checkbox
          v-model="item.distribution"
          :indeterminate="item.distribution == null"
          :color="item.distribution ? 'success' : ''"
          @update:modelValue="statusChange(item)"
        />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon size="small" @click="deleteItem(item)" v-if="!(item.userId == userId)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <p class="text-h5 font-weight-medium mt-3">Il n'y a pas encore d'utilisateurs pour ce PV</p>
        <!-- <v-btn color="primary" class="mb-4" @click="initialize">Afficher</v-btn> -->
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="dialogQrCode" class="mx-auto text-center" max-width="70%">
    <v-card class="" title="Ajout de participant à la réunion">
      <v-card-text>
        <div>
          <img :src="qrcode" alt="QR Code" />
        </div>
        <p>Code : {{ otp.otp }}</p>
        <p>Expiration : {{ otpTimeRemaining }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="printQrCode">Imprimer</v-btn>
        <v-btn color="error" variant="text" @click="dialogQrCode = false">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  FormEmailRules,
  FormNameRules,
  FormPhoneRules,
  FormRequiredRules
} from '@/utilities/constantes.ts'
import {
  DEFAULT_PARTICIPANT,
  PARTICIPANT_HEADERS,
  PARTICIPANT_STATUS_PAE,
  USER_GROUPE_ITEMS
} from '@/utilities/dataConst'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import Axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAffairStore } from '../store/affair'
import { useNotificationStore } from '../store/notification'
import { useUserStore } from '../store/user'
import UserFormStatus from './UserFormStatus.vue'

import type { Participant, ParticipantStatus, User } from '@/utilities/types'

const userStore = useUserStore()
const affairStore = useAffairStore()
const notifStore = useNotificationStore()
const route = useRoute()

const participants = ref<Participant[]>([])
const allConnectedParticipants = ref<Participant[]>()

const pvId = ref<number>(Number(route.params.id))
const valid1 = ref(false)
const valid2 = ref(false)
const text = ref('text-to-encode')
const qrcode = useQRCode(text, { scale: 15 })
const otp = ref({})
const otpTimeRemaining = ref('')
const search = ref('')
const dialogNewOrModifiedUser = ref(false)
const dialogExistingUser = ref(false)
const dialogQrCode = ref(false)
const connectedParticipant = ref()
const editedIndex = ref(-1)
const editedItem = ref<Participant>({ ...DEFAULT_PARTICIPANT })

const formTitle = computed(() => {
  return editedIndex === -1 ? 'Ajouter une personne' : 'Modifier une personne'
})
const affairName = computed(() => affairStore.affair.name)
const userId = computed(() => userStore.user.userId)

onMounted(() => {
  pvId.value = Number(route.params.id)
  getParticipants()
})

async function getParticipants() {
  let dt = {
    params: {
      pvId: pvId.value,
      userId: userId.value
    }
  }
  const res = await Axios.get('pvs/pvId', dt)
  participants.value = res.data.participants
  allConnectedParticipants.value = res.data.connectedParticipants
  sortParticipantsByPosition()
}

function sortParticipantsByPosition() {
  if (participants.value) {
    participants.value.sort((a, b) => (a.position || 0) - (b.position || 0))
  }
}

function pushUpParticipant(item: Participant) {
  const oldIndex = participants.value.indexOf(item)
  const movedItem = participants.value.splice(participants.value?.indexOf(item), 1)[0]
  participants.value?.splice(oldIndex - 1, 0, movedItem)
  saveOrder()
}

function pushDownParticipant(item: Participant) {
  const oldIndex = participants.value.indexOf(item)
  const movedItem = participants.value.splice(participants.value?.indexOf(item), 1)[0]
  participants.value?.splice(oldIndex + 1, 0, movedItem)
  saveOrder()
}

function saveOrder() {
  const participantsData = participants.value.map((user, index) => ({
    pvId: pvId.value,
    userId: user.userId,
    position: index
  }))
  Axios.put('/participants/updatePositions', participantsData)
    .then((response) => {
      if (response.status === 200) {
        participants.value = response.data
        sortParticipantsByPosition()
        notifStore.success("L'ordre des participants a bien été sauvegardé")
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la sauvegarde des positions:', error)
      notifStore.error('Erreur lors de la sauvegarde des positions')
    })
}

function editItem(item: Participant) {
  editedIndex.value = participants.value.indexOf(item)
  editedItem.value = Object.assign({}, item)
  dialogNewOrModifiedUser.value = true
}

function deleteItem(item: Participant) {
  const index = participants.value.indexOf(item)
  confirm('Etes-vous sûr de vouloir supprimer cette personne?') &&
    Axios.delete('participants/userId', { params: { userId: item.userId, pvId: pvId.value } })
      .then((response) => {
        if (response.status == 204) {
          notifStore.success("L'utilisateur à bien été supprimé")
          participants.value.splice(index, 1)
        }
      })
      .catch((error) => {
        console.log(error)
      })
}

function closeNewOrModifiedUser() {
  dialogNewOrModifiedUser.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, DEFAULT_PARTICIPANT)
    editedIndex.value = -1
    // formReset()
  }, 300)
}

function registerUser(user: Participant) {
  return new Promise<User>((resolve, reject) => {
    Axios.post<User>('users', user)
      .then((response) => {
        if (response.status == 201) {
          user.userId = response.data.userId
          resolve(user)
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

function saveParticipant(participant: Participant) {
  return new Promise<Participant>((resolve, reject) => {
    Axios.put<Participant>('/participants/userId', participant)
      .then((res) => {
        if (res.status == 200) {
          resolve(res.data)
        } else {
          reject(res.status)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function saveNewOrModifiedUser() {
  let data = { ...editedItem.value }
  data.pvId = Number(pvId.value)
  if (editedIndex.value > -1) {
    //l'utilisateur existe, il faut le modifier
    saveParticipant(data).then((participant: Participant) => {
      Object.assign(participants.value[editedIndex.value], participant)
    })
  } else {
    //l'utilisateur n'existe pas, il faut le créer

    data.password = affairName.value
    registerUser(data).then((newUser: User) => {
      const participant: Participant = {
        ...newUser,
        pvId: pvId.value,
        statusPAE: data.statusPAE,
        invitedCurrentMeeting: data.invitedCurrentMeeting,
        invitedNextMeeting: data.invitedNextMeeting,
        distribution: data.distribution,
        position: participants.value.length
      }

      saveParticipant(participant).then((participant: Participant) => {
        participants.value.push(participant)
      })
    })
  }
  closeNewOrModifiedUser()
}

function closeExistingUser() {
  dialogExistingUser.value = false
  setTimeout(() => {
    editedItem.value = Object.assign({}, DEFAULT_PARTICIPANT)
    connectedParticipant.value = null
    editedIndex.value = -1
  }, 300)
}

function saveExistingUser() {
  let data = { ...connectedParticipant.value }
  data.pvId = pvId.value
  data.position = participants.value?.length
  Axios.post('participants', data).then((response) => {
    if (response.status == 201) {
      participants.value.push(response.data)
      const indexToRemove = allConnectedParticipants.value!.findIndex(
        (obj) => obj.userId === response.data.userId
      )
      if (indexToRemove !== -1) {
        allConnectedParticipants.value!.splice(indexToRemove, 1)
      }
      sortParticipantsByPosition()
      notifStore.success('Le participant à bien été ajouté')
    }
  })
  closeExistingUser()
}
function statusChange(item: Participant) {
  let statusData: ParticipantStatus = {
    pvId: pvId.value,
    userId: item.userId,
    statusPAE: item.statusPAE,
    invitedCurrentMeeting: item.invitedCurrentMeeting,
    invitedNextMeeting: item.invitedNextMeeting,
    distribution: item.distribution
  }

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

function generateQrCode() {
  text.value = `https://${window.location.hostname}/addHimSelfParticipant/pvId/${pvId.value}`
  getParticipantOtp().then(() => {
    startOtpCountdowns()
  })
  dialogQrCode.value = true
}

function getParticipantOtp() {
  return new Promise((resolve, reject) => {
    Axios.get('/participants/otp/pvId', { params: { pvId: pvId.value } })
      .then((res) => {
        if (res.status == 201) {
          otp.value = res.data
          resolve()
        }
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
  })
}

function startOtpCountdowns() {
  // Vérifier si expirationTimestamp existe et est un nombre valide
  if (!otp.value.expirationTimestamp) {
    console.error('expirationTimestamp est manquant ou invalide')
    return
  }

  // Convertir le timestamp de l'API (en secondes) en milliseconds
  const endTime = otp.value.expirationTimestamp * 1000
  const updateCountdown = () => {
    const now = new Date().getTime()
    const distance = endTime - now

    if (distance > 0) {
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      otpTimeRemaining.value = `${hours}h ${minutes}m ${seconds}s`
      setTimeout(updateCountdown, 1000)
    } else {
      getParticipantOtp()
    }
  }
  updateCountdown()
}

function printQrCode() {
  // Force a small delay to ensure the QR code is updated and rendered
  setTimeout(() => {
    // Create a clean print DOM structure that isolates the content properly
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      // Create the print content with proper HTML structure
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: white;
              }
              .print-container {
                text-align: center;
                max-width: 500px;
                margin: auto;
              }
              .qr-code-container {
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .qr-image {
                max-width: 100%;
                height: auto;
                margin-bottom: 20px;
              }
              .info-section {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 4px;
                font-size: 14px;
                margin-top: 20px;
              }
              .affair-name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 15px;
                margin-top: 25px;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              <h2>QR Code</h2>
              ${
                qrcode.value && qrcode.value.startsWith('data:image')
                  ? `<div class="qr-code-container">
                    <img src="${qrcode.value}" alt="QR Code" class="qr-image" />
                  </div>`
                  : '<p>QR Code not available</p>'
              }
              <div class="affair-name">${affairName.value || 'N/A'}</div>
              <div class="info-section">
                <p><strong>Code:</strong> ${otp.value.otp || 'N/A'}</p>
                <p><strong>Expiration:</strong> ${formatExpiryDate(otp.value.expirationTimestamp) || 'N/A'}</p>
              </div>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait a bit before printing to ensure content is ready
      setTimeout(() => {
        printWindow.print()

        // Close the window after a delay to prevent hanging
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 300)
    } else {
      console.error('Could not open print window')
    }
  }, 100)
}

// Helper function to format the expiration date
function formatExpiryDate(timestamp: number) {
  if (!timestamp) return 'N/A'

  // Convert timestamp (in seconds) to milliseconds and add 24 hours
  const expiryTime = new Date(timestamp * 1000 - 3600000)

  // Format as "lundi 4 decembre 14:30" style in French
  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }

  // Format the date part in French
  const formattedDate = expiryTime.toLocaleDateString('fr-FR', dateOptions)

  // Capitalize first letter of the weekday
  const formattedDateWithCap = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  // Get time part (hours and minutes in 24h format)
  const hours = expiryTime.getHours().toString().padStart(2, '0')
  const minutes = expiryTime.getMinutes().toString().padStart(2, '0')

  // Combine date and time
  return `${formattedDateWithCap} ${hours}:${minutes}`
}
</script>
