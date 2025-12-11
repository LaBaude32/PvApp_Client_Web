import { defineStore } from 'pinia'
import { ref } from 'vue'

// Définir le store userSettings avec état persistant
export const useUserSettingsStore = defineStore('userSettings', () => {
  // État pour suivre le thème actuel (clair ou sombre)
  const currentTheme = ref<'myCustomLightTheme' | 'myCustomDarkTheme'>('myCustomLightTheme')

  // Fonction pour basculer entre les thèmes
  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'myCustomLightTheme'
      ? 'myCustomDarkTheme'
      : 'myCustomLightTheme'
  }

  // Fonction pour définir un thème spécifique
  function setTheme(theme: 'myCustomLightTheme' | 'myCustomDarkTheme') {
    currentTheme.value = theme
  }

  return { currentTheme, toggleTheme, setTheme }
}, {
  persist: true,
})
