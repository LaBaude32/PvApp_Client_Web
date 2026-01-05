<template>
  <v-container>
    <h1 class="text-h4 mb-6">Test d'annotation avec Marker.js3</h1>

    <v-card class="mb-6">
      <v-card-title>Éditeur d'annotations</v-card-title>
      <v-card-text>
        <Editor v-show="!isSavedImage" :target-image="sampleImage" @save="handleSave" />
        <template v-if="annotation">
          <Render :targetImage="sampleImage" :annotation="annotation" />
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { AnnotationState } from '@markerjs/markerjs3'
import { ref } from 'vue'
import Editor from '../components/Editor.vue'
import Render from '../components/Render.vue'

const isSavedImage = ref(false)

const sampleImage = '/sample-images/sample-image.png'
const annotation = ref<AnnotationState | null>(null)

const handleSave = (newAnnotation: AnnotationState) => {
  annotation.value = newAnnotation
}
</script>
