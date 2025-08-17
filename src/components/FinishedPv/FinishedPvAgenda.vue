<template>
  <v-card max-width="95%" class="mx-auto">
    <v-data-table :headers="AGENDA_HEARDERS" :items="props.agendas"> </v-data-table>
  </v-card>
  <v-container>
    <v-divider class="my-10" />
  </v-container>
</template>

<script setup lang="ts">
import { AGENDA_HEARDERS } from '@/utilities/dataConst'
import { type Agenda } from '@/utilities/types'

const props = defineProps<{ agendas: Agenda[] }>()
</script>
