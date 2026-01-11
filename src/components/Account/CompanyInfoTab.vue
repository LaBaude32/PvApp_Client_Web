<template>
  <div class="company-info-tab">
    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Informations de l'entreprise</h3>

      <v-text-field
        v-model="formData.name"
        label="Nom de l'entreprise"
        required
        :rules="FormCompanyNameRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.siret"
        label="Numéro SIRET"
        required
        :rules="FormSiretRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.street"
        label="Adresse (rue)"
        required
        :rules="FormAddressRules"
      ></v-text-field>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.postalCode"
            label="Code postal"
            required
            :rules="FormPostalCodeRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.city"
            label="Ville"
            required
            :rules="FormCityRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.country"
        label="Pays"
        required
        :rules="FormCountryRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.vatNumber"
        label="Numéro de TVA intracommunautaire"
        :rules="FormVatNumberRules"
      ></v-text-field>

      <v-select
        v-model="formData.companyType"
        label="Type de structure"
        :items="['Entreprise', 'Collectivité publique']"
        :rules="FormRequiredRulesMin3"
      ></v-select>

      <div class="text-subtitle-1 mb-4">Contact de facturation</div>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.contactFirstName"
            label="Prénom du contact de facturation"
            required
            :rules="FormContactFirstNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.contactLastName"
            label="Nom du contact de facturation"
            required
            :rules="FormContactLastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.contactEmail"
        label="Adresse email du contact de facturation"
        type="email"
        required
        :rules="FormContactEmailRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.contactPhone"
        label="Numéro de téléphone du contact de facturation"
        :rules="FormContactPhoneRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.contactPosition"
        label="Poste du contact de facturation"
        :rules="FormRequiredRulesMin3"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import {
  FormAddressRules,
  FormCityRules,
  FormCompanyNameRules,
  FormContactEmailRules,
  FormContactFirstNameRules,
  FormContactLastNameRules,
  FormContactPhoneRules,
  FormCountryRules,
  FormPostalCodeRules,
  FormRequiredRulesMin3,
  FormSiretRules,
  FormVatNumberRules
} from '@/utilities/constantes'
import { ref, watch } from 'vue'

// État du formulaire
const isValid = ref<boolean>(true)

// Données du formulaire
const props = defineProps<{
  companyData: any
}>()

const formData = ref({
  name: props.companyData.name || '',
  siret: props.companyData.siret || '',
  address: props.companyData.address || '',
  street: props.companyData.street || '',
  city: props.companyData.city || '',
  postalCode: props.companyData.postalCode || '',
  vatNumber: props.companyData.vatNumber || '',
  companyType: '',
  country: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  contactPosition: ''
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
