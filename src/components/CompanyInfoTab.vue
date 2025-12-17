<template>
  <div class="company-info-tab">
    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Informations de l'entreprise</h3>

      <v-text-field
        v-model="formData.name"
        label="Nom de l'entreprise"
        required
        :rules="nameRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.siret"
        label="Numéro SIRET"
        required
        :rules="siretRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.street"
        label="Adresse (rue)"
        required
        :rules="streetRules"
      ></v-text-field>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.postalCode"
            label="Code postal"
            required
            :rules="postalCodeRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.city"
            label="Ville"
            required
            :rules="cityRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.vatNumber"
        label="Numéro de TVA intracommunautaire"
        :rules="vatNumberRules"
      ></v-text-field>

      <div class="text-subtitle-1 mb-4">Contact principal</div>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.contactFirstName"
            label="Prénom du contact"
            required
            :rules="contactFirstNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.contactLastName"
            label="Nom du contact"
            required
            :rules="contactLastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.contactEmail"
        label="Adresse email du contact"
        type="email"
        required
        :rules="contactEmailRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.contactPhone"
        label="Numéro de téléphone du contact"
        :rules="contactPhoneRules"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Définition des règles de validation
const nameRules = [
  (value: string) => !!value || "Le nom de l'entreprise est requis",
  (value: string) =>
    (value && value.length >= 2) || "Le nom de l'entreprise doit contenir au moins 2 caractères"
]

const siretRules = [
  (value: string) => !!value || 'Le numéro SIRET est requis',
  (value: string) => /^\d{14}$/.test(value) || 'Le numéro SIRET doit contenir 14 chiffres'
]

const addressRules = [
  (value: string) => !!value || "L'adresse complète est requise",
  (value: string) =>
    (value && value.length >= 10) || "L'adresse doit contenir au moins 10 caractères"
]

const vatNumberRules = [
  (value: string) =>
    !value ||
    /^FR[0-9]{2}[0-9]{9}$/.test(value) ||
    "Le numéro de TVA n'est pas valide (format FRxxXXXXXXXX)"
]

const contactFirstNameRules = [
  (value: string) => !!value || 'Le prénom du contact est requis',
  (value: string) => (value && value.length >= 2) || 'Le prénom doit contenir au moins 2 caractères'
]

const contactLastNameRules = [
  (value: string) => !!value || 'Le nom du contact est requis',
  (value: string) => (value && value.length >= 2) || 'Le nom doit contenir au moins 2 caractères'
]

const contactEmailRules = [
  (value: string) => !!value || "L'adresse email du contact est requise",
  (value: string) => /\S+@\S+\.\S+/.test(value) || "L'adresse email n'est pas valide"
]

const contactPhoneRules = [
  (value: string) =>
    !value ||
    /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value) ||
    "Le numéro de téléphone du contact n'est pas valide"
]

// État du formulaire
const isValid = ref<boolean>(true)
const form = ref<any>(null)

// Données du formulaire
const props = defineProps<{
  companyData: any
}>()

const formData = ref({
  name: props.companyData.name || '',
  siret: props.companyData.siret || '',
  address: props.companyData.address || '',
  vatNumber: props.companyData.vatNumber || '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: ''
})

// Watcher pour synchroniser les données de l'entreprise avec le formulaire
watch(
  () => props.companyData,
  (newData) => {
    formData.value = {
      ...formData.value,
      name: newData.name || '',
      siret: newData.siret || '',
      address: newData.address || '',
      vatNumber: newData.vatNumber || ''
    }
  }
)
</script>

<style scoped>
.company-info-tab {
  padding: 20px 0;
}

/* Style pour les champs de formulaire */
.company-info-tab .v-text-field {
  margin-bottom: 16px;
}
</style>
