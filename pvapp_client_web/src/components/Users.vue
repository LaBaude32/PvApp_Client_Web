<template>
  <v-card max-width="95%" class="mx-auto mb-10">
    <v-data-table :headers="headers" :items="desserts" item-key="name" group-by="group"></v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          value: "name"
        },
        { text: "Ici", value: "group" }
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          group: "Ice cream"
        },
        {
          name: "Ice cream sandwich",
          group: "Ice cream"
        },
        {
          name: "Eclair",
          group: "Cookie"
        },
        {
          name: "Cupcake",
          group: "Pastry"
        },
        {
          name: "Gingerbread",
          group: "Cookie"
        },
        {
          name: "Jelly bean",
          group: "Candy"
        },
        {
          name: "Lollipop",
          group: "Candy"
        },
        {
          name: "Honeycomb",
          group: "Toffee"
        },
        {
          name: "Donut",
          group: "Pastry"
        },
        {
          name: "KitKat",
          group: "Candy"
        }
      ]
    };
  }
};
</script>