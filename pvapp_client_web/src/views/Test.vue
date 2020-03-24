<template>
  <v-row>
    <v-col cols="11" sm="5">
      <v-menu ref="menu" v-model="menu2" :close-on-content-click="false" :nudge-right="40" :return-value.sync="time" transition="scale-transition" offset-y max-width="290px" min-width="290px">
        <template v-slot:activator="{ on }">
          <v-text-field v-model="time" label="Picker in menu" prepend-icon="access_time" readonly v-on="on"></v-text-field>
        </template>
        <v-time-picker v-if="menu2" v-model="time" full-width @click:minute="$refs.menu.save(time)"></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      time: "14:00",
      menu2: false
    };
  }
};
</script>