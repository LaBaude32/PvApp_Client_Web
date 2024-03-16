import axios from "axios"

import { createApp } from "vue"
import store from "./store"
import router from "./router"
import filters from "./utilities/filters"

import App from "./App.vue"

// Vuetify
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

const vuetify = createVuetify({
  components,
  directives
})

const token = localStorage.getItem("token")
const tokenType = localStorage.getItem("tokenType")
if (token) {
  axios.defaults.headers.common["Authorization"] = tokenType + " " + token
}

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API_URL

const app = createApp(App)
app.use(store)
app.use(vuetify)
app.use(router)

app.config.globalProperties.$filters = { ...filters }

app.mount("#app")
