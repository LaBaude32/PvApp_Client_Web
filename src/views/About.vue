<template>
  <div class="about">
    <h1 class="mb-5">A propos</h1>
    <v-chip class="ma-5" color="green" text-color="white" large>
      <v-avatar left>
        <v-icon>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>
      Version 0.1.1-beta
    </v-chip>
    <h3 class="mb-5">Nouveautés :</h3>

    <v-card class="mx-auto" color="primary" dark max-width="400">
      <v-card-title>
        <v-icon large left>
          mdi-rocket-launch
        </v-icon>
        <span class="title font-weight-light">Caractéristiques</span>
      </v-card-title>

      <v-card-text class="headline font-weight-bold">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Page d'accueil : Refonte de la mise en page</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto mt-5" color="primary" dark max-width="400">
      <v-card-title>
        <v-icon large left>
          mdi-wrench
        </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>

      <v-card-text class="headline font-weight-bold">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>App bug fixes</v-list-item-title>
            <v-list-item-title>Update Vuetify to 2.4.3</v-list-item-title>
            <v-list-item-title>Update Tauri</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
  </div>
</template>
