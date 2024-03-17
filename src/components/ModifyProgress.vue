<template>
  <v-card>
    <v-card-title>Modifier la progression de l'affaire</v-card-title>
    <v-card-text>
      <div class="text-center mt-10">
        <v-progress-circular :value="myProgressValue" color="deep-orange lighten-2" size="80" width="8">
          {{ myProgressValue }} %
        </v-progress-circular>
      </div>
      <v-slider
        v-model="myProgressValue"
        color="orange"
        thumb-label
        step="5"
        show-ticks="always"
        tick-size="2"
        class="mt-10"
      ></v-slider>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="modifyProgressSave">Enregistrer</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ModifyProgress',
  props: {
    progressValue: Number,
    modifyProgressSave: Function
  },
  emits: ['update:progressValue'],
  data() {
    return {}
  },
  computed: {
    myProgressValue: {
      get() {
        return this.progressValue
      },
      set(val) {
        this.$emit('update:progressValue', val)
      }
    }
  }
}
</script>
