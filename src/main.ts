import axios from 'axios'
import { createApp } from 'vue'
import router from './router/index'
import filters from './utilities/filters.js'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fr } from 'vuetify/locale'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const vuetify = createVuetify({
  components: {
    ...components
  },
  directives,
  locale: {
    locale: 'fr',
    messages: { fr }
  }
  // date: {
  //   locale: {
  //     fr: 'fr-FR',
  //   },
  // },
})

const token = localStorage.getItem('token')
const tokenType = localStorage.getItem('tokenType')
if (token) {
  axios.defaults.headers.common['Authorization'] = tokenType + ' ' + token
}

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_API_URL
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(vuetify)
app.use(router)

app.config.globalProperties.$filters = { ...filters }

app.mount('#app')
