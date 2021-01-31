<template>
  <div>
    <PvTest :meeting_type="meeting_type" :items="items" :pvDetails="pvDetails" :pvUsers="pvUsers" v-if="meeting_type" />
    <v-skeleton-loader class="mx-auto" max-width="1000" type="table" v-else></v-skeleton-loader>
  </div>
</template>

<script>
import PvTest from "@/components/PvTest.vue";
import { mapGetters } from "vuex";
import Axios from "axios";
export default {
  components: {
    PvTest
  },
  data() {
    return {
      pvDetails: {},
      pvUsers: [],
      items: []
    };
  },
  computed: {
    ...mapGetters("affair", {
      meeting_type: "meeting_type"
    })
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.idPv = this.$route.params.id;
      let dt = {
        params: {
          id_pv: this.$route.params.id
        }
      };
      let res = await Axios.get("getPvDetails", dt);
      if (typeof res.data.items !== "string") {
        this.items = res.data.items;
      }
      this.pvDetails = res.data.pv_details;
      this.pvUsers = res.data.users;
      this.$store.dispatch("affair/loadAffairByPv", this.pvDetails.affair_id);
    }
  }
};
</script>
