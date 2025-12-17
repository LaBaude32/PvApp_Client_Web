<template>
  <div class="personal-info-tab">
    <v-form ref="form" v-model="isValid" lazy-validation>
      <h3 class="text-h6 mb-4">Informations personnelles</h3>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.firstName"
            label="Prénom"
            required
            :rules="firstNameRules"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field
            v-model="formData.lastName"
            label="Nom de famille"
            required
            :rules="lastNameRules"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-text-field
        v-model="formData.email"
        label="Adresse email"
        type="email"
        required
        :rules="emailRules"
        readonly
        class="locked-field"
        variant="plain"
        hint="Verrouillé, contactez l'administrateur pour modifier le mail"
        persistent-hint
      ></v-text-field>

      <v-text-field
        v-model="formData.phone"
        label="Numéro de téléphone"
        :rules="phoneRules"
      ></v-text-field>

      <div class="text-subtitle-1 mb-4">Sécurité</div>

      <v-text-field
        v-model="formData.password"
        label="Mot de passe actuel"
        type="password"
        :rules="passwordRules"
      ></v-text-field>

      <v-text-field
        v-model="formData.newPassword"
        label="Nouveau mot de passe"
        type="password"
        :rules="newPasswordRules"
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

// Définition des règles de validation
const firstNameRules = [
  (value: string) => !!value || 'Le prénom est requis',
  (value: string) => (value && value.length >= 2) || 'Le prénom doit contenir au moins 2 caractères'
]

const lastNameRules = [
  (value: string) => !!value || 'Le nom de famille est requis',
  (value: string) =>
    (value && value.length >= 2) || 'Le nom de famille doit contenir au moins 2 caractères'
]

const emailRules = [
  (value: string) => !!value || "L'adresse email est requise",
  (value: string) => /\S+@\S+\.\S+/.test(value) || "L'adresse email n'est pas valide"
]

const phoneRules = [
  (value: string) =>
    !value || /^[\+]?[0-9\s\-\(\)]{10,}$/.test(value) || "Le numéro de téléphone n'est pas valide"
]

const passwordRules = [
  (value: string) =>
    !value || value.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères'
]

const newPasswordRules = [
  (value: string) =>
    !value || value.length >= 8 || 'Le nouveau mot de passe doit contenir au moins 8 caractères',
  (value: string) =>
    !value ||
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ||
    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
]

const confirmPasswordRules = [
  (value: string) =>
    !value || value === formData.newPassword || 'Les mots de passe ne correspondent pas'
]

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
.personal-info-tab {
  padding: 20px 0;
}

/* Style pour les champs de formulaire */
.personal-info-tab .v-text-field {
  margin-bottom: 16px;
}

/* Style pour les champs verrouillés */
.locked-field .v-input__slot {
  background-color: #f5f5f5;
}

.locked-field .v-text-field__slot {
  color: #666;
}
</style>
