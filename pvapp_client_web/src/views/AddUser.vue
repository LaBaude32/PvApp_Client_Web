<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Créer un personne</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form v-model="valid">
            <v-card-text>
              <v-row>
                <v-col cols="7">
                  <v-text-field label="Email" prepend-icon="mdi-account" type="text" v-model="email" :rules="emailRules" />
                </v-col>
                <v-col cols="5">
                  <v-text-field id="password" label="Mot de passe" prepend-icon="mdi-lock" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" v-model="password" :rules="pwdRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Prénom" type="text" v-model="firstName" :rules="standardRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Nom" type="text" v-model="lastName" :rules="standardRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Téléphone" type="text" v-model="phone" :rules="standardRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Groupe" type="text" v-model="user_group" :rules="standardRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Fonction" type="text" v-model="user_function" :rules="standardRules" />
                </v-col>
                <v-col cols="6">
                  <v-text-field label="Organisme" type="text" v-model="organism" :rules="standardRules" />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :disabled="!valid" color="primary" @click.prevent="login">Ajouter</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
