<template>
  <v-dialog v-model="dialog" max-width="70%" persistent>
    <ModifyAffair v-model:affairDatas="affair" :validate="validate" @close-dialog="cancelDialog" />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Axios from 'axios'
import { useRouter } from 'vue-router'
import routesCONST from '../utilities/constantes'
import ModifyAffair from '@/components/ModifyAffair.vue'
import { useUserStore } from '../store/user'

const router = useRouter()
const userStore = useUserStore()

const affair = ref({ description: '' })
const dialog = ref(false)

onMounted(() => {
  dialog.value = true
})

function validate() {
  Axios.post('/affairs', affair.value)
    .then((response) => {
      if (response.status == 201) {
        const affairId = response.data.affairId
        const pvData = {
          state: 'En cours',
          meetingPlace: 'Indéfini',
          meetingDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
          userId: userStore.user.userId,
          affairId: affairId
        }
        Axios.post('/pvs', pvData)
          .then((response) => {
            if (response.status == 201) {
              router.push({
                name: routesCONST.affair.name,
                params: { id: affairId }
              })
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

function cancelDialog() {
  router.push('board')
}
</script>
