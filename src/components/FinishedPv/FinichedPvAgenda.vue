<template>
  <v-card max-width="95%" class="mx-auto">
    <v-data-table
      :headers="AGENDA_HEARDERS"
      :items="agendas"
      :sort-by="position"
      :items-per-page="-1"
      hide-default-footer
    >
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
import { AGENDA_HEARDERS } from '@/utilities/dataConst'
import { type Agenda } from '@/utilities/types'

const props = defineProps<{ agendas: Agenda[] }>()
</script>
