<template>
  <div class="about mb-10">
    <h1>A propos</h1>
    <v-chip class="ma-5" color="green" text-color="white" large> Version : {{ appVersion }} </v-chip>

    <v-card class="mx-auto mb-5" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left> mdi-heart </v-icon>
        <span class="title font-weight-light">Nouveautés</span>
      </v-card-title>

      <v-card-text class="text-left white--text">
        <ul>
          <li><b>Ajout de la prise en charge des images dans les Pvs</b></li>
          <li>42 commits pour le backend</li>
          <li>49 commits pour le frontend</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left> mdi-rocket-launch </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>

      <v-card-text class="text-left white--text">
        <ul>
          <li>UX: Simplification de la page A propos</li>
          <li>Documentation</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto mt-5" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left> mdi-wrench </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>

      <v-card-text class="text-left white--text">
        <ul>
          <li>Beaucoup de corrections</li>
          <li>Bug sur l'authentificaiton</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { version } from "../../package";
export default {
  data() {
    return {
      appVersion: version
    };
  }
};
</script>
