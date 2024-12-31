import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const text = ref('')
  const color = ref('')
  const state = ref(false)
  const btnColor = ref('red')
  const isDark = ref(false)
  const timeout = ref(3000)

  function close() {
    text.value = ''
    state.value = false
    color.value = 'grey'
  }

  function success(val: string) {
    text.value = val
    color.value = 'green'
    state.value = true
  }

  function error(val: string) {
    text.value = val
    color.value = 'red'
    state.value = true
  }

  return { success, close, timeout, state, color, text, error }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
