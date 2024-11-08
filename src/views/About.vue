<template>
  <div>
    <div class="text-center mb-10">
      <h1>A propos</h1>
      <v-chip variant="elevated" color="green" prepend-icon="mdi-party-popper" class="mt-2">
        Version : {{ appVersion }}
      </v-chip>
    </div>
    <v-card
      prepend-icon="mdi-heart"
      title="Nouveautés"
      color="blue-darken-2"
      class="mx-auto mt-5"
      max-width="600"
    >
      <v-card-text class="ml-5">
        <ul>
          <li><b>Ajout des ordre du jours</b></li>
          <li><b>Ajout des avancements par lots</b></li>
        </ul>
      </v-card-text>
    </v-card>
    <!-- <v-card
      prepend-icon="mdi-rocket-launch"
      title="Améliorations"
      color="blue-darken-2"
      class="mx-auto mt-5"
      max-width="600"
    >
      <v-card-text class="ml-5">
        <ul>
          <li>Tri des participant par ordre alphabétique sur le groupe dans le PDF</li>
          <li>Amélioration de la mise en page de PDF</li>
        </ul>
      </v-card-text>
    </v-card> -->
    <v-card
      prepend-icon="mdi-wrench"
      title="Corrections"
      color="blue-darken-2"
      class="mx-auto mt-5"
      max-width="600"
    >
      <v-card-text class="ml-5">
        <ul>
          <li>Corrections de bugs sur l'agenda dans les items</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { version as appVersion } from '../../package'
</script>
