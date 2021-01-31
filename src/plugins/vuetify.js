import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

import fr from "vuetify/es5/locale/fr";

export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  lang: {
    locales: { fr },
    current: "fr"
  }
});
