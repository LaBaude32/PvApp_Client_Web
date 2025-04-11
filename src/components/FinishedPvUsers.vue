<template>
  <div>
    <v-container>
      <p class="text-caption text-end">
        C1 : convié/convoqué à la présente réunion - P : présent - A : Absent - E : excusé - C2 :
        convié à la prochaine réunion du 08-04-2025 à 10:00 - D : Diffusion
      </p></v-container
    >
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
        <template v-slot:item.statusPAE="{ item }">
          <div>
            {{ item.statusPAE }} {{ item.invitedCurrentMeeting ? 'C1' : '' }}
            {{ item.invitedNextMeeting ? 'C2' : '' }} {{ item.distribution ? 'D' : '' }}
          </div>
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
