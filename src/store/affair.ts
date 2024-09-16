import Axios from 'axios'
import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStore } from 'vuex'

interface affair {
  affairId: number
  name: string
  meetingType: 'Chantier' | 'Etude'
  adresse: string
  progress: number
}

export const useAffairStore = defineStore('affair', () => {
  // const affairId = ref<number>()
  // const name = ref('')
  // const meetingType = ref<'Chantier' | 'Etude'>()
  // const address = ref('')
  // const progress = ref(0)
  const affair = ref<affair>()
  const store = useStore()

  //   function loadAffairByPv(affairId) {
  function getAffairById(affairId) {
    console.log(affairId)
    Axios.get('affairs/affairId', {
      params: {
        affairId: affairId
      }
    }).then((response) => {
      affair.value = response.data.affairInfos
    })
  }

  function openPv(pvId) {
    //FIXME: Corriger ça, ce call API n'a pas de sens puisqu'il est refait à l'ouverture de la page
    Axios.get('pvs/pvId', {
      params: {
        pvId: pvId,
        userId: store.getters['user/userId']
      }
    }).then((response) => {
      getAffairById(response.data.pv.affairId)
    })
  }

  return { affair, getAffairById, openPv }
})

// @ts-expect-error
if (import.meta.hot) {
  // @ts-expect-error
  import.meta.hot.accept(acceptHMRUpdate(useAffairStore, import.meta.hot))
}
