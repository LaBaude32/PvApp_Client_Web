<template>
  <div class="counter">
    <Counter />
  </div>
</template>

<script>
// @ is an alias to /src
import Counter from "@/components/Counter.vue";

export default {
  name: "CounterView",
  components: {
    Counter
  }
};
</script>
