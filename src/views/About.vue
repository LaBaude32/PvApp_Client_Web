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
        <v-icon large left>
          mdi-heart
        </v-icon>
        <span class="title font-weight-light">Nouveautés</span>
      </v-card-title>

      <v-card-text class="text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item>Ajout des notifications de version</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left>
          mdi-rocket-launch
        </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>

      <v-card-text class="text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item>UX : Ajout des propostions de groupe lors de la création de participants</v-list-item>
            <v-list-item
              >Suppression de l'obligation de renseigner un numéro de telephone et un mail lors de la création des participants</v-list-item
            >
            <v-list-item>Ajout de la possiblité de ne pas mettre de status. </v-list-item>
            <v-list-item>Changement de du selecteur de status dans le formulaire et dans la page PV </v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto mt-5" color="primary" dark max-width="600">
      <v-card-title>
        <v-icon large left>
          mdi-wrench
        </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>

      <v-card-text class="text-left">
        <v-list-item>
          <v-list-item-content>
            <v-list-item>Ajout de la mise a jours des Status dans la page des PV.</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
    <h3 class="mt-10 mb-5">Anciennes versions :</h3>
    <v-card class="mx-auto text-left" color="cyan darken-1" dark max-width="600">
      <v-chip class="ma-5" color="cyan darken-3" text-color="white">
        <v-avatar left>
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
        Version 0.1.3-beta
      </v-chip>
      <v-card-title>
        <v-icon left>
          mdi-rocket-launch
        </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>UX : Modification de la page A propos</v-list-item>
            <v-list-item>UX : Changement de "Type de Réunion" pour "Phase"</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-card-title>
        <v-icon left>
          mdi-wrench
        </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>Se supprimer soi-même dans les participants aux PV est désormais impossible</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-chip class="ma-5" color="cyan darken-3" text-color="white">
        <v-avatar left>
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
        Version 0.1.2-beta
      </v-chip>
      <v-card-title>
        <v-icon left>
          mdi-rocket-launch
        </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>UX : Modification de la page Affaire</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-card-title>
        <v-icon left>
          mdi-wrench
        </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>Correction des problèmes de status des personnes</v-list-item>
            <v-list-item>Correction des problèmes de fonction des personnes</v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-chip class="ma-5" color="cyan darken-3" text-color="white">
        <v-avatar left>
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
        Version 0.1.1-beta
      </v-chip>
      <v-card-title>
        <v-icon left>
          mdi-rocket-launch
        </v-icon>
        <span class="title font-weight-light">Améliorations</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>
              Page d'accueil: Refonte de la mise en page
            </v-list-item>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <v-card-title>
        <v-icon left>
          mdi-wrench
        </v-icon>
        <span class="title font-weight-light">Corrections</span>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-content>
            <v-list-item>App bug fixes</v-list-item>
            <v-list-item>Update Vuetify to 2.4.3</v-list-item>
            <v-list-item> Update Tauri </v-list-item>
          </v-list-item-content>
        </v-list-item>
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
