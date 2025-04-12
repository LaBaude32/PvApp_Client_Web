<template>
  <v-card max-width="95%" class="mx-auto">
    <v-data-table :headers="PROGRESS_HEARDERS" :items="props.progress"> </v-data-table>
  </v-card>
  <v-container>
    <v-divider class="my-10" />
  </v-container>
</template>

<script setup lang="ts">
import { PROGRESS_HEARDERS } from '@/utilities/dataConst'
import type { Progress } from '@/utilities/types'

const props = defineProps<{ progress: Progress[] }>()
</script>
