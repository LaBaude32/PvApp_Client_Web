<template>
  <div>
    Params : {{param}}
    Affaire :
    {{affair.name}}
  </div>
</template>

<script>
// FIXME: SESSION : quand on est sur cette page le router ne fonctionne pas

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
    //FIXME: SESSION: Pourquoi il ne se passe rien ?
    axios
      .get("getAffairById", affairId)
      .then(response => {
        this.affair = response.data;
        alert("test");
        console.log(response.data);
      })
      .catch(error => {
        alert("test");
        console.log(error);
      });
    //recperer les pvs de l'affair
  }
};
</script>
