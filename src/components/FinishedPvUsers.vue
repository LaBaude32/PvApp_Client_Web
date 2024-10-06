<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table
        :headers="headers"
        :items="users"
        :sort-by="sortBy"
        :items-per-page="-1"
        hide-default-footer
      >
        <template v-slot:item.fullName="{ item }">
          <div>{{ item.firstName }} {{ item.lastName }}</div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/utilities/types'

defineProps<{
  users: User[]
  headers: object[]
  sortBy: { key: string }[]
}>()
</script>
