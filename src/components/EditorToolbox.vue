<script setup lang="ts">
import { computed } from 'vue'

interface MarkerEditor {
  marker?: {
    strokeColor?: string
    fillColor?: string
    opacity?: number
  }
}

const props = defineProps<{
  mode: 'select' | 'create' | 'rendering'
  canUndo: boolean
  canRedo: boolean
  markerEditor: MarkerEditor | null
  strokeColor: string
  fillColor: string
  opacity: number
  onAction: (action: string) => void
  onUpdateStrokeColor: (color: string) => void
  onUpdateFillColor: (color: string) => void
  onUpdateOpacity: (value: number) => void
}>()

const emit = defineEmits<{
  (e: 'action', action: string): void
  (e: 'updateStrokeColor', color: string): void
  (e: 'updateFillColor', color: string): void
  (e: 'updateOpacity', value: number): void
}>()

const handleAction = (action: string) => {
  emit('action', action)
}

const updateStrokeColor = (color: string) => {
  emit('updateStrokeColor', color)
}

const updateFillColor = (color: string) => {
  emit('updateFillColor', color)
}

const updateOpacity = (value: number) => {
  emit('updateOpacity', value)
}

// Check if marker editor can edit stroke
const canEditStroke = computed(() => {
  return props.markerEditor?.marker?.strokeColor !== undefined
})

// Check if marker editor can edit fill
const canEditFill = computed(() => {
  return props.markerEditor?.marker?.fillColor !== undefined
})

// Check if marker editor can edit opacity
const canEditOpacity = computed(() => {
  return props.markerEditor?.marker?.opacity !== undefined
})
</script>

<template>
  <div class="editor-toolbox">
    <div class="toolbox-section">
      <v-btn
        @click="handleAction('zoom-out')"
        :color="mode === 'rendering' ? 'disabled' : 'default'"
        aria-label="Zoom out"
      >
        <v-icon icon="mdi-minus"></v-icon>
      </v-btn>
      <v-btn
        @click="handleAction('zoom-reset')"
        :color="mode === 'rendering' ? 'disabled' : 'default'"
        aria-label="Reset zoom"
      >
        <v-icon icon="mdi-restore"></v-icon>
      </v-btn>
      <v-btn
        @click="handleAction('zoom-in')"
        :color="mode === 'rendering' ? 'disabled' : 'default'"
        aria-label="Zoom in"
      >
        <v-icon icon="mdi-plus"></v-icon>
      </v-btn>
    </div>

    <div class="toolbox-section" v-if="canEditStroke">
      <v-icon icon="mdi-format-color-text"></v-icon>
      <input
        type="color"
        :value="strokeColor"
        @change="updateStrokeColor(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="toolbox-section" v-if="canEditFill">
      <v-icon icon="mdi-format-color-fill"></v-icon>
      <input
        type="color"
        :value="fillColor"
        @change="updateFillColor(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="toolbox-section" v-if="canEditOpacity">
      <v-icon icon="mdi-opacity"></v-icon>
      <input
        type="range"
        min="0"
        max="100"
        :value="opacity"
        @change="updateOpacity(parseInt(($event.target as HTMLInputElement).value))"
      />
      <span>{{ opacity }}%</span>
    </div>
  </div>
</template>

<style scoped>
.editor-toolbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  gap: 16px;
}

.toolbox-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbox-section input[type='color'] {
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.toolbox-section input[type='range'] {
  width: 120px;
}
</style>
