<template>
  <v-dialog v-model="MyDialog" persistent max-width="350">
    <v-card>
      <v-card-title class="text-h5">Voulez-vous valider le PV ?</v-card-title>
      <v-card-text>
        Si vous validez votre procès verbal, son status passera à "Terminé". Il pourra alors être imprimé, publié et partagé. <br />
        Vous ne pourrez plus le modifier directement.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="MyDialog = false">Non</v-btn>
        <v-btn color="green darken-1" text @click="validate">Oui</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ModalValidation",
  props: {
    dialog: Boolean,
    validate: Function
  },
  data() {
    return {};
  },
  computed: {
    MyDialog: {
      get() {
        return this.dialog;
      },
      set(val) {
        this.$emit("update:dialog", val);
      }
    }
  }
};
</script>
