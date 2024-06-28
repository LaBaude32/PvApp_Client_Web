<template>
  <v-btn @click="openDialog">Nouveau Pv</v-btn>
  <v-dialog v-model="dialog" max-width="80%">
    <TestModifyPv
      v-model:pvData="pvData"
      v-model:isFormValid="isFormValid"
      :validateForm="pvModifySave"
      :affairs="affairsForPv"
      :pvModifyingType="pvModifyingType"
      :cancel="cancelPvModify"
      :isNewPv="isNewPv"
    />
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import Axios from 'axios'
import TestModifyPv from '../components/TestModifyPv.vue'

const store = useStore()

const isFormValid = ref(false)
const affairsForPv = ref([])
const pvModifyingType = ref(false)
const dialog = ref(false)
const isNewPv = ref(false)

const pvData = reactive({
  meetingDateDate: ref(null),
  meetingDateTime: ref(null),
  meetingNextDateDate: ref(null),
  meetingNextDateTime: ref(null),
  meetingPlace: ref(null),
  meetingNextPlace: ref(null),
  affairId: ref(null)
})

onMounted(async () => {
  const dtAffairs = {
    params: {
      userId: store.state.user.userId
    }
  }
  if (typeof userId != undefined) {
    Axios.get('affairs/userId', dtAffairs)
      .then(function (response) {
        affairsForPv.value = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  } else {
    store.dispatch('auth/authLogout')
  }
})

function openDialog() {
  isNewPv.value = true
  dialog.value = true
}

function cancelPvModify() {
  for (const key in pvData) {
      pvData[key] = null
  }
  isNewPv.value = false
  dialog.value = false
}

function pvModifySave() {
  console.log(pvData.meetingDateDate)
  // let data = {
  //   pvId: pvData.pvId,
  //   meetingDate: pvData.meetingDateDate + ' ' + pvData.meetingDateTime + ':00',
  //   meetingPlace: pvData.meetingPlace,
  //   meetingNextPlace: pvData.meetingNextPlace,
  //   state: pvData.state,
  //   affairId: $route.params.id,
  //   userId: userId
  // }
  // if (pvData.meetingNextDate != '') {
  //   data = { meetingNextDate: pvData.meetingNextDate + ':00', ...data }
  // }
  // let apiRoute
  // let apiMethode
  // pvModifyingType ? ((apiRoute = 'pvs/pvId'), (apiMethode = 'put')) : ((apiRoute = '/pvs'), (apiMethode = 'post'))
  // Axios({ method: apiMethode, url: apiRoute, data: data })
  //   .then((response) => {
  //     if (response.status == 200 || response.status == 201) {
  //       dialog = false
  //       pvModifyDialog = false
  //       if (!pvModifyingType) {
  //         // pvData.pvId = response.data.pv.pvId;
  //         // pvData.pvNumber = response.data.pv.pvNumber;
  //         pvs.push(response.data)
  //       }
  //       $store.dispatch('notification/success', 'Pv correctement enregistré')
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
}
</script>
