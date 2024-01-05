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
        <template v-slot:item.image="{ item }">
          <v-img max-width="150" :src="MyThumbnail(item.image)" @click="OpenImage(item.image)"></v-img>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="MyImageDialog" max-width="800px">
      <v-card>
        <v-img contain max-height="750" :src="MyImageSrc"></v-img>
        <v-card-actions>
          <v-spacer />
          <v-btn color="error" @click="MyImageDialog = false"> Fermer </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const imgURL = import.meta.env.VITE_BACKEND_IMAGE_URL;
export default {
  props: {
    items: Array,
    headers: Array,
    sortBy: String
  },
  data() {
    return {
      MyImageDialog: false
    };
  },
  methods: {
    MyThumbnail(imageName) {
      return imgURL + imageName;
    },
    OpenImage(imageName) {
      this.MyImageSrc = imgURL + imageName;
      this.MyImageDialog = true;
    }
  }
};
</script>
