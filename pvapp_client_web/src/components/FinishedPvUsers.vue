<template>
  <div>
    <v-card max-width="95%" class="mx-auto">
      <v-data-table :headers="headers" :items="users" item-key="name" :group-by="groupBy">
        <template v-slot:item.fullName="{ item }">
          <div>{{ item.lastName }} {{ item.firstName }}</div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    headers: Array,
    groupBy: String
  }
};
</script>
