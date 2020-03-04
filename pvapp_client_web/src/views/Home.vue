<template>
  <div class="home">
    <p>{{ isLogged }}</p>

    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  computed: {
    isLogged() {
      console.log(this.$store.getter.count);
      return this.$store.count;
    }
  }
};
</script>
