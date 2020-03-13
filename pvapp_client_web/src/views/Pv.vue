<template>
  <div>
    {{ pv }}
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      idPv: "",
      pv: ""
    };
  },
  mounted() {
    this.idPv = this.$route.params.id;
    let dt = {
      params: {
        id_pv: this.$route.params.id
      }
    };
    Axios.get("getPvDetails", dt).then(response => {
      this.pv = response.data;
    });
  }
};
</script>
