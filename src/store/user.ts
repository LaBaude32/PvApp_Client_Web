import Axios from 'axios'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { userDataForLogin } from '../utilities/types'

interface user {
  firstName: string
  lastName: string
  email: string
  userId: number
}

export const useUserStore = defineStore(
  'user',
  () => {
    const router = useRouter()

    const user = ref<user>()
    const fullName = computed(() => `${user.value?.firstName} ${user.value?.lastName}`)
    const isLogged = ref(false)
    const resultCo = ref<'Success' | 'ErrorId' | 'ErrorConnection'>()

    function login(data: userDataForLogin) {
      return new Promise<void>((resolve) => {
        Axios({ url: '/login', params: data, method: 'get' }).then(function (response) {
          if (response.status == 202) {
            user.value = {
              userId: response.data.userId,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email
            }
            resultCo.value = 'Success'
            isLogged.value = true
            resolve()
          }
        })
      })
    }

    function logout() {
      isLogged.value = false
      resultCo.value = undefined
      user.value = undefined
      router.push('Login')
    }

    function errorId() {
      resultCo.value = 'ErrorId'
    }

    return { logout, errorId, isLogged, fullName, user, resultCo, login }
  },
  { persist: true }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
