<template>
  <div class="about mb-10">
    <h1>A propos</h1>
    <v-chip class="ma-5" color="green" text-color="white" large>
      <v-avatar left>
        <v-icon>mdi-checkbox-marked-circle</v-icon>
      </v-avatar>
      Version {{ appVersion }}
    </v-chip>

    <v-card class="mx-auto mb-5" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left> mdi-heart </v-icon>
        <span class="title font-weight-light">Nouveautés</span>
      </v-card-title>

      <v-card-text class="text-left white--text">
        <ul>
          <li>Tout nouveau PDF à télécharger pour les PV finis</li>
          <li>Implémentation de docker et dokerisation complete du backend de l'application</li>
          <li>Implémentation de traefik avec HTTPS</li>
          <li>Déploiement</li>
          <li>Mise en place d'une documentation de l'API avec Swagger</li>
          <li>57 commits pour le backend</li>
          <li>43 commits pour le frontend</li>
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
          <li>Mise à jour complete du backend</li>
          <li>Mise à jour complete du front avec l'introduction de ViteJs</li>
          <li>Remplacement de moment.js par Luxon</li>
          <li>UX : Ajout du bouton dashboard dans la topbar</li>
          <li>UX : Selecteur de groupe (non modifiable) à la création d'un utilisateur</li>
          <li>UX : Ajout d'un bouton de téléchargement du pdf du PV diretement depuis la page Affaire</li>
          <li>UX : Ajout d'un bouton de retour au Dashboard depuis la page Affaire</li>
          <li>Renomage des routes pour respecter la convention RESTful et utilisation des bonnes methodes HTTP</li>
          <li>Ajout des bons codes de status HTTP</li>
          <li>UX: Amélioration de la page A propos</li>
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
          <li>Beaucoup beaucoup de corrections</li>
          <li>Bug lors de la création d'un nouvel utilisateur, quand il n'y a pas de données</li>
        </ul>
      </v-card-text>
    </v-card>
    <h3 class="mt-10 mb-5">Version précédente</h3>
    <v-card class="mx-auto text-left" color="cyan darken-1" dark max-width="600">
      <v-chip class="ma-5" color="cyan darken-3" text-color="white">
        <v-avatar left>
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
        Version 0.1.4-beta
      </v-chip>
      <v-card-title>
        <v-icon large left> mdi-heart </v-icon>
        <span class="title font-weight-light">Nouveautés</span>
      </v-card-title>

      <v-card-text class="white--text">
        <ul>
          <li>Ajout des notifications de version</li>
        </ul>
      </v-card-text>

      <v-card-title>
        <v-icon large left> mdi-rocket-launch </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>
      <v-card-text class="white--text">
        <ul>
          <li>UX : Ajout des propostions de groupe lors de la création de participants</li>
          <li>Suppression de l'obligation de renseigner un numéro de telephone et un mail lors de la création des participants</li>
          <li>Ajout de la possiblité de ne pas mettre de status.</li>
          <li>Changement de du selecteur de status dans le formulaire et dans la page PV</li>
        </ul>
      </v-card-text>

      <v-card-title>
        <v-icon large left> mdi-wrench </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>
      <v-card-text class="white--text">
        <ul>
          <li>Ajout de la mise a jours des Status dans la page des PV.</li>
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
