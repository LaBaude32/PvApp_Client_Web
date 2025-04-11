<template>
  <v-card max-width="95%" class="mx-auto">
    <v-data-table :headers="SCHEDULE_HEARDERS" :items="pvDetails.schedules">
      <!-- <template v-slot:item.fullName="{ item }">
        <div>{{ item.firstName }} {{ item.lastName }}</div>
      </template>
      <template v-slot:item.statusPAE="{ item }">
        <div>
          {{ item.statusPAE }} {{ item.invitedCurrentMeeting ? 'C1' : '' }}
          {{ item.invitedNextMeeting ? 'C2' : '' }} {{ item.distribution ? 'D' : '' }}
        </div>
      </template> -->
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Axios from 'axios'

const route = useRoute()

const pvDetails = ref({})

const SCHEDULE_HEARDERS = [
  {
    title: 'Lot',
    value: 'lotName'
  },
  {
    title: 'Prévisionnel',
    value: 'description'
  },
  {
    title: 'Echéance',
    value: 'deadline'
  }
]

onMounted(() => {
  getPvData()
})

async function getPvData() {
  let dt = {
    params: {
      pvId: route.params.id
    }
  }
  let res = await Axios.get('pvs/pvId/released', dt)
  pvDetails.value = res.data.pv
}
</script>
