<template>
  <div v-if="affair" class="mb-10 text-center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <ModifyProgress
        v-if="progressDialog"
        v-model:progressValue="affair.progress"
        :modifyProgressSave="modifyProgressSave"
      />
      <ModifyAffair
        v-if="affairDialog"
        v-model:affairDatas="affair"
        :validate="ModifyAffairSave"
        :enableVider="enableVider"
      />
      <ModifyPv
        v-if="pvModifyDialog"
        :data.sync="pvData"
        :meetingDate="computedDateFormattedMeetingDate"
        :meetingNextDate="computedDateFormattedMeetingNextDate"
        :meetingDateDate.sync="meetingDateDate"
        :meetingDateTime.sync="meetingDateTime"
        :meetingNextDateDate.sync="meetingNextDateDate"
        :meetingNextDateTime.sync="meetingNextDateTime"
        :affairs="affairsForPv"
        :modifyingType="pvModifyingType"
        :validate="pvModifySave"
        :cancel="cancelPvModify"
      />
      <ModifyLot
        v-if="lotModifyDialog"
        :lotData.sync="lots"
        :addLot="modifyLotsAdd"
        :deleteLot="ModifyLotDelete"
        :numberLots="numberLots"
        :validate="modifyLotSave"
        :isCancelable="lotModifyCancelable"
        :cancel="ModifyLotCancel"
      />
    </v-dialog>
    <v-container class="mb-5">
      <h3>Affaire : {{ affair.name }}</h3>
      <p>Adresse : {{ affair.address }}</p>
      <p>Phase : {{ affair.meetingType }}</p>
      <p v-if="affair.description" class="font-italic">{{ affair.description }}</p>
      <p>Progression :</p>
      <div class="text-center">
        <v-progress-circular :value="affair.progress" color="deep-orange lighten-2" size="80" width="8">
          {{ affair.progress }} %
        </v-progress-circular>
      </div>
      <v-row>
        <v-col cols="12" v-if="affair.meetingType == 'Chantier'">
          <h3 class="mt-5">Lots :</h3>
          <div v-if="lots">
            <v-chip v-for="lot in lots" v-bind:key="lot.id" dense class="mx-5 mt-5" color="primary">
              {{ lot.name }}
            </v-chip>
          </div>
          <p v-else class="font-italic">Il n'y a pas de lots pour cette affaire</p>
          <!-- TODO:ajouter un bouton pour ajouter des lots ici -->
        </v-col>
      </v-row>
    </v-container>

    <v-card max-width="80%" class="mx-auto">
      <v-card-title class="d-flex align-center pe-2">
        Les procès verbaux :
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          label="Recherche"
          single-line
          hide-details
        ></v-text-field>
        <v-btn dark color="primary" class="ml-5" @click.prevent="createPv">Ajouter un pv</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="pvs"
        :search="search"
        :sort-by="[{ key: 'pvNumber', order: 'asc' }]"
        sort-desc
      >
        <template v-slot:item.meetingDate="{ item }">
          <div>{{ $filters.formatDateWithA(item.meetingDate) }}</div>
        </template>
        <template v-slot:item.meetingNextDate="{ item }">
          <div>{{ $filters.formatDateWithA(item.meetingNextDate) }}</div>
        </template>
        <template v-slot:item.state="{ item }">
          <v-chip class="ma-2" color="success" text-color="white" v-if="item.state == 'Terminé'">
            {{ item.state }}
          </v-chip>
          <v-chip class="ma-2" color="orange" text-color="white" v-else>
            {{ item.state }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn small @click="openPv(item)" :color="item.state == 'Terminé' ? 'primary' : 'warning'">
            <v-icon class="ma-2">{{ item.state == 'Terminé' ? 'mdi-eye' : 'mdi-file-edit' }}</v-icon>
          </v-btn>
          <v-btn small class="ma-2" @click="modifyPv(item)" :color="item.state == 'Terminé' ? 'success' : 'error'">
            <v-icon dark class="ma-2">{{ item.state == 'Terminé' ? 'mdi-file-download' : 'mdi-information' }}</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card max-width="80%" class="mx-auto mt-10">
      <v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="error" @click.prevent="modifyProgress">Modifier la progression</v-btn>
          <v-btn v-if="affair.meetingType == 'Chantier'" color="error" @click.prevent="modifyLot">
            Modifier les lots
          </v-btn>
          <v-btn dark color="error" @click.prevent="modifyAffair">Modifier l'affaire</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Axios from 'axios'
import routesCONST, { getRouteName } from '../utilities/constantes'
import ModifyProgress from '@/components/ModifyProgress.vue'
import ModifyAffair from '@/components/ModifyAffair.vue'
import ModifyPv from '@/components/ModifyPv.vue'
import ModifyLot from '@/components/ModifyLot.vue'
import { mapGetters } from 'vuex'
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'

export default {
  components: {
    ModifyProgress,
    ModifyAffair,
    ModifyPv,
    ModifyLot
  },
  data() {
    return {
      progressDialog: false,
      affairDialog: false,
      pvModifyDialog: false,
      lotModifyDialog: false,
      pvModifyingType: true,
      lotModifyCancelable: false,
      pvData: {},
      dialog: false,
      dialogType: '',
      enableVider: false,
      affair: {},
      affairsForPv: [],
      lots: [],
      numberLots: Number,
      oldLots: [],
      oldNumberLots: Number,
      search: '',
      pvs: [],
      headers: [
        { text: 'Numéro', align: 'center', value: 'pvNumber' },
        {
          text: 'Date',
          align: 'start',
          value: 'meetingDate',
          sortable: false
        },
        { text: 'Etat', align: 'center', value: 'state', sortable: true },
        { text: 'Lieu', value: 'meetingPlace', sortable: false },
        { text: 'Prochaine date', value: 'meetingNextDate', sortable: false },
        { text: 'Prochain lieu', value: 'meetingNextPlace', sortable: false },
        { text: 'Action', value: 'actions', align: 'center', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters('user', {
      userId: 'userId'
    }),
    computedDateFormattedMeetingDate() {
      return this.meetingDateDate ? DateTime.fromSQL(this.meetingDateDate).toFormat('DDDD') : ''
    },
    computedDateFormattedMeetingNextDate() {
      return this.meetingNextDateDate ? DateTime.fromSQL(this.meetingNextDateDate).toFormat('DDDD') : ''
    },
    meetingDateDate: {
      get() {
        return this.pvData.meetingDate.substr(0, 10)
      },
      set(val) {
        this.pvData.meetingDate = val + ' ' + this.pvData.meetingDateTime
        this.pvData.meetingDateDate = val
      }
    },
    meetingDateTime: {
      get() {
        return this.pvData.meetingDate.substr(11, 5)
      },
      set(val) {
        this.pvData.meetingDate = this.pvData.meetingDateDate + ' ' + val
        this.pvData.meetingDateTime = val
      }
    },
    meetingNextDateDate: {
      get() {
        return this.pvData.meetingNextDate.substr(0, 10)
      },
      set(val) {
        this.pvData.meetingNextDateTime
          ? (this.pvData.meetingNextDate = val + ' ' + this.pvData.meetingNextDateTime)
          : (this.pvData.meetingNextDate = val)
        this.pvData.meetingNextDateDate = val
      }
    },
    meetingNextDateTime: {
      get() {
        return this.pvData.meetingNextDate.substr(11, 5)
      },
      set(val) {
        this.pvData.meetingNextDate = this.pvData.meetingNextDateDate + ' ' + val
        this.pvData.meetingNextDateTime = val
      }
    }
  },
  mounted() {
    let affairId = this.$route.params.id
    Axios.get('affairs/affairId', {
      params: {
        affairId: affairId
      }
    })
      .then((response) => {
        this.affair = response.data.affairInfos
        this.lots = response.data.lots
      })
      .catch((error) => {
        console.log(error)
      })
    Axios.get('pvs/affairId', {
      params: {
        affairId: affairId
      }
    })
      .then((response) => {
        this.pvs = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    goToDashboard() {
      this.$router.push({ name: getRouteName('board') })
    },
    openPv(pv) {
      let pvId = pv.pvId
      if (pv.state == 'En cours') {
        this.$router.push({
          name: routesCONST.pv.name,
          params: { id: pvId }
        })
      } else {
        this.$router.push({ name: getRouteName('finishedPv'), params: { id: pvId } })
      }
    },
    modifyLot() {
      if (this.lots == undefined) {
        this.lots = []
        this.lots.push({ name: '', lotId: undefined, affairId: undefined })
        this.lotModifyCancelable = true
      }
      this.lots.forEach((element) => {
        this.oldLots.push({ ...element })
      })
      this.oldNumberLots = parseInt(this.lots.length)
      this.numberLots = this.lots.length
      this.dialog = true
      this.lotModifyDialog = true
    },
    modifyLotSave() {
      this.lots.forEach((element) => {
        if (element.lotId == undefined) {
          let dataToSend = {
            affairId: this.$route.params.id,
            name: element.name
          }
          Axios.post('lots', dataToSend).then((response) => {
            element.lotId = response.data.lotId
          })
        } else {
          this.oldLots.forEach((oldEl) => {
            if (element.lotId == oldEl.lotId && element.name != oldEl.name) {
              let dataToSend = {
                name: element.name,
                lotId: element.lotId
              }
              Axios.put('lots', dataToSend)
                .then((response) => {
                  console.log(response)

                  if (response.data.affairId != '') {
                    this.$store.dispatch(
                      'notification/success',
                      "La progession de l'affaire à correctement été mise à jour"
                    )
                  }
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          })
        }
      })
      this.lotModifyCancelable = false
      this.dialog = false
      this.lotModifyDialog = false
    },
    modifyLotsAdd() {
      this.numberLots++
      this.lots.push({ name: '', lotId: undefined, affairId: undefined })
    },
    ModifyLotDelete(lot, index) {
      Axios.delete('lots/lotId', { params: { lotId: lot.lotId } })
        .then((response) => {
          if (response.data == 'success') {
            this.numberLots--
            this.lots.splice(index, 1)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    ModifyLotCancel() {
      this.lotModifyCancelable = false
      this.dialog = false
      this.lotModifyDialog = false
      this.lots.forEach((element) => {
        if (element.name == '') {
          this.lots = undefined
        }
      })
    },
    modifyProgress() {
      this.dialog = true
      this.progressDialog = true
    },
    modifyProgressSave() {
      let data = {
        ...this.affair
      }
      Axios.put('affairs/affairId', data)
        .then((response) => {
          if (response.status == 200) {
            this.$store.dispatch('notification/success', "La progession de l'affaire à correctement été mise à jour")
          }
        })
        .catch((error) => {
          console.log(error)
        })
      this.progressDialog = false
      this.dialog = false
    },
    modifyAffair() {
      this.dialog = true
      this.affairDialog = true
    },
    ModifyAffairSave() {
      Axios.put('affairs/affairId', this.affair)
        .then((response) => {
          if (response.status == 200) {
            this.$store.dispatch('notification/success', "La progession de l'affaire à correctement été mise à jour")
          }
        })
        .catch((error) => {
          console.log(error)
        })
      this.dialog = false
      this.affairDialog = false
    },
    modifyPv(pvDatas) {
      if (pvDatas.state == 'Terminé') {
        this.downloadPvPdf(pvDatas)
      } else {
        this.pvModifyingType = true
        this.affairsForPv = [{ ...this.affair }]
        this.pvData = pvDatas

        this.pvData.meetingDateDate = this.pvData.meetingDate.substr(0, 10)
        this.pvData.meetingDateTime = this.pvData.meetingDate.substr(11, 5)
        this.pvData.meetingNextDateDate = this.pvData.meetingNextDate.substr(0, 10)
        this.pvData.meetingNextDateTime = this.pvData.meetingNextDate.substr(11, 5)

        this.dialog = true
        this.pvModifyDialog = true
      }
    },
    async downloadPvPdf(pv) {
      const res = await Axios({
        responseType: 'blob',
        url: 'pvs/pvId/released/pdf',
        params: {
          pvId: pv.pvId
        }
      })

      const fileName = `${pv.releaseDate}_Affaire-${this.affair.name}_Pv-n${pv.pvNumber}`

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.pdf`)
      document.body.appendChild(link)
      link.click()
    },
    createPv() {
      this.pvModifyingType = false
      this.affairsForPv = [{ ...this.affair }]
      this.pvData = {
        meetingDateDate: new Date().toISOString().substr(0, 10),
        meetingDateTime: DateTime.now().toFormat('T').substr(0, 2) + ':00',
        meetingNextDateDate: undefined,
        meetingNextDateTime: undefined,
        meetingDate: DateTime.now().toFormat('yyyy-LL-dd HH:mm'),
        meetingNextDate: '',
        state: 'En cours',
        meetingPlace: '',
        meetingNextPlace: '',
        affairId: this.$route.params.id
      }
      this.dialog = true
      this.pvModifyDialog = true
    },
    cancelPvModify() {
      this.dialog = false
      this.pvModifyDialog = false
    },
    pvModifySave() {
      let data = {
        pvId: this.pvData.pvId,
        meetingDate: this.pvData.meetingDateDate + ' ' + this.pvData.meetingDateTime + ':00',
        meetingPlace: this.pvData.meetingPlace,
        meetingNextPlace: this.pvData.meetingNextPlace,
        state: this.pvData.state,
        affairId: this.$route.params.id,
        userId: this.userId
      }
      if (this.pvData.meetingNextDate != '') {
        data = { meetingNextDate: this.pvData.meetingNextDate + ':00', ...data }
      }
      let apiRoute
      let apiMethode
      this.pvModifyingType
        ? ((apiRoute = 'pvs/pvId'), (apiMethode = 'put'))
        : ((apiRoute = '/pvs'), (apiMethode = 'post'))
      Axios({ method: apiMethode, url: apiRoute, data: data })
        .then((response) => {
          if (response.status == 200 || response.status == 201) {
            this.dialog = false
            this.pvModifyDialog = false
            if (!this.pvModifyingType) {
              // pvData.pvId = response.data.pv.pvId;
              // pvData.pvNumber = response.data.pv.pvNumber;
              this.pvs.push(response.data)
            }
            this.$store.dispatch('notification/success', 'Pv correctement enregistré')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
