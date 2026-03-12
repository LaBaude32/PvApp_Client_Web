<script setup lang="ts">
import { type AnnotationState, Renderer } from '@markerjs/markerjs3'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  targetImage: string
  annotation: AnnotationState
}>()

const renderedImage = ref<HTMLImageElement | null>(null)

// Référence pour suivre l'état du chargement
const isLoading = ref(false)

// Stocker la dernière annotation traitée pour éviter les doublons
const lastProcessedAnnotation = ref<string>('')

const renderAnnotation = () => {
  // Générer une clé unique pour détecter les changements
  const annotationKey = JSON.stringify(props.annotation)

  // Si l'annotation n'a pas changé, ne pas retraiter
  if (lastProcessedAnnotation.value === annotationKey) {
    return
  }
  lastProcessedAnnotation.value = annotationKey

  isLoading.value = true

  // Créer une nouvelle image pour chaque rasterisation
  const targetImg = document.createElement('img')
  targetImg.src = props.targetImage + '?t=' + Date.now() // Forcer le rechargement
  targetImg.crossOrigin = 'anonymous'

  // Attendre que l'image soit chargée
  targetImg.onload = () => {
    const renderer = new Renderer()
    renderer.targetImage = targetImg

    // Ajouter un timeout pour éviter les blocages
    const rasterizePromise = renderer.rasterize(props.annotation)

    // Si le promise n'est pas résolu rapidement, afficher un message
    setTimeout(() => {
      if (isLoading.value) {
        console.log('Rasterisation en cours...')
      }
    }, 2000)

    rasterizePromise
      .then((dataUrl) => {
        isLoading.value = false
        if (renderedImage.value && dataUrl) {
          renderedImage.value.src = dataUrl
        } else if (renderedImage.value && !dataUrl) {
          // Si dataUrl est undefined, essayer de créer une nouvelle image
          console.error('dataUrl est undefined, tentative de rechargement')
          setTimeout(() => {
            renderAnnotation()
          }, 100)
        }
      })
      .catch((error) => {
        isLoading.value = false
        console.error('Erreur lors de la rasterisation:', error)
      })
  }

  // Gérer les erreurs de chargement
  targetImg.onerror = () => {
    isLoading.value = false
    console.error("Erreur de chargement de l'image:", props.targetImage)
  }
}

onMounted(renderAnnotation)

// Utiliser un timeout pour éviter les appels multiples rapides
let debounceTimer: number | null = null

const debouncedRenderAnnotation = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = window.setTimeout(() => {
    renderAnnotation()
  }, 100)
}

watch([() => props.targetImage, () => props.annotation], debouncedRenderAnnotation)

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="mt-4 render-container">
    <img ref="renderedImage" max-height="400" max-width="800" style="contain: contain" />
    <div v-if="isLoading" class="loading-overlay">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.render-container {
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
