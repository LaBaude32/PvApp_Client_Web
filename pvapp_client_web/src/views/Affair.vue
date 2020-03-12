<template>
  <div>
    Params : {{param}}
    Affaire :
    {{affair.name}}
  </div>
</template>

<script>
import { axios } from "axios";
export default {
  data() {
    return {
      affair: {}
    };
  },
  computed: {
    param() {
      return this.$route.params;
    }
  },
  mounted() {
    // recuperer les infos de l'affair
    let affairId = this.$route.params.id;
    axios.get("getAffairById", affairId).then(response => {
      this.affair = response.data;
      console.log(response.data);
    });
    //recperer les pvs de l'affair
  }
};
</script>
