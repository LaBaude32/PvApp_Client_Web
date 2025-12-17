<template>
  <div class="text-center">
    <v-container>
      <v-row>
        <v-col>
          <v-btn color="primary" @click="createAffair" size="x-large">Créer une affaire</v-btn>
        </v-col>
        <v-col v-if="pvs != ''">
          <v-btn color="primary" @click="createPv" size="x-large">Ajouter un Pv</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="pvs != ''">
      <h1 class="text-primary">Vos 2 derniers procès verbaux :</h1>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="pv in pvs" v-bind:key="pv.id">
          <v-card class="mx-auto align-center pt-4" color="primary" variant="tonal">
            <v-list-item>
              <v-list-item>
                <v-list-item-title class="text-h6 font-weight-medium mb-1">
                  Réunion du :
                  {{ $filters.formatDate(pv.meetingDate) }}
                </v-list-item-title>
                <v-list-item-subtitle>Affaire : {{ pv.affairName }}</v-list-item-subtitle>
                <v-card-text>
                  <v-btn
                    v-if="pv.state == 'Terminé'"
                    class="ma-2"
                    color="tertiary"
                    @click="openFinishedPv(pv.pvId)"
                  >
                    <v-icon class="mr-2">mdi-checkbox-marked-circle</v-icon>
                    {{ pv.state }}
                  </v-btn>
                  <v-btn v-else class="ma-2" color="primary" @click="openPv(pv.pvId)">
                    <v-icon class="mr-2">mdi-autorenew</v-icon>
                    {{ pv.state }}
                  </v-btn>
                  <div v-if="pv.meetingNextDate">
                    Prochaine réunion : {{ $filters.formatDate(pv.meetingNextDate) }}
                  </div>
                </v-card-text>
              </v-list-item>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="affairs != ''">
      <v-card title="Vos affaires en cours :" variant="tonal" color="primary">
        <template v-slot:text>
          <v-text-field
            v-model="search"
            label="Rechercher"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="affairs" :search="search">
          <template v-slot:item.action="{ item }">
            <v-btn color="primary" variant="text" @click="openAffair(item.affairId)">Ouvrir</v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
    <v-container v-else class="px-10">
      <v-alert type="info" outlined color="tertiary-container">
        <p class="text-h6">Vous n'avez pas encore d'affaires.</p>
        <p>Veuillez commencer par en créer une en cliquant sur le bouton ci-dessus</p>
      </v-alert>
    </v-container>
  </div>
</template>

<script setup>
import Axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import routesCONST, { getRouteName } from '../utilities/constantes.ts'
const userStore = useUserStore()
const router = useRouter()

const pvs = ref([])
const affairs = ref([])
const search = ref('')
const headers = [
  {
    align: 'center',
    key: 'name',
    sortable: true,
    title: 'Nom'
  },
  { align: 'center', key: 'address', title: 'Adresse', sortable: false },
  { align: 'center', key: 'meetingType', title: "Type d'affaire" },
  { align: 'center', key: 'action', sortable: false }
]

const userId = computed(() => {
  return userStore.user.userId
})

function openAffair(affairId) {
  router.push({
    name: 'Affair',
    params: { id: affairId }
  })
}

function openPv(pvId) {
  router.push({
    name: 'Pv',
    params: { id: pvId }
  })
}

function openFinishedPv(pvId) {
  router.push({
    name: getRouteName('finishedPv'),
    params: { id: pvId }
  })
}
function createAffair() {
  router.push({ name: routesCONST.addAffair.name })
}
function createPv() {
  router.push(getRouteName('addPv'))
}

onMounted(() => {
  const dtPvs = {
    params: {
      userId: userId.value,
      numberOfPvs: 2
    }
  }
  const dtAffairs = {
    params: {
      userId: userId.value
    }
  }
  if (typeof userId.value != undefined) {
    Axios.get('pvs/userId', dtPvs).then(function (response) {
      // handle success
      pvs.value = response.data
    })
    Axios.get('affairs/userId', dtAffairs).then(function (response) {
      // handle success
      affairs.value = response.data
    })
  }
})
</script>
