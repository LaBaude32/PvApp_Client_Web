# Guide d'annotation avec Marker.js3

Ce guide explique comment utiliser le système d'annotation intégré à l'application pour ajouter des formes et annotations aux images avant upload.

## Fonctionnalités implémentées

1. **Éditeur d'annotations** : Permet de dessiner des formes sur une image
2. **Aperçu des annotations** : Visualise les annotations ajoutées
3. **Rendu final** : Génère une image avec toutes les annotations appliquées

## Composants créés

### 1. Editor.vue

Composant principal pour l'édition d'annotations.

- Initialise un `MarkerArea` de marker.js3
- Fournit des boutons pour ajouter des flèches et sauvegarder les annotations
- Émet un événement `save` avec l'état des annotations

### 2. Viewer.vue

Composant pour afficher les annotations.

- Utilise `MarkerView` pour visualiser les annotations
- Met à jour automatiquement lorsque l'annotation change

### 3. Render.vue

Composant pour générer l'image finale.

- Utilise `Renderer` pour rasteriser les annotations
- Retourne une image avec toutes les annotations appliquées

## Intégration dans Items.vue

Le composant `Items.vue` a été modifié pour inclure :

1. **Dialogue d'annotation** : S'ouvre lorsque l'utilisateur sélectionne une image
2. **Workflow d'annotation** :
   - Sélection de l'image → Ouverture du dialogue
   - Édition des annotations → Aperçu en temps réel
   - Validation → L'image est sauvegardée avec les annotations

## Utilisation

### Pour les développeurs

1. **Installation** : Le package `@markerjs/markerjs3` est déjà installé dans `package.json`

2. **Utilisation de base** :

```typescript
import { ref } from 'vue'
import type { AnnotationState } from '@markerjs/markerjs3'
import Editor from './components/Editor.vue'

const annotation = ref<AnnotationState | null>(null)

const handleSave = (newAnnotation: AnnotationState) => {
  annotation.value = newAnnotation
}
```

3. **Types disponibles** :

- `AnnotationState` : État complet des annotations
- `MarkerArea` : Zone d'édition
- `MarkerView` : Visualisation des annotations
- `Renderer` : Génération de l'image finale

### Pour les utilisateurs finaux

1. **Ajouter une image** :
   - Cliquez sur le bouton "Photo" dans le formulaire d'item
   - Sélectionnez une image depuis votre appareil

2. **Annoter l'image** :
   - Le dialogue d'annotation s'ouvre automatiquement
   - Cliquez sur "Ajouter une flèche" pour dessiner des flèches
   - Utilisez la souris pour positionner et dimensionner les formes

3. **Sauvegarder** :
   - Cliquez sur "Sauvegarder" dans l'éditeur
   - L'aperçu se met à jour avec les annotations
   - Cliquez sur "Valider et continuer" pour fermer le dialogue

## Personnalisation avancée

### Ajouter d'autres types de formes

Pour ajouter des formes supplémentaires (rectangles, cercles, etc.) :

```typescript
import { RectangleMarker, CircleMarker } from '@markerjs/markerjs3'

// Dans votre composant Editor.vue
const addRectangle = () => {
  editor.value?.createMarker(RectangleMarker)
}

const addCircle = () => {
  editor.value?.createMarker(CircleMarker)
}
```

### Personnaliser les styles

Vous pouvez personnaliser l'apparence des annotations :

```typescript
editor.value?.setOptions({
  strokeColor: '#FF0000', // Couleur de la bordure
  fillColor: '#FF000033', // Couleur de remplissage (avec transparence)
  strokeWidth: 2, // Épaisseur de la bordure
  arrowHeadSize: 8 // Taille de la tête de flèche
})
```

## Dépannage

### Problèmes courants

1. **L'image ne s'affiche pas** :
   - Vérifiez que le chemin de l'image est correct
   - Assurez-vous que l'image existe dans le dossier public

2. **Les annotations ne sont pas sauvegardées** :
   - Vérifiez que l'événement `@save` est bien capturé
   - Assurez-vous que `annotationState.value` est mis à jour

3. **Erreurs TypeScript** :
   - Le package `@markerjs/markerjs3` est déjà installé
   - Les types sont disponibles dans le package npm

### Debugging

Pour déboguer les annotations :

```typescript
console.log(editor.value?.getState()) // Affiche l'état actuel
console.log(annotationState.value) // Affiche les annotations sauvegardées
```

## Exemple complet

Voir `src/views/TestAnnotation.vue` pour un exemple complet d'utilisation.

## Ressources supplémentaires

- [Documentation officielle de Marker.js3](https://markerjs3.github.io/)
- [Démos et exemples](https://github.com/markerjs/markerjs3/tree/master/examples)
- [API Reference](https://markerjs3.github.io/api/)
