<template>
  <div>
    <Pv :meeting_type="meeting_type" />
  </div>
</template>

<script>
import Pv from "@/components/Pv.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Pv
  },
  computed: {
    ...mapGetters("affair", {
      meeting_type: "meeting_type"
    })
  }
};
</script>
