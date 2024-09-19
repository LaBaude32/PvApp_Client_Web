import Axios from 'axios'
import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useNotificationStore } from './notification'

interface affair {
  affairId: number
  name: string
  meetingType: 'Chantier' | 'Etude'
  adresse: string
  progress: number
  lots?: [string]
}

export const useAffairStore = defineStore('affair', () => {
  const affair = ref<affair>()
  const notifStore = useNotificationStore()

  function getAffairById(affairId) {
    Axios.get('affairs/affairId', {
      params: {
        affairId: affairId
      }
    })
      .then((response) => {
        affair.value = response.data.affairInfos
      })
      .catch((error) => {
        notifStore.error('Erreur sur la récueration des données : ' + error.response)
      })
  }

  function registerAffair(gettedAffair: affair) {
    affair.value = gettedAffair
  }

  function registerLotOnAffair(gettedLots: [string]) {
    affair.value!.lots = gettedLots
  }

  return { affair, getAffairById, registerAffair, registerLotOnAffair }
})

// @ts-expect-error
if (import.meta.hot) {
  // @ts-expect-error
  import.meta.hot.accept(acceptHMRUpdate(useAffairStore, import.meta.hot))
}
