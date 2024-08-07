<template>
  <div class="mb-10">
    <v-container>
      <v-row>
        <v-col v-if="!isPrinted" cols="12" class="d-flex">
          <v-spacer />
          <v-btn class="mr-16" color="success" x-large @click.prevent="downloadPdf">Telecharger</v-btn>
        </v-col>
        <v-col cols="12" class="text-center">
          <p class="text-uppercase text-h4">Opération :</p>
          <v-divider />
          <p class="mt-2 text-h5">{{ affairInfos.name }}</p>
          <v-divider />
          <p class="mt-2 text-h7">Avancement : {{ affairInfos.progress }}%</p>
          <v-divider />
          <p class="mt-2 text-subtitle-1-1">{{ affairInfos.description }}</p>
          <v-row v-if="maitreDOuvrage">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'ouvrage :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitreDOuvrage }}</p>
            </v-col>
          </v-row>
          <v-row v-if="maitresDOeuvre">
            <v-col cols="6">
              <p class="text-uppercase text-left">Maîtrise d'oeuvre :</p>
            </v-col>
            <v-col cols="6">
              <p class="text-right">{{ maitresDOeuvre }}</p>
            </v-col>
          </v-row>
          <v-divider />
          <p class="text-uppercase mt-2 text-h6">
            PV de la réunion de {{ meetingType }} n°{{ pvDetails.pvNumber }} du
            {{ $filters.formatDateWithA(pvDetails.meetingDate) }}
            <span v-if="pvDetails.meetingPlace">, {{ pvDetails.meetingPlace }}</span>
          </p>
          <p v-if="pvDetails.meetingNextDate" class="red--text text-h6">
            Prochaine réunion : le {{ $filters.formatDateWithA(pvDetails.meetingNextDate) }},
            {{ pvDetails.meetingNextPlace }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <finishedPvUsers
      v-if="meetingType"
      :users="pvUsers"
      :headers="UserHeaders"
      :sortBy="[{ key: 'userGroup', order: 'asc' }]"
    />
    <v-container>
      <v-divider class="my-10" />
    </v-container>
    <finishedPvItems
      v-if="meetingType"
      :items="items"
      :headers="ItemHeaders"
      :sortBy="[{ key: 'position', order: 'asc' }]"
    />
    <v-container class="text-center">
      <v-divider class="my-10" />
      <div v-if="pvDetails.meetingNextDate">
        <p class="text-uppercase">Prochaine réunion : le {{ $filters.formatDateWithA(pvDetails.meetingNextDate) }}</p>
        <p class="font-italic body-2">Présence vivement souhaitée des intervenants conviés (cf. tableaux). Merci.</p>
      </div>
      <p>Fait et diffusé le {{ $filters.formatDateWithA(pvDetails.releaseDate) }}</p>
      <p>{{ owner.firstName }} {{ owner.lastName }}</p>
    </v-container>
  </div>
</template>

<script>
import finishedPvItems from '@/components/FinishedPvItems.vue'
import finishedPvUsers from '@/components/FinishedPvUsers.vue'
import Axios from 'axios'
import { DateTime, Settings } from 'luxon'
Settings.defaultLocale = 'fr'
export default {
  components: {
    finishedPvUsers,
    finishedPvItems
  },
  data() {
    return {
      isPrinted: false,
      affairInfos: {},
      items: [],
      pvDetails: {},
      meetingType: undefined,
      pvUsers: [],
      owner: {},
      maitresDOeuvre: '',
      maitreDOuvrage: '',
      UserHeaders: [
        {
          title: 'Prénom Nom',
          align: 'start',
          value: 'fullName'
        },
        {
          title: 'Groupe',
          value: 'userGroup'
        },
        { title: 'Fonction', value: 'function' },
        { title: 'Organisme', value: 'organism' },
        { title: 'Mail', value: 'email', sortable: false },
        { title: 'Téléphone', value: 'phone', sortable: false },
        { title: 'Statut', value: 'statusPAE' }
      ],
      ItemHeaders: [
        {
          title: 'Position',
          align: 'center',
          value: 'position'
        },
        { title: 'Note', value: 'note', sortable: false },
        { title: 'Suite à donner', value: 'followUp', sortable: false },
        { title: 'Ressource', value: 'resources', sortable: false },
        { title: 'Echeance', value: 'completion', sortable: false },
        { title: "Date d'echéance", value: 'completionDate' }
      ]
    }
  },
  mounted() {
    this.getPvData()
  },

  methods: {
    async getPvData() {
      this.idPv = this.$route.params.id
      let dt = {
        params: {
          pvId: this.$route.params.id
        }
      }
      let res = await Axios.get('pvs/pvId/released', dt)
      if (res.status == 200) {
        if (res.data.items) {
          this.items = [...res.data.items]
        }
      }
      this.pvDetails = res.data.pv
      this.pvUsers = res.data.users
      this.meetingType = res.data.pv.affairMeetingType
      this.owner = res.data.owner
      if (this.meetingType == 'Chantier') {
        this.ItemHeaders.splice(1, 0, { text: 'Lot', value: 'lots' })
        this.ItemHeaders.push({ text: 'Photo', value: 'image', sortable: false })
      }
      this.affairInfos = res.data.affair.affairInfos

      this.pvUsers.forEach((element) => {
        if (element.userGroup == "Maîtrise d'oeuvre") {
          if (this.maitresDOeuvre == '') {
            this.maitresDOeuvre = element.organism
          } else {
            this.maitresDOeuvre += ' - ' + element.organism
          }
        }
        if (element.userGroup == "Maîtrise d'ouvrage") {
          if (this.maitreDOuvrage == '') {
            this.maitreDOuvrage = element.organism
          } else {
            this.maitreDOuvrage += ' - ' + element.organism
          }
        }
      })
    },
    async downloadPdf() {
      const res = await Axios({
        responseType: 'blob',
        url: 'pvs/pvId/released/pdf',
        params: {
          pvId: this.$route.params.id
        }
      })

      const fileName = `${this.releaseDate}_Affaire-${this.affairInfos.name}_Pv-n${this.pvDetails.pvNumber}`

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.pdf`)
      document.body.appendChild(link)
      link.click()
    }
  },
  computed: {
    releaseDate() {
      return DateTime.fromSQL(this.pvDetails.releaseDate).toISODate()
    }
  }
}
</script>
