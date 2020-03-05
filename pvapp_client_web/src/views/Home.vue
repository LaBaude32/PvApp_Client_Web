<template>
  <div class="home">
    <p>{{ test }}</p>
    <v-btn color="primary" @click.prevent="invertValue">Inverser</v-btn>
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data() {
    return {
      test: "test"
    };
  },
  computed: mapGetters({
    loggedStore: "logged"
  }),
  logged() {
    console.log("hello"); //FIXME : il ne detecte pas le changement de valeur
    this.test = this.loggedStore();
  },
  methods: mapActions({
    invertValue: "invert"
  })
};
</script>
