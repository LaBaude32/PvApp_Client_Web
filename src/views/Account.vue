<template>
  <div class="pa-6 pb-10">
    <v-card class="mx-auto" max-width="800">
      <v-card-title class="text-h4 font-weight-bold mb-6"> Paramètres du compte </v-card-title>

      <v-tabs v-model="activeTab" class="mb-6">
        <v-tab value="personal">Informations personnelles</v-tab>
        <v-tab value="company">Informations de l'entreprise</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeTab">
          <!-- Onglet Informations personnelles -->
          <v-window-item value="personal">
            <PersonalInfoTab :user-data="userData" />
          </v-window-item>

          <!-- Onglet Informations de l'entreprise -->
          <v-window-item value="company">
            <CompanyInfoTab :company-data="companyData" />
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="saveChanges"> Enregistrer les modifications </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import CompanyInfoTab from '@/components/Account/CompanyInfoTab.vue'
import PersonalInfoTab from '@/components/Account/PersonalInfoTab.vue'
import { onMounted, ref } from 'vue'

// États pour les données utilisateur et entreprise
const activeTab = ref<string>('personal')
const userData = ref<any>({})
const companyData = ref<any>({})

// Simuler le chargement des données
onMounted(() => {
  // Dans une application réelle, ces données viendraient de l'API
  userData.value = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89'
  }

  companyData.value = {
    name: 'Entreprise Exemple',
    siret: '12345678901234',
    address: "123 Rue de l'Exemple, 75000 Paris",
    vatNumber: 'FR123456789'
  }
})

const saveChanges = () => {
  // Logique d'enregistrement des modifications
  console.log('Données sauvegardées :', {
    userData: userData.value,
    companyData: companyData.value
  })

  // Simuler l'envoi des données à l'API (en production, cela serait une requête HTTP)
  // ex: await axios.put('/api/user', userData.value)
  // ex: await axios.put('/api/company', companyData.value)

  // Afficher un message de succès à l'utilisateur
  alert('Modifications sauvegardées avec succès !')
}
</script>

<style scoped>
.account-page {
  padding: 20px;
}

/* Style pour le conteneur principal */
.account-page .v-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
