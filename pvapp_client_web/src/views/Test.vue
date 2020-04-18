<template>
  <div>
    <PvTest :meeting_type="meeting_type" />
  </div>
</template>

<script>
import PvTest from "@/components/PvTest.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    PvTest
  },
  computed: {
    ...mapGetters("affair", {
      meeting_type: "meeting_type"
    })
  }
};
</script>

