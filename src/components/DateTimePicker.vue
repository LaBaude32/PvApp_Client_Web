<template>
  <div>
    <v-row>
      <v-col max-width="600" class="mx-auto px-1">
        <v-date-picker v-model="datepicker" locale="fr-fr"></v-date-picker>
        <v-time-picker v-model="timepicker" format="24hr" scrollable></v-time-picker>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "DateTimePicker",
  props: {
    inputDate: { type: String, default: new Date().toISOString().substr(0, 10) }
  },
  data: () => ({
    datepicker: new Date().toISOString().substr(0, 10),
    timepicker: Number(new Date().toISOString().substr(11, 2)) + ":00",
    test: new Date().toISOString().substr(11, 2)
  }),
  computed: {
    result() {
      return this.datepicker + " " + this.timepicker;
    }
  }
};
</script>
