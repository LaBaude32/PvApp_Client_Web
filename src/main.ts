import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import filters from './utilities/filters.js'

// Vuetify
import { myCustomDarkTheme, myCustomLightTheme } from '@/assets/theme.ts'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createVuetify } from 'vuetify'
import { fr } from 'vuetify/locale'
import 'vuetify/styles'

const vuetify = createVuetify({
  locale: {
    locale: 'fr',
    messages: { fr }
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
      myCustomDarkTheme
    }
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
