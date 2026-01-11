<script setup lang="ts">
import {
  type AnnotationState,
  ArrowMarker,
  CalloutMarker,
  CaptionFrameMarker,
  CoverMarker,
  CurveMarker,
  CustomImageMarker,
  EllipseFrameMarker,
  EllipseMarker,
  FrameMarker,
  FreehandMarker,
  HighlighterMarker,
  HighlightMarker,
  LineMarker,
  MarkerArea,
  MeasurementMarker,
  PolygonMarker,
  Renderer,
  TextMarker
} from '@markerjs/markerjs3'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import EditorToolbar from './EditorToolbar.vue'
import EditorToolbox from './EditorToolbox.vue'

// Define component props
const props = defineProps<{
  targetImage: string | File
  annotation?: AnnotationState | null
  onSave?: (data: { state: AnnotationState; renderedImage?: File; isAnnotated: boolean }) => void
}>()

// Define emitted events
const emit = defineEmits<{
  (e: 'save', data: { state: AnnotationState; renderedImage?: File }): void
  (e: 'close'): void
}>()

// References to DOM and MarkerArea
const editorContainer = ref<HTMLDivElement | null>(null)
const editor = ref<MarkerArea | null>(null)

// Editor state management
const editorState = reactive({
  mode: 'select' as 'select' | 'create' | 'rendering',
  canUndo: false,
  canRedo: false,
  canDelete: false
})

// Current marker type and editor
const currentMarkerType = ref<any>(null)
const currentMarkerEditor = ref<any>(null)

// Color picker state
const strokeColor = ref<string>('#000000')
const fillColor = ref<string>('#000000')
const opacity = ref<number>(100)

// Marker types with more comprehensive options
const markerTypes = [
  {
    name: 'Basic shapes',
    markerTypes: [
      {
        icon: 'rectangle',
        name: 'Rectangle',
        markerType: FrameMarker
      },
      {
        icon: 'cover',
        name: 'Cover (filled rectangle)',
        markerType: CoverMarker
      },
      {
        icon: 'highlight',
        name: 'Highlight',
        markerType: HighlightMarker
      },
      {
        icon: 'ellipse-frame',
        name: 'Ellipse',
        markerType: EllipseFrameMarker
      },
      {
        icon: 'ellipse',
        name: 'Ellipse (filled)',
        markerType: EllipseMarker
      }
    ]
  },
  {
    name: 'Lines',
    markerTypes: [
      {
        icon: 'arrow',
        name: 'Arrow',
        markerType: ArrowMarker
      },
      {
        icon: 'line',
        name: 'Line',
        markerType: LineMarker
      },
      {
        icon: 'measurement',
        name: 'Measure',
        markerType: MeasurementMarker
      },
      {
        icon: 'curve',
        name: 'Curve',
        markerType: CurveMarker
      }
    ]
  },
  {
    name: 'Text',
    markerTypes: [
      {
        icon: 'text',
        name: 'Text',
        markerType: TextMarker
      },
      {
        icon: 'callout',
        name: 'Callout',
        markerType: CalloutMarker
      },
      {
        icon: 'caption-frame',
        name: 'Captioned frame',
        markerType: CaptionFrameMarker
      }
    ]
  },
  {
    name: 'Advanced shapes',
    markerTypes: [
      {
        icon: 'freehand',
        name: 'Freehand',
        markerType: FreehandMarker
      },
      {
        icon: 'highlighter',
        name: 'Highlighter',
        markerType: HighlighterMarker
      },
      {
        icon: 'polygon',
        name: 'Polygon',
        markerType: PolygonMarker
      }
    ]
  }
]

// Initialize MarkerArea on component mount
onMounted(() => {
  console.log(props.targetImage)

  if (editorContainer.value) {
    const targetImg = document.createElement('img')

    if (props.targetImage instanceof File) {
      targetImg.src = URL.createObjectURL(props.targetImage)
    } else {
      targetImg.src = props.targetImage
      // Set crossOrigin for same-origin images to avoid CORS issues
      targetImg.crossOrigin = 'anonymous'
    }

    editor.value = new MarkerArea()
    editor.value.targetImage = targetImg

    // Set a reasonable size for the target image in the editor
    const editorAreaWidth = editorContainer.value.clientWidth
    if (editor.value) {
      editor.value.targetWidth =
        editorAreaWidth < 400
          ? 400
          : editorAreaWidth < 2000
            ? Math.round((editorAreaWidth * 0.9) / 10) * 10
            : -1
    }

    // Add event listeners for editor state updates
    if (editor.value) {
      editor.value.addEventListener('areastatechange', () => {
        updateCalculatedEditorState()
      })

      editor.value.addEventListener('markerselect', (ev: any) => {
        currentMarkerEditor.value = ev.detail.markerEditor
        updateCalculatedEditorState()
        // Update color pickers when a marker is selected
        if (ev.detail.markerEditor.marker) {
          strokeColor.value = ev.detail.markerEditor.marker.strokeColor || '#000000'
          fillColor.value = ev.detail.markerEditor.marker.fillColor || '#000000'
          opacity.value = Math.round((ev.detail.markerEditor.marker.opacity || 1) * 100)
        }
      })

      editor.value.addEventListener('markerdeselect', () => {
        currentMarkerEditor.value = null
        updateCalculatedEditorState()
      })

      editor.value.addEventListener('markercreate', () => {
        editorState.mode = 'select'
      })
    }

    editorContainer.value.appendChild(editor.value)

    // Watch for annotation changes to restore state
    if (props.annotation) {
      editor.value.restoreState(props.annotation)
    }
  }
})

