<template>
  <div>
    <div class="text-center mb-10">
      <h1>A propos</h1>
      <v-chip variant="elevated" color="green" prepend-icon="mdi-party-popper" class="mt-2">
        Version : {{ appVersion }}
      </v-chip>
    </div>
    <v-card prepend-icon="mdi-heart" title="Nouveautés" color="blue-darken-2" class="mx-auto mt-5" max-width="600">
      <v-card-text class="ml-5">
        <ul>
          <li><b>Ajout de la prise en charge des images dans les Pvs</b></li>
          <li>42 commits pour le backend</li>
          <li>49 commits pour le frontend</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card
      prepend-icon="mdi-rocket-launch"
      title="Améliorations"
      color="blue-darken-2"
      class="mx-auto mt-5"
      max-width="600"
    >
      <v-card-text class="ml-5">
        <ul>
          <li>UX: Simplification de la page A propos</li>
          <li>Documentation</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card prepend-icon="mdi-wrench" title="Corrections" color="blue-darken-2" class="mx-auto mt-5" max-width="600">
      <v-card-text class="ml-5">
        <ul>
          <li>Beaucoup de corrections</li>
          <li>Bug sur l'authentificaiton</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { version as appVersion } from '../../package'
</script>
