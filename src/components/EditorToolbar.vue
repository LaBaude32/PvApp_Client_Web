<script setup lang="ts">
const props = defineProps<{
  mode: 'select' | 'create' | 'rendering'
  canUndo: boolean
  canRedo: boolean
  canDelete: boolean
  markerTypes: any[]
  currentMarkerType: any
  saveVisible: boolean
  onAction: (action: string) => void
  onNewMarker: (markerType: any) => void
}>()

const emit = defineEmits<{
  (e: 'action', action: string): void
  (e: 'newMarker', markerType: any): void
}>()

const handleAction = (action: string) => {
  props.onAction(action)
}

const handleNewMarker = (markerType: any) => {
  props.onNewMarker(markerType)
}
</script>

<template>
  <div class="editor-toolbar">
    <div class="toolbar-section">
      <v-btn
        @click="handleAction('select')"
        :class="{ 'v-btn--active': mode === 'select' }"
        :color="mode === 'select' ? 'primary' : 'default'"
        `
      >
        <v-icon icon="mdi-arrow-all" />
      </v-btn>

      <v-btn
        @click="handleAction('delete')"
        :disabled="!canDelete"
        :color="canDelete ? 'default' : 'disabled'"
      >
        <v-icon icon="mdi-trash-can" />
      </v-btn>
    </div>

    <div class="marker-types-section">
      <v-menu
        v-for="group in markerTypes"
        :key="group.name"
        :close-on-content-click="false"
        location="bottom center"
      >
        <template v-slot:activator="{ props }">
          <v-btn rounded="lg" v-bind="props">
            <v-icon>{{ getGroupIcon(group.name) }}</v-icon>
          </v-btn>
        </template>

        <v-list class="mt-1 d-flex pa-2">
          <v-list-item
            v-for="marker in group.markerTypes"
            :key="marker.name"
            @click="handleNewMarker(marker)"
            class="text-center"
          >
            <v-icon :icon="getMarkerIcon(marker.name)" />
          </v-list-item>
        </v-list>
      </v-menu>
    </div>

    <div class="toolbar-section">
      <v-btn
        @click="handleAction('save')"
        :disabled="!canUndo && !canRedo"
        :color="saveVisible ? 'success' : 'disabled'"
      >
        <v-icon icon="mdi-content-save" />
      </v-btn>

      <v-btn
        @click="handleAction('undo')"
        :disabled="!canUndo"
        :color="canUndo ? 'default' : 'disabled'"
      >
        <v-icon icon="mdi-undo" />
      </v-btn>

      <v-btn
        @click="handleAction('redo')"
        :disabled="!canRedo"
        :color="canRedo ? 'default' : 'disabled'"
      >
        <v-icon icon="mdi-redo" />
      </v-btn>

      <v-btn
        @click="handleAction('download')"
        :disabled="mode === 'rendering'"
        :loading="mode === 'rendering'"
        :color="mode === 'rendering' ? 'disabled' : 'default'"
      >
        <v-icon icon="mdi-download" />
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'EditorToolbar',
  methods: {
    getGroupIcon(groupName: string): string {
      switch (groupName) {
        case 'Basic shapes':
          return 'mdi-square-outline'
        case 'Lines':
          return 'mdi-arrow-right-thin'
        case 'Text':
          return 'mdi-format-size'
        case 'Advanced shapes':
          return 'mdi-draw'
        case 'Emojis':
          return 'mdi-emoticon-outline'
        default:
          return 'mdi-square-outline'
      }
    },
    getMarkerIcon(markerName: string): string {
      switch (markerName) {
        case 'Rectangle':
          return 'mdi-square-outline'
        case 'Cover (filled rectangle)':
          return 'mdi-square'
        case 'Highlight':
          return 'mdi-grease-pencil'
        case 'Ellipse':
          return 'mdi-ellipse-outline'
        case 'Ellipse (filled)':
          return 'mdi-ellipse'
        case 'Arrow':
          return 'mdi-arrow-right-thin'
        case 'Line':
          return 'mdi-vector-line'
        case 'Measure':
          return 'mdi-ruler'
        case 'Curve':
          return 'mdi-vector-curve'
        case 'Text':
          return 'mdi-format-size'
        case 'Callout':
          return 'mdi-tooltip-text'
        case 'Captioned frame':
          return 'mdi-format-textbox'
        case 'Callout':
          return 'mdi-grease-pencil'
        case 'Polygon':
          return 'mdi-vector-polygon'
        case 'Freehand':
          return 'mdi-draw'
        case 'Highlighter':
          return 'mdi-grease-pencil'
        case 'Smile':
          return 'mdi-emoticon-outline'
        default:
          return 'mdi-square-outline'
      }
    }
  }
}
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  gap: 8px;
}

.toolbar-section {
  display: flex;
  gap: 4px;
}

.marker-types-section {
  display: flex;
  gap: 4px;
}
</style>
