<script setup lang="ts">
import type { AnnotationState } from '@markerjs/markerjs3'
import { MarkerView } from '@markerjs/markerjs3'
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  targetImage: string
  annotation: AnnotationState
}>()

const viewerContainer = ref<HTMLDivElement | null>(null)
const viewer = ref<MarkerView | null>(null)

onMounted(() => {
  if (viewerContainer.value) {
    const targetImg = document.createElement('img')
    targetImg.src = props.targetImage

    viewer.value = new MarkerView()
    viewer.value.targetImage = targetImg

    viewerContainer.value.appendChild(viewer.value)

    viewer.value.show(props.annotation)
  }
})

watch(
  () => props.annotation,
  (newAnnotation) => {
    viewer.value?.show(newAnnotation)
  }
)
</script>

<template>
  <div ref="viewerContainer" class="marker-viewer"></div>
</template>

<style scoped>
.marker-viewer {
  width: 100%;
  min-height: 400px;
  border: 1px dashed #ccc;
  background-color: white;
  margin-top: 16px;
}
</style>