// Update calculated editor state
const updateCalculatedEditorState = () => {
  if (editor.value) {
    const editorInstance = editor.value
    editorState.canUndo = editorInstance.isUndoPossible
    editorState.canRedo = editorInstance.isRedoPossible
    editorState.canDelete = editorInstance.selectedMarkerEditors.length > 0
  }
}

// Handle toolbar actions
const handleToolbarAction = (action: string) => {
  if (!editor.value) return

  switch (action) {
    case 'select': {
      editorState.mode = 'select'
      editor.value.switchToSelectMode()
      break
    }
    case 'delete': {
      // @todo confirm delete
      editor.value.deleteSelectedMarkers()
      break
    }
    case 'undo': {
      editor.value.undo()
      break
    }
    case 'redo': {
      editor.value.redo()
      break
    }
    case 'zoom-in': {
      if (editor.value) {
        editor.value.zoomLevel += 0.1
      }
      break
    }
    case 'zoom-out': {
      if (editor.value && editor.value.zoomLevel > 0.2) {
        editor.value.zoomLevel -= 0.1
      }
      break
    }
    case 'zoom-reset': {
      if (editor.value) {
        editor.value.zoomLevel = 1
      }
      break
    }
    case 'save': {
      if (editor.value) {
        const state = editor.value.getState()
        // Récupérer l'image rendue avec les annotations
        const renderer = new Renderer()
        renderer.targetImage = editor.value.targetImage
        renderer.naturalSize = true
        renderer.imageType = 'image/png'

        renderer.rasterize(state).then((renderedImage) => {
          // Créer un objet Blob à partir de l'image rendue
          fetch(renderedImage)
            .then((res) => res.blob())
            .then((blob) => {
              // Créer un objet File à partir du Blob
              const file = new File([blob], 'annotated-image.png', { type: 'image/png' })
              emit('save', {
                state: state,
                renderedImage: file,
                isAnnotated: true
              })
            })
        })
      }
      break
    }
    case 'download': {
      downloadMarkedImage()
      break
    }
  }
  updateCalculatedEditorState()
}

// Handle new marker creation
const handleNewMarker = (markerType: any) => {
  currentMarkerType.value = markerType
  if (editor.value && markerType) {
    editorState.mode = 'create'
    const markerEditor = editor.value.createMarker(markerType.markerType)
    if (markerEditor && markerEditor.marker instanceof CustomImageMarker) {
      markerEditor.marker.defaultSize = { width: 32, height: 32 }
    }
  }
}

// Update stroke color
const updateStrokeColor = (color: string) => {
  strokeColor.value = color
  if (currentMarkerEditor.value && currentMarkerEditor.value.marker) {
    currentMarkerEditor.value.marker.strokeColor = color
  }
}

// Update fill color
const updateFillColor = (color: string) => {
  fillColor.value = color
  if (currentMarkerEditor.value && currentMarkerEditor.value.marker) {
    currentMarkerEditor.value.marker.fillColor = color
  }
}

// Update opacity
const updateOpacity = (value: number) => {
  opacity.value = value
  if (currentMarkerEditor.value && currentMarkerEditor.value.marker) {
    currentMarkerEditor.value.marker.opacity = value / 100
  }
}

// Download marked image
const downloadMarkedImage = async () => {
  if (editor.value) {
    editorState.mode = 'rendering'
    const currentState = editor.value.getState()

    const renderer = new Renderer()
    renderer.targetImage = editor.value.targetImage
    renderer.naturalSize = true
    renderer.imageType = 'image/png'

    const renderedImage = await renderer.rasterize(currentState)

    const downloadLink = document.createElement('a')
    downloadLink.href = renderedImage
    downloadLink.download = 'marked-image.png'
    downloadLink.click()

    editorState.mode = 'select'
  }
}

// Watch for annotation changes
watch(
  () => props.annotation,
  (newAnnotation) => {
    if (editor.value && newAnnotation) {
      editor.value.restoreState(newAnnotation)
    }
  },
  { deep: true }
)

// Computed property to determine if save button should be visible
const saveVisible = computed(() => !!props.onSave)
</script>

<template>
  <div class="editor-container">
    <!-- Toolbar -->
    <EditorToolbar
      :mode="editorState.mode"
      :canUndo="editorState.canUndo"
      :canRedo="editorState.canRedo"
      :canDelete="editorState.canDelete"
      :markerTypes="markerTypes"
      :currentMarkerType="currentMarkerType"
      :saveVisible="saveVisible"
      :onAction="handleToolbarAction"
      :onNewMarker="handleNewMarker"
    />

    <!-- Editor area -->
    <div ref="editorContainer" class="editor-area"></div>

    <!-- Toolbox -->
    <EditorToolbox
      :mode="editorState.mode"
      :canUndo="editorState.canUndo"
      :canRedo="editorState.canRedo"
      :markerEditor="currentMarkerEditor"
      :strokeColor="strokeColor"
      :fillColor="fillColor"
      :opacity="opacity"
      :onAction="handleToolbarAction"
      :onUpdateStrokeColor="updateStrokeColor"
      :onUpdateFillColor="updateFillColor"
      :onUpdateOpacity="updateOpacity"
    />
  </div>
</template>

<style scoped>
.editor-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
}

.editor-area {
  min-height: 400px;
  width: 100%;
  flex-grow: 1;
  background-color: #f9fafb;
}
</style>
