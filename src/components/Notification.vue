<template>
  <v-snackbar :value="state" top right :color="type" app>
    {{ text }}
    <v-icon :color="btnColor" :dark="isDark" @click="close">mdi-close-circle</v-icon>
  </v-snackbar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Notification",
  computed: {
    ...mapGetters("notification", {
      state: "state",
      text: "text",
      type: "type",
      btnColor: "btnColor",
      isDark: "isDark"
    })
  },

  methods: {
    close() {
      // this.$emit("update:snackbar", false);
      this.$store.dispatch("notification/close");
    }
  }
};
</script>
