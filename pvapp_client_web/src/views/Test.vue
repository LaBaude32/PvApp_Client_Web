<template>
  <div>{{ test }} <br /></div>
</template>

<script>
const MD5 = require("md5.js");
export default {
  data() {
    return {
      hello: "1234",
      hash: "098f6bcd4621d373cade4e832627b4f6"
    };
  },
  computed: {
    test() {
      return new MD5().update(this.hello).digest("hex");
    },
    test2() {
      return new MD5().update("test").digest("hex");
    },
    result() {
      let md5stream = new MD5();
      md5stream.end("test");
      return md5stream.read().toString("hex");
    }
  }
};
</script>
