<template>
  <v-card max-width="95%" class="mx-auto">
    <v-data-table :headers="SCHEDULE_HEARDERS" :items="props.schedules"> </v-data-table>
  </v-card>
  <v-container>
    <v-divider class="my-10" />
  </v-container>
</template>

<script setup lang="ts">
import { SCHEDULE_HEARDERS } from '@/utilities/dataConst'
import type { Schedule } from '@/utilities/types'

const props = defineProps<{ schedules: Schedule[] }>()
</script>
