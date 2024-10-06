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
          <li><b>Mise en place des statuts Convié et Diffusion</b></li>
          <li><b>Débloquage des Pv déjà diffusé dans les paramètres</b></li>
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
          <li>Mise en place de Vue3</li>
          <li>Amélioration des performances +50%</li>
          <li>Amélioration l'interface</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card
      prepend-icon="mdi-wrench"
      title="Corrections"
      color="blue-darken-2"
      class="mx-auto mt-5"
      max-width="600"
    >
      <v-card-text class="ml-5">
        <ul>
          <li>Beaucoup de corrections de bugs</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { version as appVersion } from '../../package'
</script>
