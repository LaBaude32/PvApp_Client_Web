<template>
  <div>
    <div>
      {{ users }}
    </div>
    <v-data-table :headers="headers" :items="users" item-key="name" group-by="category" class="elevation-1" show-group-by></v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    headers: Array
  }
};
</script>
