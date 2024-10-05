import { acceptHMRUpdate, defineStore } from 'pinia'
import Axios from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './user'
import type { userDataForLogin } from '../utilities/types'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const router = useRouter()
    const userStore = useUserStore()

    const tokenType = ref<string>()
    const token = ref<string>()
    const status = ref<'Loading' | 'Error' | 'Success'>()
    const isAuthenticated = computed(() => !!token.value)

    function authRequest(data: userDataForLogin) {
      return new Promise<void>((resolve, reject) => {
        // The Promise used for router redirect in login
        status.value = 'Loading'
        Axios({ url: '/tokens', data, method: 'POST' })
          .then((response) => {
            const recivedToken = response.data.access_token
            const recivedTokenType = response.data.token_type
            Axios.defaults.headers.common['Authorization'] = recivedTokenType + ' ' + recivedToken
            token.value = recivedToken
            tokenType.value = recivedTokenType
            status.value = 'Success'
            resolve()
          })
          .catch((error) => {
            status.value = 'Error'
            authLogout()
            reject()
          })
      })
    }
    function authLogout() {
      return new Promise<void>((resolve) => {
        token.value = undefined
        tokenType.value = undefined

        userStore.logout()
        delete Axios.defaults.headers.common['Authorization']
        router.push('Login')
        resolve()
      })
    }
    function authError() {
      userStore.errorId()
    }

    function setAxios() {
      Axios.defaults.headers.common['Authorization'] = tokenType.value + ' ' + token.value
    }

    return { isAuthenticated, authLogout, authError, authRequest, token, tokenType, setAxios }
  },
  { persist: true }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
