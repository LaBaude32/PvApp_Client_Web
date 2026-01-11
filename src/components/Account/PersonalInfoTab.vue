<template>
  <div class="personal-info-tab py-5">
    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Informations personnelles</h3>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.firstName"
            label="Prénom"
            required
            :rules="FormFirstNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.lastName"
            label="Nom de famille"
            required
            :rules="FormLastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.email"
        label="Adresse email"
        type="email"
        required
        :rules="FormEmailSimpleRules"
        readonly
        variant="plain"
        hint="Verrouillé, contactez l'administrateur pour modifier le mail"
        persistent-hint
      ></v-text-field>

      <v-text-field
        v-model="formData.phone"
        label="Numéro de téléphone"
        :rules="FormPhoneSimpleRules"
      ></v-text-field>

      <div class="text-subtitle-1 mb-4">Sécurité</div>

      <v-text-field
        v-model="formData.password"
        label="Mot de passe actuel"
        type="password"
        :rules="FormPasswordMin8Rules"
      ></v-text-field>

      <v-text-field
        v-model="formData.newPassword"
        label="Nouveau mot de passe"
        type="password"
        :rules="FormPasswordComplexRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.confirmPassword"
        label="Confirmer le nouveau mot de passe"
        type="password"
        :rules="confirmPasswordRules"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  FormFirstNameRules,
  FormLastNameRules,
  FormEmailSimpleRules,
  FormPhoneSimpleRules,
  FormPasswordMin8Rules,
  FormPasswordComplexRules
} from '@/utilities/constantes'

// État du formulaire
const isValid = ref<boolean>(true)
const form = ref<any>(null)

// Données du formulaire
const props = defineProps<{
  userData: any
}>()

const formData = ref({
  firstName: props.userData.firstName || '',
  lastName: props.userData.lastName || '',
  email: props.userData.email || '',
  phone: props.userData.phone || '',
  password: '',
  newPassword: '',
  confirmPassword: ''
})

const confirmPasswordRules = [
  (value: string) =>
    !value || value === formData.value.newPassword || 'Les mots de passe ne correspondent pas'
]

// Watcher pour synchroniser les données de l'utilisateur avec le formulaire
watch(
  () => props.userData,
  (newData) => {
    formData.value = {
      ...formData.value,
      firstName: newData.firstName || '',
      lastName: newData.lastName || '',
      email: newData.email || '',
      phone: newData.phone || ''
    }
  }
)
</script>

<style scoped>
/* Style pour les champs de formulaire */
.personal-info-tab .v-text-field {
  margin-bottom: 16px;
}
</style>
