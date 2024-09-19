<template>
  <div class="text-center">
    <h1>Votre dashboard :</h1>
    <v-spacer></v-spacer>
    <v-container>
      <v-row class="grey lighten-3 mx-1">
        <v-col>
          <v-btn class="mx-auto my-3" color="primary" @click="createAffair">Creer une affaire</v-btn>
        </v-col>
        <v-col v-if="pvs != ''">
          <v-btn class="mx-auto my-3" color="primary" @click="createPv">Ajouter un Pv</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="pvs != ''">
      <h2>Vos 2 derniers procès verbaux :</h2>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="pv in pvs" v-bind:key="pv.id">
          <v-card class="mx-auto" color="blue-grey-lighten-5" min-height="185">
            <v-list-item three-line>
              <v-list-item>
                <v-list-item-title class="text-h6 mb-1">
                  Réunion du :
                  {{ $filters.formatDate(pv.meetingDate) }}
                </v-list-item-title>
                <v-list-item-subtitle>Affaire : {{ pv.affairName }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <v-btn
                    v-if="pv.state == 'Terminé'"
                    class="ma-2"
                    color="green darken-2"
                    @click="openFinishedPv(pv.pvId)"
                  >
                    {{ pv.state }}
                    <v-icon right>mdi-checkbox-marked-circle</v-icon>
                  </v-btn>
                  <v-btn v-else class="ma-2" color="orange darken-3" @click="openPv(pv.pvId)">
                    {{ pv.state }}
                    <v-icon right>mdi-autorenew</v-icon>
                  </v-btn>
                  <div v-if="pv.meetingNextDate">Prochaine réunion : {{ $filters.formatDate(pv.meetingNextDate) }}</div>
                </v-card-text>
              </v-list-item>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="affairs != ''">
      <h2>Vos affaires en cours :</h2>
      <v-row justify="center" class="mt-3">
        <v-col cols="12" md="6" v-for="affair in affairs" v-bind:key="affair.affairId">
          <v-card class="mx-auto" color="blue-grey-lighten-5" outlined>
            <v-list-item three-line>
              <v-list-item>
                <v-list-item-title class="text-h6 mb-1">{{ affair.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ affair.meetingType }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ affair.address }}</v-list-item-subtitle>
                <v-card-text class="text--primary">
                  <div class="text-center">
                    <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">
                      {{ affair.progress }} %
                    </v-progress-circular>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer>
                    <v-btn color="success" @click="openAffair(affair.affairId)">Ouvrir</v-btn>
                  </v-spacer>
                </v-card-actions>
              </v-list-item>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else class="px-10">
      <v-alert type="info" outlined>
        <p class="text-h6">Vous n'avez pas encore d'affaires.</p>
        <p>Veuillez commencer par en créer une en cliquant sur le bouton ci-dessus</p>
      </v-alert>
    </v-container>
  </div>
</template>

<script setup>
import Axios from 'axios'
import routesCONST, { getRouteName } from '../utilities/constantes'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const store = useStore()
const router = useRouter()

const pvs = ref([])
const affairs = ref([])

const userId = computed(() => {
  return store.getters['user/userId']
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
  } else {
    store.dispatch('auth/authLogout')
  }
})
</script>
