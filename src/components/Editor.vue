<script setup lang="ts">
import { type AnnotationState, ArrowMarker, MarkerArea } from '@markerjs/markerjs3'
import { onMounted, ref } from 'vue'

// Define component props
const props = defineProps<{
  targetImage: string
}>()

// Define emitted events
const emit = defineEmits<{
  (e: 'save', annotation: AnnotationState): void
}>()

// References to DOM and MarkerArea
const editorContainer = ref<HTMLDivElement | null>(null)
const editor = ref<MarkerArea | null>(null)

// Initialize MarkerArea on component mount
onMounted(() => {
  if (editorContainer.value) {
    const targetImg = document.createElement('img')
    targetImg.src = props.targetImage

    editor.value = new MarkerArea()
    editor.value.targetImage = targetImg

    editorContainer.value.appendChild(editor.value)
  }
})

// Add arrow marker handler
const addArrow = () => {
  editor.value?.createMarker(ArrowMarker)
}

// Save annotation handler
const saveAnnotation = () => {
  if (editor.value) {
    emit('save', editor.value.getState())
  }
}
</script>

<template>
  <div class="editor-container">
    <div class="toolbar">
      <v-btn color="primary" @click="addArrow">Ajouter Flèche</v-btn>
      <v-btn color="success" @click="saveAnnotation">Sauvegarder</v-btn>
    </div>
    <div ref="editorContainer" class="editor-area"></div>
  </div>
</template>

<style scoped>
.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.toolbar {
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.editor-area {
  min-height: 400px;
  width: 100%;
}
</style>
