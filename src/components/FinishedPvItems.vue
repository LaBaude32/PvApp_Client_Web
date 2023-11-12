<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="items" :sort-by="sortBy" :items-per-page="-1" hide-default-footer>
        <template v-slot:item.lots="{ item }">
          <v-chip v-for="lot in item.lots" :key="lot.id" class="ma-1" color="orange" dark>
            {{ lot.name }}
          </v-chip>
        </template>
        <template v-slot:item.completionDate="{ item }">
          {{ item.completionDate | formatDateShortDayOnly }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    headers: Array,
    sortBy: String
  }
};
</script>
