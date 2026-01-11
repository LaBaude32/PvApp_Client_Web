<template>
  <div class="license-management-tab">
    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Gestion des licences</h3>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="availableLicenses"
            type="number"
            label="Nombre de licences disponibles"
            hint="Nombre total de licences pour l'entreprise"
            persistent-hint
            :rules="[value => !!value || 'Ce champ est requis', value => value >= 0 || 'Doit être positif']"
            @change="updateAvailableLicenses"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="usedLicenses"
            type="number"
            label="Licences attribuées"
            hint="Nombre de licences déjà attribuées"
            persistent-hint
            readonly
            color="secondary"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <h4 class="text-subtitle-1 mb-3">Attribution des licences</h4>

      <v-text-field
        v-model="searchEmail"
        label="Rechercher par email"
        placeholder="Entrez l'email d'un collaborateur"
        clearable
        @click:clear="resetSearch"
        @keyup.enter="searchCollaborator"
      >
        <template #append>
          <v-btn icon="mdi-magnify" @click="searchCollaborator"></v-btn>
        </template>
      </v-text-field>

      <div v-if="searchResults.length > 0" class="mt-4">
        <v-card v-for="(user, index) in searchResults" :key="index" class="mb-3">
          <v-card-text class="pa-4">
            <div class="d-flex justify-space-between align-center">
              <div>
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
                <div class="text-caption">{{ user.email }}</div>
                <div v-if="user.userFunction" class="text-caption">{{ user.userFunction }}</div>
              </div>

              <v-chip v-if="user.hasLicense" color="success" small>
                Licence attribuée
              </v-chip>

              <template v-else-if="availableLicenses > usedLicenses">
                <v-btn
                  color="primary"
                  small
                  @click="assignLicense(user)"
                >
                  Attribuer licence
                </v-btn>
              </template>

              <v-chip v-else color="warning" small>
                Plus de licences disponibles
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <div v-if="assignedUsers.length > 0" class="mt-6">
        <h4 class="text-subtitle-1 mb-3">Collaborateurs avec licence</h4>

        <v-data-table
          :headers="headers"
          :items="assignedUsers"
          class="elevation-1"
          hide-no-data
        >
          <template #item.actions="{ item }">
            <v-btn
              color="error"
              small
              icon="mdi-close"
              @click="revokeLicense(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </div>

      <v-alert
        v-if="availableLicenses <= 0 && usedLicenses > 0"
        type="warning"
        class="mt-4"
      >
        Vous avez plus de licences attribuées que disponibles. Veuillez augmenter le nombre de licences.
      </v-alert>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/utilities/types'

interface UserWithLicense extends User {
  hasLicense?: boolean
}

const props = defineProps<{
  companyData: any
}>()

// État du formulaire
const isValid = ref<boolean>(true)
const searchEmail = ref<string>('')
const searchResults = ref<UserWithLicense[]>([])
const assignedUsers = ref<User[]>([])

// Données des licences
const availableLicenses = ref<number>(10) // Valeur par défaut
const usedLicenses = computed(() => assignedUsers.value.length)

// Charger les données existantes depuis companyData
const loadLicenseData = () => {
  if (props.companyData.licenses) {
    availableLicenses.value = props.companyData.licenses.available || 10
    assignedUsers.value = props.companyData.licenses.assigned || []
  }
}

// Rechercher un collaborateur par email
const searchCollaborator = () => {
  if (!searchEmail.value) return

  // Dans une application réelle, cela serait un appel API
  // Exemple: axios.get(`/api/users?email=${searchEmail.value}`)
  // Pour l'instant, on simule des résultats
  searchResults.value = [
    {
      userId: 1,
      email: searchEmail.value,
      password: '', // Champ requis pour le type User
      firstName: 'Jean',
      lastName: 'Dupont',
      phone: '+33 1 23 45 67 89',
      userFunction: 'Directeur',
      organisationId: 1,
      hasLicense: assignedUsers.value.some(u => u.email === searchEmail.value)
    }
  ]
}

// Attribuer une licence à un utilisateur
const assignLicense = (user: UserWithLicense) => {
  if (availableLicenses.value <= usedLicenses.value) {
    return
  }

  // Vérifier si l'utilisateur a déjà une licence
  const existingIndex = assignedUsers.value.findIndex(u => u.email === user.email)
  if (existingIndex >= 0) {
    return
  }

  assignedUsers.value.push(user)
  searchResults.value = []
}

// Révoquer une licence
const revokeLicense = (user: User) => {
  assignedUsers.value = assignedUsers.value.filter(u => u.email !== user.email)
}

// Mettre à jour le nombre de licences disponibles
const updateAvailableLicenses = () => {
  // Logique pour gérer le cas où il y a plus de licences attribuées que disponibles
  if (usedLicenses.value > availableLicenses.value) {
    // Option 1: Révoquer automatiquement les licences en excès
    // assignedUsers.value = assignedUsers.value.slice(0, availableLicenses.value)

    // Option 2: Garder l'état et afficher un avertissement (choix actuel)
    // L'alerte est affichée dans le template
  }
}

// Réinitialiser la recherche
const resetSearch = () => {
  searchEmail.value = ''
  searchResults.value = []
}

// En-têtes pour le tableau des utilisateurs avec licence
const headers = [
  { title: 'Nom', key: 'lastName' },
  { title: 'Prénom', key: 'firstName' },
  { title: 'Email', key: 'email' },
  { title: 'Poste', key: 'userFunction' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Charger les données initiales
loadLicenseData()
</script>

<style scoped>
.license-management-tab {
  padding: 20px 0;
}

.v-data-table {
  background-color: transparent;
}

/* Style pour les champs de formulaire */
.license-management-tab .v-text-field {
  margin-bottom: 16px;
}

.v-alert {
  margin-top: 16px;
}
</style>
