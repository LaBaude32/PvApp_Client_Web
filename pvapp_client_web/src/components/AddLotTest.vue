<template>
  <v-container>
    <div>
      <v-text-field v-for="lot in numberLots" :key="lot.id" :label="'lot ' + lot" :value="'test ' + lot" append-outer-icon="mdi-delete" @click:append-outer="deleteLot(lot)"></v-text-field>
      <v-btn class="mx-2" fab dark small color="primary">
        <v-icon dark>mdi-minus</v-icon>
      </v-btn>
    </div>
    <v-btn @click="addLot"> Ajouter un lot</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "AddLot",
  data() {
    return {
      numberLots: 2
    };
  },
  methods: {
    addLot() {
      this.numberLots++;
    },
    deleteLot(index) {
      console.log(index);
      //TODO: supprimer l'élément renvoyé
    }
  }
};
</script>
