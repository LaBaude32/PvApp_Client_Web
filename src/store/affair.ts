import Axios from 'axios'
import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useNotificationStore } from './notification'
import type { Lot, Affair } from '@/utilities/types'

export const useAffairStore = defineStore('affair', () => {
  const affair = ref<Affair>()
  const notifStore = useNotificationStore()

  function getAffairById(affairId: Number) {
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

  function registerAffair(gettedAffair: Affair) {
    affair.value = gettedAffair
  }

  function registerLotOnAffair(gettedLots: Lot[]) {
    affair.value!.lots = gettedLots
  }

  return { affair, getAffairById, registerAffair, registerLotOnAffair }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAffairStore, import.meta.hot))
}
