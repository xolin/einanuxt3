<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@48,400,0,0" />            
    
    <!-- Phase 5: Mobile Components -->
    <MobileOnboarding 
      :is-visible="showMobileOnboarding"
      @close="closeMobileOnboarding"
      @complete="completeMobileOnboarding"
      @skip="skipMobileOnboarding"
    />
    
    <MobileShareModal 
      :is-visible="showMobileShareModal"
      :design-image="currentDesignImage"
      :design-name="currentDesignName"
      :design-id="currentDesignId"
      @close="closeMobileShareModal"
      @download="handleMobileDownload"
      @share="handleMobileShare"
      @save="handleMobileSave"
    />
    
    <!-- Phase 4: Advanced Features & Polish Components -->
    <DesignManager 
      ref="designManager" 
      :canvas-data="getCanvasData()"
      :class="{ 'desktop-only': isMobile }"
      @load-design="loadDesign"
      @design-saved="onDesignSaved"
      @share-design="shareDesign"
    />
    
    <EnhancedLayerManager 
      ref="enhancedLayerManager" 
      :layers="enhancedLayersList"
      :selected-layer="selectedObject"
      :class="{ 'desktop-only': isMobile }"
      @select-layer="selectLayer"
      @toggle-visibility="toggleLayerVisibility"
      @toggle-lock="toggleLayerLock"
      @delete-layer="deleteLayer"
      @duplicate-layer="duplicateLayer"
      @reorder-layers="reorderLayers"
      @update-layer-opacity="updateLayerOpacity"
      @rename-layer="renameLayer"
    />
    
    <ShareDesign 
      :is-visible="showShareModal && !isMobile"
      :design="currentDesignForSharing"
      :canvas-ref="canvasEl"
      @close="closeShareModal"
    />
    
    <!-- <section class="fixed pl-200"> -->
    <!-- <LayersList v-if="layersListVisible" :layers="layersList"></LayersList> -->
    <section ref="canvasWrapper" v-resize="resize" class="canvas__wrapper fixed" :class="{ 'top-12': !isMobile, 'top-0': isMobile }" @click="canvasEv()">
        <canvas ref="canvasEl" class="canvas"></canvas>
        <div class="options--bottom-left">
            <span v-if="layersList.length>1000" hidden class="rounded__btn material-symbols-sharp" @click="toggleLayersList()">
                layers
            </span>
            <div id="download-modal" class="hidden relative z-10 overflow-x-hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" tabindex="-1" aria-hidden="true">
            <!--
                Background backdrop, show/hide based on modal state.

                Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
                Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <!--
                        Modal panel, show/hide based on modal state.

                        Entering: "ease-out duration-300"
                        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        To: "opacity-100 translate-y-0 sm:scale-100"
                        Leaving: "ease-in duration-200"
                        From: "opacity-100 translate-y-0 sm:scale-100"
                        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    -->
                    <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xs">
                        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <!-- <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            </div> -->
                            <div class="mt-3 text-center sm:mt-0 sm:text-left">
                            <h3 id="modal-title" class="text-center text-base font-semibold leading-6 text-gray-900">Enviando a imprimir!</h3>
                            <div class="mt-2">
                                <p class="text-center text-sm text-gray-500">Hemos recibido tu diseño.</p>
                                <p class="text-center text-sm text-gray-500">¡En las próximas 72 horas vamos a enviarte tu tabla personalizada!</p>
                                <p class="text-center text-sm text-gray-500">Gracias por confiar en nosotros</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- File input for upload functionality -->
        <input ref="file" type="file" accept="image/*;capture=camera" class="hidden" @change="uploadFile($event)" />
        
        <!-- Hidden color picker for deck color -->
        <input ref="deckColorInput" type="color" :value="colors.hex" class="hidden" @input="handleDeckColorChange($event.target.value)" />
        
        <!-- Emoji picker (positioned by CSS) -->
        <div v-if="emojiVisible" class="simple-emoji-picker">
            <div class="emoji-categories">
                <span
v-for="(categoryData, categoryName) in emojiCategories" 
                      :key="categoryName" 
                      class="category-tab" 
                      :class="{ active: activeEmojiCategory === categoryName }"
                      :title="categoryName"
                      @click="activeEmojiCategory = categoryName">
                    {{ categoryData.icon }}
                </span>
            </div>
            <div class="emoji-grid">
                <span
v-for="emoji in emojiCategories[activeEmojiCategory].emojis" 
                      :key="emoji" 
                      class="emoji-option" 
                      @click="onSelectEmoji({i: emoji})">{{ emoji }}</span>
            </div>
        </div>
        <div hidden>
            <!-- Hidden until release and refactor-->
            <button id="undo" ref="undoButton" type="button" v-bind="undoDisabled" @click="undo()">Undo</button>
            <button id="redo" ref="redoButton" type="button" v-bind="redoDisabled" @click="redo()">Redo</button>
        </div>
        
        <!-- <div class="options--bottom-right">
            <Tooltip text="Descargar diseño finalizado" shortcut="D" position="top">
                <span class="rounded__btn cursor-pointer material-symbols-sharp color-green rounded__btn-downloadbig" @click="startDownload()" :class="downloadVisibleClassObject" v-html="downloadVisibleIconComputed"></span>
            </Tooltip>
            <span class="rounded__btn cursor-pointer material-symbols-sharp color-blue rounded__btn-downloadbig" @click="generatePrints()" :class="downloadVisibleClassObject" v-html="downloadVisibleIconComputed"></span>
        </div> -->
        <!-- <div class="options--top-right cursor-pointer" @click="toggleLayersList()" v-if="layersList.length>0">
            
        </div> -->
        <div class="textedit--top">
            <!-- Text editing options moved to OrganizedToolbar -->
        </div>
        <div class="objectmove--top" @click="confirmPostion()">
            <img src="/img/icon/Eo_circle_green_checkmark.svg " class="btn-add-color" />
        </div>
        <div class="textedit--top-center ">
            <fontfamilytool
                v-for="fontFamily in fontFamilyAvailable"
                :key="fontFamily" 
                :font="fontFamily"
            ></fontfamilytool>
        </div>
    </section>
    
    <!-- Phase 3: Organized Toolbar -->
    <div v-if="!isMobile" class="organized-toolbar-container">
      <OrganizedToolbar 
        :active-color-picker="activeColorPicker"
        :emoji-picker-visible="emojiVisible"
        :can-undo="canUndo"
        :can-redo="canRedo"
        :is-generating-download="downloadInProgress"
        :is-mobile="isMobile"
        :has-selected-text="hasSelectedText"
        :selected-font="selectedFont"
        :font-size="fontSize"
        :font-weight="fontWeight"
        :is-bold="isBold"
        :is-italic="isItalic"
        :is-underline="isUnderline"
        :text-align="textAlign"
        :deck-color="colors.hex"
        :text-color="textColor.hex"
        @tool-action="handleToolbarAction"
        @deck-color-change="handleDeckColorChange"
        @text-color-change="handleTextColorChange"
        @font-change="handleFontChange"
        @font-size-change="handleFontSizeChange"
        @font-weight-change="handleFontWeightChange"
        @text-style-change="handleTextStyleChange"
        @text-align-change="handleTextAlignChange"
      />
    </div>

    <!-- Mobile Toolbar for mobile devices -->
    <MobileToolbar 
      v-if="isMobile"
      :active-color-picker="activeColorPicker"
      :emoji-picker-visible="emojiVisible"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-generating-download="downloadInProgress"
      :has-selected-text="hasSelectedText"
      :selected-font="selectedFont"
      :font-size="fontSize"
      :font-weight="fontWeight"
      :is-bold="isBold"
      :is-italic="isItalic"
      :is-underline="isUnderline"
      :text-align="textAlign"
      :deck-color="colors.hex"
      :text-color="textColor.hex"
      @tool-action="handleToolbarAction"
      @deck-color-change="handleDeckColorChange"
      @text-color-change="handleTextColorChange"
      @font-change="handleFontChange"
      @font-size-change="handleFontSizeChange"
      @font-weight-change="handleFontWeightChange"
      @text-style-change="handleTextStyleChange"
      @text-align-change="handleTextAlignChange"
    />

    <!-- Phase 3: Template Gallery -->
    <TemplateGallery 
      :is-visible="showTemplateGallery"
      @close="hideTemplateGallery"
      @select-template="applyTemplate"
    />

    <!-- Phase 3.2: 3D Preview Modal -->
    <SkateboardPreview 
      :is-visible="showPreview"
      :deck-color="colors.hex"
      :elements="canvasElements"
      @close="hidePreview"
      @export="handlePreviewExport"
    />

    <!-- New UX Components -->
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :is-visible="loadingState.isVisible"
      :message="loadingState.message"
      :show-progress="loadingState.showProgress"
      :progress="loadingState.progress"
    />
    
    <!-- Confirmation Toast -->
    <ConfirmationToast 
      :is-visible="toastState.isVisible"
      :type="toastState.type"
      :title="toastState.title"
      :message="toastState.message"
      @close="hideToast"
    />
    
    <!-- Empty State Guidance -->
    <EmptyStateGuidance 
      :is-visible="showEmptyState"
      @action="handleEmptyStateAction"
      @close="hideEmptyState"
      @dismiss="dismissEmptyState"
    />
    
    <!-- Contextual Hints -->
    <!--<ContextualHints 
      ref="contextualHints"
      :hints="customHints"
      @dismiss="onHintDismiss"
    />-->
    
    <!-- Layers Button - Separate from Help Button -->
    <div class="layers-button-container">
      <Tooltip text="Administrar capas" shortcut="L" position="left">
        <button
          class="fixed top-32 right-0 transform bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-l-lg shadow-lg z-40 transition-colors duration-200"
          :class="{ 'right-80': layersListVisible }"
          @click="toggleLayersList"
        >
          <span class="material-symbols-sharp text-xl">
            layers
          </span>
        </button>
      </Tooltip>
    </div>

    <!-- Help Panel -->
    <HelpPanel />
    
    <!-- Welcome Modal for new users -->
    <WelcomeModal />
</template>
<script setup>
import { fabric } from 'fabric-with-gestures-notupdated';
import { ref, shallowRef, onMounted, computed } from 'vue';
import { useNuxtApp } from '#app'

import { useStore } from 'vuex'

// Phase 5: Mobile Optimization Composables
import { useMobile } from '~/composables/useMobile'
import { useTouchGestures } from '~/composables/useTouchGestures'
import { useCamera } from '~/composables/useCamera'
import { useOfflineMode } from '~/composables/useOfflineMode'

// Phase 5: Mobile Components
import MobileOnboarding from './MobileOnboarding.vue'
import MobileShareModal from './MobileShareModal.vue'

// Import new UX components
import LoadingSpinner from './UX/LoadingSpinner.vue'
import ConfirmationToast from './UX/ConfirmationToast.vue'
import EmptyStateGuidance from './UX/EmptyStateGuidance.vue'
import ContextualHints from './UX/ContextualHints.vue'
import OrganizedToolbar from './UX/OrganizedToolbar.vue'
import MobileToolbar from './UX/MobileToolbar.vue'
import TemplateGallery from './UX/TemplateGallery.vue'
import SkateboardPreview from './UX/SkateboardPreview.vue'

// Phase 4: Advanced Features & Polish Components
import DesignManager from './UX/DesignManager.vue'
import EnhancedLayerManager from './UX/EnhancedLayerManager.vue'
import TextFormatting from './UX/TextFormatting.vue'
import ShareDesign from './UX/ShareDesign.vue'

// Additional UI Components
import HelpPanel from './HelpPanel.vue'
import WelcomeModal from './WelcomeModal.vue'

// Phase 5: Mobile Optimization Setup
const { isMobile, isTouch, screenSize } = useMobile()
const { lightHaptic, mediumHaptic, strongHaptic, setupGestureDetection, onGesture, enableGestures, disableGestures } = useTouchGestures()
const { isSupported: isCameraSupported, getImageFromDevice } = useCamera()
const { isOnline, isOfflineEnabled, cacheDesign, addToSyncQueue } = useOfflineMode()

// Mobile-specific reactive variables
const showMobileOnboarding = ref(false)
const showMobileToolbar = ref(true)
const showMobileShareModal = ref(false)
const selectedTool = ref('text')
const currentDesignImage = ref('')
const currentDesignName = ref('')
const currentDesignId = ref('')

const canvasWrapper = ref(null);
const canvasEl = ref(null);
const deckColorInput = ref(null);
let canvas = null;
const isMobileDevice = ref(null);
const uuid = ref(null);

const img = ref('');

const optionsTopVisible = ref('visible')
const optionsTopOpacity = ref(1);
const optionsTopZindex = ref(10);

const layersList = shallowRef([])
const layersListVisible = ref(false)

const emojiVisible = ref(false)
const generatingPrints = ref(false)

const bgDeckColor = ref('#026ed9') // Old value: #6697CC, older: #3f75826b
const backgroundPositionLeft = ref(2650)
const backgroundScale = ref(74500)
const deckBackgroundWidth = ref(2833)
const deckBackgroundHeight = ref(10119)

const activeTextColor = ref('#ff3c22')


const popoverLeft = ref('0px');
const popoverTop = ref('0px');
const popoverVisible = ref('hidden')
const popoverOpacity = ref(0);
const popoverZindex = ref(-1);
const popoverTransform = ref('translate(0, 10px);')
const popoverTransition = ref('all 0 ease 0')

const textEditFontTop = ref('450px')

const objectMoveVisible = ref('hidden')

const colorpickerVisible = ref('hidden')
const textcolorpickerVisible = ref('hidden')

const selectedObject = ref(null)
const lastSelectedObject = ref(null)

const bin = ref(null)

const colors = ref({ hex: '#026ed9' })
const textColor = ref({ hex: '#3D94FF' })
const fontFamilyAvailable = ref(['Caveat', 'Sevillana', 'Moon Dance', 'Anton', 'Pacifico', 'Exo 2', 'Crimson Text' ]);

// Phase 3: Enhanced UI state
const activeColorPicker = ref(null) // 'deck' or 'text' when color picker is active
const canUndo = ref(false)
const canRedo = ref(false)
const downloadInProgress = ref(false)
const showTemplateGallery = ref(false)
const showPreview = ref(false)

// Phase 3.2: Canvas elements for preview
const canvasElements = ref([])

// UX Enhancement states
const loadingState = ref({
  isVisible: false,
  message: '',
  showProgress: false,
  progress: 0
})

const toastState = ref({
  isVisible: false,
  type: 'success',
  title: '',
  message: ''
})

const showEmptyState = ref(true)
const contextualHints = ref(null)

const customHints = ref({
  colorChanged: {
    text: "¡Excelente! Ahora puedes añadir texto o imágenes a tu diseño.",
    position: "bottom",
    duration: 4000
  },
  emojiAdded: {
    text: "Puedes arrastrar el emoji para moverlo o redimensionarlo desde las esquinas.",
    position: "center",
    duration: 5000
  },
  firstText: {
    text: "Haz doble clic en el texto para editarlo directamente.",
    position: "center", 
    duration: 4000
  }
})

const emojiCategories = {
  'Smileys & People': {
    icon: '😊',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕']
  },
  'Animals & Nature': {
    icon: '🐶',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙊', '🙉', '🙈', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪳', '🦟', '🦗', '🕷️', '🪰', '🪱', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦']
  },
  'Food & Drink': {
    icon: '🍎',
    emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥯', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯']
  },
  'Activities': {
    icon: '⚽',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️']
  },
  'Travel & Places': {
    icon: '✈️',
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚁', '🛸', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛰️', '🚁', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🛻', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛺', '🚁', '🛸', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛰️', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏']
  },
  'Objects': {
    icon: '💻',
    emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🪆', '🖼️', '🪞', '🪟', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🪄', '🪅', '🎊', '🎉', '🪩', '🎎', '🏮', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '🪧', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓']
  },
  'Symbols': {
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🛗', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '🟰', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }
}

const activeEmojiCategory = ref('Smileys & People');

// Phase 4: Advanced Features & Polish state
const showShareModal = ref(false)
const currentDesignForSharing = ref(null)
const hasSelectedText = ref(false)
const selectedTextObject = ref(null)
const designManager = ref(null)
const enhancedLayerManager = ref(null)
const textFormatting = ref(null)

// Typography state
const selectedFont = ref('Arial, sans-serif')
const fontSize = ref(18)
const fontWeight = ref('400')
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const textAlign = ref('left')

// Enhanced layers list with additional properties
const enhancedLayersList = computed(() => {
  return layersList.value.map(layer => ({
    ...layer,
    name: layer.name || getDefaultLayerName(layer.type),
    locked: false,
    zIndex: 0
  }))
})

fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    return {
      left: object.left, // + this._offset.left,
      top: object.top // + this._offset.top
    };
}

const btnWidth = 85, btnHeight = 18;

const undoButton = ref(null)
const redoButton = ref(null)
const undoDisabled = ref(false)
const redoDisabled = ref(false)

const colorpickerVisibleClassObject = computed(() => ({
    'rounded__btn-active': colorpickerVisible.value === 'visible'
}))

const textcolorpickerVisibleClassObject = computed(() => ({
    'rounded__btn-active': textcolorpickerVisible.value === 'visible'
}))

const emojipickerVisibleClassObject = computed(() => ({
    'rounded__btn-active': emojiVisible.value === true
}))

const downloadVisibleClassObject = computed(() => ({
    'rounded__btn-active': generatingPrints.value === true
}))

const colorpickerVisibleIconComputed = computed(() => 
    colorpickerVisible.value === 'visible' ? 'close' : 'palette'
)

const textcolorpickerVisibleIconComputed = computed(() => 
    textcolorpickerVisible.value === 'visible' ? 'close' : 'format_color_text'
)

const emojipickerVisibleIconComputed = computed(() =>
    emojiVisible.value === true ? 'close' : 'add_reaction'
)

const downloadVisibleIconComputed = computed(() => 
    generatingPrints.value === true ? 'hourglass_empty' : 'download'
)

var _config = {
    canvasState             : [],
    currentStateIndex       : -1,
    undoStatus              : false,
    redoStatus              : false,
    undoFinishedStatus      : 1,
    redoFinishedStatus      : 1,
    undoButton              : document.getElementById('undo'),
    redoButton              : document.getElementById('redo'),
};

var updateCanvasState = function() {
    if((_config.undoStatus == false && _config.redoStatus == false)){
        var jsonData        = canvas.toJSON();
        var canvasAsJson        = JSON.stringify(jsonData);
        if(_config.currentStateIndex < _config.canvasState.length-1){
            var indexToBeInserted                  = _config.currentStateIndex+1;
            _config.canvasState[indexToBeInserted] = canvasAsJson;
            var numberOfElementsToRetain           = indexToBeInserted+1;
            _config.canvasState                    = _config.canvasState.splice(0,numberOfElementsToRetain);
        }else{
            _config.canvasState.push(canvasAsJson);
        }
        _config.currentStateIndex = _config.canvasState.length-1;
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
            redoButton.value.disabled= "disabled";
        }
    }
}

var undo = function() {
    if(_config.undoFinishedStatus){
        if(_config.currentStateIndex == -1){
            _config.undoStatus = false;
        }else{
            if (_config.canvasState.length >= 1) {
                _config.undoFinishedStatus = 0;
                if(_config.currentStateIndex != 0){
                    _config.undoStatus = true;
                    canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex-1],function(){
                        var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex-1]);
                    canvas.renderAll();
                    _config.undoStatus = false;
                    _config.currentStateIndex -= 1;
                            undoDisabled.value = false
                            if(_config.currentStateIndex !== _config.canvasState.length-1){
                                undoDisabled.value = false
                            }
                        _config.undoFinishedStatus = 1;
            });
            }
            else if(_config.currentStateIndex == 0){
            canvas.clear();
                    _config.undoFinishedStatus = 1;
                    undoButton.value.disabled= "disabled";
                    redoDisabled.value = false
            _config.currentStateIndex -= 1;
            }
        }
        }
    }
}

var redo = function() {
    if(_config.redoFinishedStatus){
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
            redoButton.value.disabled= "disabled";
        }else{
        if (_config.canvasState.length > _config.currentStateIndex && _config.canvasState.length != 0){
                _config.redoFinishedStatus = 0;
            _config.redoStatus = true;
            canvas.loadFromJSON(_config.canvasState[_config.currentStateIndex+1],function(){
                        var jsonData = JSON.parse(_config.canvasState[_config.currentStateIndex+1]);
                    canvas.renderAll();
                    _config.redoStatus = false;
                _config.currentStateIndex += 1;
                        if(_config.currentStateIndex != -1){
                            redoDisabled.value = false
                        }
                    _config.redoFinishedStatus = 1;
        if((_config.currentStateIndex == _config.canvasState.length-1) && _config.currentStateIndex != -1){
            redoButton.value.disabled= "disabled";
        }
            });
        }
        }
    }
}

function positionBtn(obj) {
    var absCoords = canvas.getAbsoluteCoords(obj);

    popoverLeft.value = (absCoords.left - btnWidth / 2) + 65 + 'px';
    popoverTop.value = (absCoords.top - btnHeight / 2) + 100 + 'px';
}

function toggleLayersList() {
    layersListVisible.value = !layersListVisible.value
    updateLayerList()
}

function updateLayerList() { // TO DO: Refactor to use a filter function
    layersList.value = []
    const filteredLayers = []
    canvas.getObjects().forEach(function(o){
        if(o.id !== "background"
            && o.id !== "deckcolor"
            && o.id !== "bin") {
            filteredLayers.push({ id: o.id, type: o.type, opacity: o.opacity })
        }
    })
    layersList.value = filteredLayers
}

const { $bus } = useNuxtApp();

// $bus.$on('generatePrint', () =>{
//     generatePrints()
// })

$bus.$on('selectObjectFromList', (id) =>{
    selectObjectFromList(id)
})

$bus.$on('toggleHideObjectFromList', (opt) =>{
    toggleHideObjectFromList(opt.selectedId, opt.action)
})

$bus.$on('removeObject', (id) => {
    removeObject(id)
})

$bus.$on('fontfamilyChange', (font) =>{
    fontfamilyChange(font)
})

async function uploadFile(event) {
    const input = event.target;
    if(input.files && input.files[0]) {
        // Show loading state
        showLoading('Subiendo imagen...', true)
        updateProgress(10)
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            updateProgress(50)
            img.value = e.target.result;
            
            //const photoUrl = URL.createObjectURL(input.files[0]);

            const tempImg = new Image();
            const imageDimensions = await new Promise((resolve) => {
                tempImg.onload = () => {
                    updateProgress(80)
                    const dimensions = {
                        height: tempImg.height,
                        width: tempImg.width
                    };
                    resolve(dimensions);
                }
                tempImg.src = img.value;
            })
            
            addImage(img.value, undefined, undefined, imageDimensions.width, imageDimensions.height)
            updateProgress(100)
            
            // Hide loading and show success toast
            setTimeout(() => {
                hideLoading()
                showToast('success', 'La imagen se ha añadido correctamente a tu diseño', '¡Imagen subida!')
                
                // Show contextual hint
                setTimeout(() => {
                    contextualHints.value?.showHint('imageUploaded')
                }, 500)
            }, 200)
        }
        reader.readAsDataURL(input.files[0]);
    }
    let data = new FormData();
    data.append('file', input.files[0]);
    data.append('uuid', uuid.value)

    const config = {
        method: 'POST',
        // headers: {
        //     'content-type': 'multipart/form-data'
        // },
        body: data
    }
    fetch('http://localhost/api/uploads', config, data)
        .then(function () {
            console.log('aaaarrr', data);
        })
        .catch(function () {
            console.log('errrroor');
        });
}

function canvasEv() {
    if(!canvas) return
    
    if(canvas.getActiveObject()) {
        if(canvas.getActiveObject().get('type') === 'i-text'){
            positionBtn(canvas.getActiveObject())
            popoverVisible.value = 'visible'
            popoverOpacity.value = 1
            popoverZindex.value = 10
            popoverTransform.value = 'translate(0, -20px)'
            popoverTransition.value = 'all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97)'

            
            optionsTopVisible.value = 'hidden'
            objectMoveVisible.value = 'hidden'
            optionsTopOpacity.value = 0
            optionsTopZindex.value = -1
        }else if(canvas.getActiveObject().get('type') === 'image') {
            objectMoveVisible.value = 'visible'
            optionsTopVisible.value = 'hidden'
        } 
    } else {
        popoverVisible.value = 'hidden'
        objectMoveVisible.value = 'hidden'
        optionsTopVisible.value = 'visible'
        optionsTopOpacity.value = 1
        optionsTopZindex.value = 10
    }
    
    // if(canvas.getActiveObject()) {
    //     $bus.$emit('activeObj',canvas.getActiveObject().get('id'));
    // }else{
    //     $bus.$emit('activeObj', 'none');
    // }
}

function moreZoomButton() {
    canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), canvas.getZoom()+0.010);
    canvas.renderAll()
}

function lessZoomButton() {
    if(canvas.getZoom() > 0.055){
        canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), canvas.getZoom()-0.010);
        canvas.renderAll()
    }
}

function changeZoom(value) {
    if(value !== undefined) {
        canvas.setZoom(value)
        canvas.renderAll();
    }
}

function addText() {
    const txt = new fabric.IText('Tu texto', {id: 'txt' + Math.random().toString(16).slice(2), type: 'i-text', left: backgroundPositionLeft.value+600, top: 4500, fontSize: 600, fontFamily: 'Arial', fontWeight: 'normal', fill: '#ff3c22', opacity: 1 });
    // txt.moveTo(2);
    //txt.rotate(-90);
    canvas.add(txt);
    canvas.moveTo(txt, 4)
    canvas.renderAll();
    // canvas.sendBackwards(txt);
    updateLayerList()
    
    // UX Enhancement: Update empty state and show contextual hint
    updateEmptyStateVisibility()
    showToast('success', 'Haz clic en el texto para editarlo o arrástralo para moverlo', '¡Texto añadido!')
    
    setTimeout(() => {
        contextualHints.value?.showHint('textAdded')
    }, 500)
}

function addImage(image, top, left, width, height, scale) {
    if(top === undefined) top = 3000
    if(left === undefined) left = backgroundPositionLeft.value+660
    if(width === undefined) width = 1700
    if(height === undefined) height = 1400
    if(scale === undefined) scale = 1

    const imu = new fabric.Image.fromURL(image, function(img) {
        
        img.setControlVisible('ml', false)
        img.setControlVisible('mb', false)
        img.setControlVisible('mr', false)
        img.setControlVisible('mt', false)
        img.scale(2)
        canvas.add(img);
        canvas.moveTo(img, 3)
        //canvas.bringForward(img, true)
        // canvas.sendToBack(img)
        
        //canvas.sendBackwards(img); GOOD ONE!!!!
        positionBtn(img);
        updateLayerList()
    }, {
        id: 'img' + Math.random().toString(16).slice(2),
        type: 'image',
        top: top,
        left: left,
        width: width,  
        height: height,
        // multiplier: 2,
        opacity: 1
    })
    // canvas.moveTo(imu, 3)
}

function removeObject(id) {
    canvas.getObjects().forEach(function(o){
        if(o.id == id){
            canvas.remove(o)
            updateLayerList()
            toggleLayersList()
        }
    })
}

function createBin() {
    new fabric.Image.fromURL('../img/delete_forever.png', function(img) {
        img.moveTo(6)
        img.scaleToHeight(backgroundScale.value, false)
        bin.value = img;
        canvas.add(img);
    }, {
        id: 'bin',
        excludeFromExport: true,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: true,
        hoverCursor: 'default',
        top: 8050,
        left: backgroundPositionLeft.value+2800,
        width: 4117,
        height: 8060,
        visible: false,
        scaleX: 1,
        scaleY: 1,
    })    
}

function showBin() {
    canvas.getObjects().forEach(function(o){
        if(o.id == 'bin'){
            o.visible = true
        }
    })
}

function hideBin() {
    canvas.getObjects().forEach(function(o){
        if(o.id == 'bin'){
            o.visible = false
        }
    })
}

function confirmPostion() {
    canvas.discardActiveObject().renderAll();
}

function selectObjectFromList(id) {
    let selectedObject = canvas._objects.filter(
        obj => obj.id === id
    );
    return selectedObject[0]
}

function toggleHideObjectFromList(id, action) {
    let selectedObject = canvas._objects.filter(
        obj => obj.id === id
    );

    if(action == 'hide') {
        selectedObject[0].opacity = 0
    } else {
        selectedObject[0].opacity = 1
    }
    updateLayerList()
    canvas.renderAll();
}

function fontfamilyChange(font) {
    canvas.getActiveObject().fontFamily = font;
    canvas.renderAll();
}

function onSelectEmoji(emoji) {
    const smiley = new fabric.IText(emoji.i, {id: 'smiley' + Math.random().toString(16).slice(2), left: backgroundPositionLeft.value+600, top: 4500, fontSize: 600, opacity: 1, type: 'smiley' });
    smiley.setControlVisible('ml', false)
    smiley.setControlVisible('mb', false)
    smiley.setControlVisible('mr', false)
    smiley.setControlVisible('mt', false)
    canvas.add(smiley);
    canvas.moveTo(smiley, 4)
    canvas.renderAll();
    updateLayerList()
    hideEmojis()
    
    // UX Enhancement: Update empty state and show contextual hint
    updateEmptyStateVisibility()
    showToast('success', 'Puedes arrastrarlo para moverlo o redimensionarlo desde las esquinas', '¡Emoji añadido!')
    
    setTimeout(() => {
        contextualHints.value?.showHint('emojiAdded')
    }, 500)
}

function onDeckColorChange(event) {
    const newColor = event.target.value
    colors.value.hex = newColor
    bgDeckColor.value = newColor
    canvas.getObjects().forEach(function(o){
        if(o.id == 'deckcolor'){
            o.set('fill', newColor)
        }
    })
    canvas.renderAll();
    
    // UX Enhancement: Show contextual hint about what to do next
    setTimeout(() => {
        contextualHints.value?.showHint('colorChanged')
    }, 300)
}

function onTextColorChange(event) {
    const newColor = event.target.value
    textColor.value.hex = newColor
    canvas.getObjects().forEach(function(o){
        if(o.id == selectedObject.value){
            o.set('fill', newColor)
        }
    })
    activeTextColor.value = newColor
    canvas.renderAll();
}

function setDeckColor() {
    canvas.getObjects().forEach(function(o){
        if(o.id == 'deckcolor'){
            o.set('fill', colors.value.hex)
        }
    })
    canvas.renderAll();
}

function toggleShowColorpicker() {
    colorpickerVisible.value == 'visible' ? colorpickerVisible.value = 'hidden' : colorpickerVisible.value = 'visible'
}

function setTextColor() {
    canvas.getObjects().forEach(function(o){
        if(o.id == selectedObject.value){
            o.set('fill', textColor.value.hex)
        }
    })
    activeTextColor.value = textColor.value.hex
    canvas.renderAll();
}

function toggleShowTextColorpicker() {
    canvas.getObjects().forEach(function(o){
        if(o.id == selectedObject.value){
            textColor.value = { hex: o.fill }
        }
    });
    textcolorpickerVisible.value == 'visible' ? textcolorpickerVisible.value = 'hidden' : textcolorpickerVisible.value = 'visible'
}

function fontBackgroundColorChange(event) {
    canvas.getActiveObject().set('textBackgroundColor', event.target.value);
    canvas.renderAll();
}
function fontWeightChange(event) {
    event.target.checked ?
        canvas.getActiveObject().fontWeight = event.target.value :
        canvas.getActiveObject().fontWeight = 'normal'
    canvas.renderAll();
}
function fontStyleChange(event) {
    event.target.checked ?
        canvas.getActiveObject().fontStyle = event.target.value :
        canvas.getActiveObject().fontStyle = 'normal'
    canvas.renderAll();
}

function fontUnderlineChange(event) {
    event.target.checked ?
        canvas.getActiveObject().set('underline', true) :
        canvas.getActiveObject().set('underline', false)
    canvas.renderAll();
}

function clearText(e) {
  if (e.target.type === "i-text") {
    if (e.target.text === "Tu texto") {
      e.target.text = "";
      e.target.hiddenTextarea.value = '';
    };
    canvas.renderAll();
  }
}

function unclearText(e) {
    if (e.target.text === "") {
        e.target.text = "Tu texto"
    }
    canvas.renderAll()
}

function toggleEmoji() {
    emojiVisible.value = !emojiVisible.value
}

function hideEmojis() {
    emojiVisible.value = false
}

function showTextOptions() {
    popoverVisible.value = 'visible'
    popoverOpacity.value = 1
    popoverZindex.value = 10
    popoverTransform.value = 'translate(0, -20px)'
    popoverTransition.value = 'all 0.5s cubic-bezier(0.75, -0.02, 0.2, 0.97)'
    
    
    objectMoveVisible.value = 'hidden'
    optionsTopVisible.value = 'hidden'
    optionsTopOpacity.value = 0
    optionsTopZindex.value = -1

    if(window.innerHeight > 570) {
        textEditFontTop.value = Math.floor((450 + calculateBackgroundDeckTopOffset()/7))+'px'
    }
}

function showGeneralOptions() {
    popoverVisible.value = 'hidden'
    objectMoveVisible.value = 'hidden'
    optionsTopVisible.value = 'visible'
    optionsTopOpacity.value = 1
    optionsTopZindex.value = 10
}

async function startDownload(){
    // Show loading state
    showLoading('Preparando tu diseño para descarga...', true)
    updateProgress(20)
    
    generatePrints.value = true
    // const svgContent = canvas.toSVG({
    //         width: 25000,
    //         height: 25000,
    //         viewBox: {
    //             x: 0,
    //             y: 0,
    //             width: 25000,
    //             height: 25000
    //         }
    //     }),
    //     blob = new Blob([svgContent], {
    //       type: "image/svg+xml",
    //       width: 25000,
    //       height: 25000
    //     })
    //     console.log('blob', blob)
    //     // window.location.hfref = blob;
    
    //     let url = window.URL.createObjectURL(blob);    
    // const a = window.document.createElement("a");
    // //if(typeof(a.download) === "string") {
    // a.setAttribute('href', url)    
    // a.setAttribute('download', url)
    // //a.download = "print.svg";
    // //a.href = url

    // // }else {
    // //     navigator.msSaveBlob(blob, 'test.svg')
    // // }
      
    // a.target = "_blank";
    // document.body.appendChild(a);
    // setTimeout(() => {
    //     a.click();
    // }, 1000);
    // document.body.removeChild(a);
    
                
    // toggleSvgAlert()

    updateProgress(50)
    const canvasJSON = canvas.toJSON()
    
    try {
        updateProgress(70)
        // fetch('https://api.skateboardpersonalizado.com/api/designs/', {
        const response = await fetch('http://localhost:8000/api/designs/', {
            method: 'POST',
            contentType: 'multipart/form-data',
            headers: {
                'Authorization': 'Bearer 2|9xwCEKAAvnCUON1fazP027OGZv2R0jqA0pF3FLai91bab14c',
                'Content-Type': 'application/json',
                //'X-CSRF-TOKEN': `document.querySelector("meta[property='csrf-token']").getAttribute("content"),`
            },
            body: JSON.stringify({
                "name": "vue",
                "json": JSON.stringify(canvasJSON),
                // "svg": canvas.toSVG(),
                "user_id": 1,
                // "source": 'web',
                "uuid": uuid.value,
                // "img_generated": canvas.toDataURL('jpeg')//jpeg
            })
        })
        
        updateProgress(100)
        
        if (response.ok) {
            // Hide loading and show success
            setTimeout(() => {
                hideLoading()
                showToast('success', 'Tu diseño ha sido enviado correctamente. ¡Continúa al proceso de envío!', '¡Diseño guardado!')
                
                setTimeout(() => {
                    contextualHints.value?.showHint('readyToDownload')
                }, 500)
            }, 300)
        } else {
            throw new Error('Error al enviar el diseño')
        }
        
    } catch (error) {
        hideLoading()
        showToast('error', 'Ha ocurrido un error al procesar tu diseño. Por favor, inténtalo de nuevo.', 'Error al descargar')
    }
    
    generatePrints.value = false
    // await navigateTo('/shipping'); // Commented out since no shipping page needed
}

function toggleSvgAlert() {
    document.getElementById('download-modal').classList.toggle('hidden')
    
    // if(document.getElementById('download-modal').style.visibility == 'hidden')
    //     document.getElementById('download-modal').style.visibility = 'visible'
    // else
    //     document.getElementById('download-modal').style.visibility = 'hidden'
}

function generatePrints(){
    generatingPrints.value = true
    const canvasHeight = (deckBackgroundHeight.value + calculateBackgroundDeckTopOffset())
    canvas.discardActiveObject().renderAll()
    hideBin()
    
    const newCanvas = document.createElement('canvas');
    newCanvas.width = deckBackgroundWidth.value;
    newCanvas.height = deckBackgroundHeight.value;
    const newCanvasCtx = newCanvas.getContext('2d');
    
    const lastZoom = canvas.getZoom()
    canvas.setZoom(1)
    canvas.width = 10000// deckBackgroundWidth.value // CHANGE THIS TO THE SIMULATED CANVAS SIZE TO GET THE FUlL IMAGE SIZE
    canvas.height = canvasHeight
    
        
    const canvasBase = canvas.toDataURL('image/jpeg')
        
    canvas.setZoom(lastZoom)
    resize()
    const imgCanvasBase = document.createElement("img");
    imgCanvasBase.width = '10000px' // deckBackgroundWidth.value
    imgCanvasBase.height = canvasHeight
    imgCanvasBase.src = canvasBase;
    imgCanvasBase.onload = function() {
        imgCanvasBase.decode()
        .then(() => {
            document.body.appendChild(imgCanvasBase)
            newCanvasCtx.drawImage(imgCanvasBase, backgroundPositionLeft.value+345, calculateBackgroundDeckTopOffset(), deckBackgroundWidth.value, deckBackgroundHeight.value, 0, 0, deckBackgroundWidth.value, deckBackgroundHeight.value);
            setTimeout(() => {
                const a = document.createElement("a");
                const newCanvasJPG = newCanvas.toDataURL('image/jpeg')
                
                //const canvasJSON = canvas.JSON()
                // console.log('canvasJSON', canvasJSON);
                // fetch('http://localhost/api/designs/', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     // 'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     body: JSON.stringify({
                //         "json": canvasJSON,
                //         "svg": canvas.toSVG(),
                //         "source": 'web',
                //         "img_generated": newCanvasJPG
                //     })
                // })
                setTimeout(() => {
                    a.href = newCanvasJPG
                    a.download = "Print.jpg";
                    a.click();
                    generatingPrints.value = false
                }, 100);
                document.body.removeChild(imgCanvasBase)
            }, 100);
        })
        .catch((encodingError) => {
            console.log('encodingError', encodingError);
            generatingPrints.value = false
        })
    }

    //.then(
    // var respon = response.text()
    //     console.log(respon);
    // )

    


}

function calculateBackgroundDeckTopOffset() {
    let topBackground = 0;
    if(window.innerHeight > 570) {
        topBackground = ((window.innerHeight - 570) /2) *15
    }
    return topBackground
}

function makeId(tokenLen) {
    if (tokenLen == null) {
        tokenLen = 16;
    }
    var text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < tokenLen; ++i)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    uuid.value = text;
}

function setBackground() {
    console.log('setBackground',canvas.getObjects().length);
    canvas.getObjects().forEach(function(o){
        console.log('--------', o.id);
        if(o.id === "background") {
            console.log('baaaackkk');
            return false
        }
    })
    
    //const imge = new fabric.Image.fromURL('./img/maka-deck-template-svg.png', function(img) {
    const imge = new fabric.Image.fromURL('../img/mockup/2023-instaboard-MOCKUP.png', function(img) {
        //img.scale(1)
        canvas.bringToFront(img);
        img.moveTo(6)
        //img.scaleToHeight(backgroundScale.value, false)
        canvas.add(img);
    }, {
        id: 'background',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        top: calculateBackgroundDeckTopOffset(),
        left: backgroundPositionLeft.value+345,
        //left: canvas.getWidth()/2,
        width: deckBackgroundWidth.value,
        height: deckBackgroundHeight.value,
    })
}

function setDeckBackground() {
    // Use consistent positioning that matches the mask exactly
    const topOffset = calculateBackgroundDeckTopOffset() + 120
    const leftOffset = backgroundPositionLeft.value + 470
    const deckWidth = deckBackgroundWidth.value - 190
    const deckHeight = deckBackgroundHeight.value - 250
    
    const rect = new fabric.Rect({ 
        top: topOffset,
        left: leftOffset,
        width: deckWidth,
        height: deckHeight,
        fill: bgDeckColor.value,
        id: 'deckcolor',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
    })
    canvas.add(rect)
    canvas.moveTo(rect,2);
}

function setCanvasMask() {
    // Create a clipPath that follows the skateboard silhouette shape
    // Use consistent positioning variables to ensure perfect alignment
    const topOffset = calculateBackgroundDeckTopOffset() + 120
    const leftOffset = backgroundPositionLeft.value + 470
    const deckWidth = deckBackgroundWidth.value - 190
    const deckHeight = deckBackgroundHeight.value - 250
    
    // Create skateboard deck shape with rounded ends
    const radius = deckWidth / 2
    
    // Create a path that represents a skateboard deck shape (rounded rectangle with circular ends)
    const pathData = `
        M ${leftOffset + radius} ${topOffset}
        L ${leftOffset + deckWidth - radius} ${topOffset}
        A ${radius} ${radius} 0 0 1 ${leftOffset + deckWidth} ${topOffset + radius}
        L ${leftOffset + deckWidth} ${topOffset + deckHeight - radius}
        A ${radius} ${radius} 0 0 1 ${leftOffset + deckWidth - radius} ${topOffset + deckHeight}
        L ${leftOffset + radius} ${topOffset + deckHeight}
        A ${radius} ${radius} 0 0 1 ${leftOffset} ${topOffset + deckHeight - radius}
        L ${leftOffset} ${topOffset + radius}
        A ${radius} ${radius} 0 0 1 ${leftOffset + radius} ${topOffset}
        Z
    `
    
    const clipPath = new fabric.Path(pathData.replace(/\s+/g, ' ').trim(), {
        absolutePositioned: true,
        fill: 'transparent'
    })
    
    // Apply the clipPath to the canvas
    canvas.clipPath = clipPath
    canvas.renderAll()
}

function updateCanvasMask() {
    // Update the existing clipPath dimensions when canvas is resized
    if (canvas.clipPath) {
        const left = backgroundPositionLeft.value + 470  // Match setCanvasMask
        const top = calculateBackgroundDeckTopOffset() + 120  // Match setCanvasMask
        const width = deckBackgroundWidth.value - 190  // Match setCanvasMask
        const height = deckBackgroundHeight.value - 250  // Match setCanvasMask
        
        // Create skateboard deck shape with rounded ends
        const radius = width / 2
        
        // Create a path that represents a skateboard deck shape (rounded rectangle with circular ends)
        const pathData = `
            M ${left + radius} ${top}
            L ${left + width - radius} ${top}
            A ${radius} ${radius} 0 0 1 ${left + width} ${top + radius}
            L ${left + width} ${top + height - radius}
            A ${radius} ${radius} 0 0 1 ${left + width - radius} ${top + height}
            L ${left + radius} ${top + height}
            A ${radius} ${radius} 0 0 1 ${left} ${top + height - radius}
            L ${left} ${top + radius}
            A ${radius} ${radius} 0 0 1 ${left + radius} ${top}
            Z
        `
        
        const newClipPath = new fabric.Path(pathData.replace(/\s+/g, ' ').trim(), {
            absolutePositioned: true,
            fill: 'transparent'
        })
        
        canvas.clipPath = newClipPath
        canvas.renderAll()
    }
}


function isMobileDeviceCheck() {
    const mobileOsRegExp = "(Android|webOS|iPhone|iPod)";
    if(screen.width < 500 || navigator.userAgent.match('/'+mobileOsRegExp+'/i')) {
        isMobileDevice.value = true;
    }
    if (isMobileDevice.value) {
        if (typeof window.orientation === "undefined") {
            isMobileDevice.value = false; 
        }
    }
    if (typeof navigator.userAgentData != "undefined" && !navigator.userAgentData.mobile) {
        isMobileDevice.value = false; 
    }
    if ( typeof window.orientation !== "undefined" && isMobileDevice.value ) {
        if (window.navigator.maxTouchPoints > 1 && ( localStorage.mobile || 'ontouchstart' in document)) {
            // mobile device found
            isMobileDevice.value = true; 
        }
    }
}

function resize() {
    if (!canvasWrapper.value || !canvas) return
    
    // Handle mobile devices with specialized logic
    if (isMobile.value || isMobileDevice.value === true) {
        adjustCanvasForMobile()
        return
    }
    
    const ratio = window.innerWidth / window.innerHeight;
    const containerWidth = canvasWrapper.value.clientWidth;
    const scale          = containerWidth / canvas.getWidth();
    const zoom           = canvas.getZoom() * scale;
    
    const widths = [window.innerWidth];
    let windowWidth = null;
    if(isMobileDevice.value === true){
        if (window.screen?.width) {
            widths.push(window.screen?.width);
        }
        windowWidth = Math.min(...widths) /2*15;
    } else {
        windowWidth = window.innerWidth/2*15
    }
    
    canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
    
    if(window.innerHeight <= 900 && window.innerHeight > 650){
        canvas.setZoom(0.055)
    }else if(window.innerHeight < 650){
        canvas.setZoom(0.052)
    }else{
        backgroundPositionLeft.value = windowWidth - 1417/2
    }
    // }else if(window.innerHeight > 650 &&  window.innerHeight <= 699) {
    //     canvas.setZoom(0.06)
    // }else if(window.innerHeight > 600 &&  window.innerHeight <= 649) {
    //     canvas.setZoom(0.055)
    // }else if(window.innerHeight > 550 &&  window.innerHeight <= 599) {
    //     canvas.setZoom(0.05)
    // }else if(window.innerHeight > 500 &&  window.innerHeight <= 549) {
    //     canvas.setZoom(0.045)
    // }else if(window.innerHeight > 450 &&  window.innerHeight <= 499) {
    //     canvas.setZoom(0.04)
    // }else if(window.innerHeight > 400 &&  window.innerHeight <= 449) {
    //     canvas.setZoom(0.035)
    // }else if(window.innerHeight > 350 &&  window.innerHeight <= 399) {
    //     canvas.setZoom(0.03)
    // }else if(window.innerHeight > 300 &&  window.innerHeight <= 349) {
    //     canvas.setZoom(0.025)
    // }
    const obj = canvas.getObjects();


    //backgroundPositionLeft.value = windowWidth - deckBackgroundWidth.value/2  //window.innerWidth/2 - deckBackgroundWidth.value/2
    backgroundPositionLeft.value = windowWidth - 1417/2

    // Update the canvas mask after repositioning
    updateCanvasMask()
}
onMounted(() => {
    // Initialize mobile detection first
    detectMobile()
    window.addEventListener('resize', detectMobile)
    
    canvas = new fabric.Canvas(canvasEl.value, {
        width: 500, height:630
    });
    
    // Set appropriate zoom level based on device
    if (isMobile.value) {
        canvas.setZoom(0.4); // Much larger zoom for mobile
    } else {
        canvas.setZoom(0.06); // Original zoom for desktop
    }
    
    canvas.renderAll()
    isMobileDeviceCheck()
    resize()
    setBackground()
    setDeckBackground()
    setCanvasMask()
    createBin()
    makeId()
    
    // Final mobile adjustment after all elements are in place
    if (isMobile.value || isMobileDevice.value === true) {
        setTimeout(() => {
            adjustCanvasForMobile()
        }, 100)
    }
    
    // Initialize mobile features after canvas is ready
    // setTimeout(() => {
        if (isMobile.value) {
            adjustCanvasForMobile()
            initializeMobileFeatures()
        }
    // }, 100)
    
    var line9 = new fabric.Line([
        backgroundPositionLeft.value+1700 , deckBackgroundHeight.value,
        backgroundPositionLeft.value+1700 , 10 //backgroundPositionLeft.value
    ], {
        strokeDashArray: [50, 50],
        stroke: 'red',
    })

    line9.selectable = false;
    line9.evented = false;

    canvas.on('selection:created', function(event) {
        console.log('selection:created => event', event);
        
        // Update selected text object for TextFormatting component
        selectedTextObject.value = getSelectedTextObject()
        hasSelectedText.value = selectedTextObject.value !== null
        
        if(event.selected[0].type === 'i-text'){
            activeTextColor.value = event.selected[0].fill
            colorpickerVisible.value = 'hidden'
            objectMoveVisible.value = 'hidden'
            positionBtn(event.selected[0])
            showTextOptions()
        }else if(event.selected[0].type === 'image') {
            objectMoveVisible.value = 'visible'
            optionsTopVisible.value = 'hidden'
        }else{
            showGeneralOptions()
            colorpickerVisible.value = 'hidden'
        }
        
        textcolorpickerVisible.value = 'hidden'

        selectedObject.value = canvas.getActiveObject().get('id')
    })
    
    canvas.on('selection:updated', function(event) {
        console.log('selection:updated => event', event);
        if(event.selected[0].type === 'i-text'){
            activeTextColor.value = event.selected[0].fill
            colorpickerVisible.value = 'hidden'
            objectMoveVisible.value = 'hidden'
            positionBtn(event.selected[0])
            showTextOptions()
        }else if(event.selected[0].type === 'image') {    
            objectMoveVisible.value = 'visible'
            optionsTopVisible.value = 'hidden'
            popoverVisible.value = 'hidden'
        }else{
            showGeneralOptions()
            colorpickerVisible.value = 'hidden'
        }
        textcolorpickerVisible.value = 'hidden'

        selectedObject.value = canvas.getActiveObject().get('id')
    })

    canvas.on('selection:cleared', function() {
        console.log('aaa', lastSelectedObject.value);
        
        // Clear selected text object
        selectedTextObject.value = null
        hasSelectedText.value = false
        
        if(lastSelectedObject.value){
            console.log('bbbb', lastSelectedObject.value);
            lastSelectedObject.value.opacity = 1
        }
        console.log('cccc', lastSelectedObject.value);
        textcolorpickerVisible.value = 'hidden'
        hideBin()
    })
    

    canvas.on('touch:gesture', function(event) {
        if(lastSelectedObject.value && event.target !== lastSelectedObject.value) {
            lastSelectedObject.value.opacity = 0.75
        }
    })
    canvas.on('mouse:down', function(event) {
        if(lastSelectedObject.value && event.target !== lastSelectedObject.value) {
            lastSelectedObject.value.opacity = 0.75
        }
        lastSelectedObject.value.opacity = 1
        if(event.target == null || event.target.id === "background") {
            showGeneralOptions()
        }
    })
    // canvas.on("mouse:wheel", function(opt) {
    //     opt.e.preventDefault()
    //     opt.e.stopPropagation()
    //     if (opt.e.ctrlKey) {
    //         console.log("pinch")
    //         var delta = opt.e.deltaY;
    //         var zoom = canvas.getZoom();
    //         zoom *= 0.999 ** delta;
    //         canvas.setZoom(zoom);
    //     } else {
    //         var e = opt.e;
    //         console.log('00000000:::: ', e);
    //         var vpt = this.viewportTransform;
    //         // if(e.deltaX > 0 && e.deltaY > 0){ 
    //             vpt[4] += e.deltaX;
    //             vpt[5] += e.deltaY;
    //             this.requestRenderAll();
    //         // }
    //     }
    // })

    canvas.on('object:added', function(event) {
        updateCanvasState();
        lastSelectedObject.value = event.target
    })

    canvas.on('object:modified', function(event) {
        updateCanvasState();
        lastSelectedObject.value = event.target
    })
    canvas.on('object:scaling', function(event) {
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object
    })
    canvas.on('object:rotating', function(event) {
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object
    })

    canvas.on('object:moving', function(event) {
        showBin()
        // var snapZone = 150;
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object

        // var objectMiddleHorizontal = event.target.left + (event.target.width * event.target.scaleX) / 2;
        // if (objectMiddleHorizontal > backgroundPositionLeft.value+1700 - snapZone && objectMiddleHorizontal < backgroundPositionLeft.value+1700 + snapZone) {
        //     console.log('objectMiddleHorizontal', objectMiddleHorizontal);
        //     console.log('backgroundPositionLeft.value+1700', backgroundPositionLeft.value+1700);
        //     event.target.set({
        //         //left: backgroundPositionLeft.value / 2 - (event.target.width * event.target.scaleX) / 2,
        //         left: backgroundPositionLeft.value+1700 - (event.target.width * event.target.scaleX) / 2,
        //     })//.setCoords();

        //     canvas.add(line9);

        //     document.addEventListener("mouseup", () => {
        //         canvas.remove(line9);
        //     });

        // } else {
        //     canvas.remove(line9);
        // }

        var clickElementHorizontalCenter = event.target?.left + (event.target?.width/2)
        var clickElementVerticalCenter = event.target?.top + (event.target?.height/2)
        if(event.target?.type === 'i-text' || event.target?.type === 'image'){
            if (clickElementHorizontalCenter > backgroundPositionLeft.value+3000 && clickElementHorizontalCenter < (backgroundPositionLeft.value+3000 + 8000) && clickElementVerticalCenter > 8050 && clickElementVerticalCenter < (10050 + 80)) {
            //if (clickElementLeft > backgroundPositionLeft.value+3000 && clickElementLeft < (backgroundPositionLeft.value+3000 + 8000) && clickElementTop > 8050 && clickElementTop < (10050 + 80)) {
                canvas.getObjects().forEach(function(o){
                    if(o.id === "bin") {
                        o.scaleX = 12
                        o.scaleY = 12
                    }
                })
            } else {
                canvas.getObjects().forEach(function(o){
                    if(o.id === "bin") {
                        o.scaleX = 10
                        o.scaleY = 10
                    }
                })
            }
        }
    })

    canvas.on('selection:updated', function(event) {
        var object = event.target;
        canvas.sendToBack(object);
    });
        
    canvas.on('mouse:up', function(event) {
        hideEmojis()
        if(event.target != null) {
            if(event.target.id != lastSelectedObject.value.id) {
                textcolorpickerVisible.value = 'hidden'
            }
        }
        var clickElementHorizontalCenter = event.target?.left + (event.target?.width/2)
        var clickElementVerticalCenter = event.target?.top + (event.target?.height/2)
        if(!isNaN(clickElementHorizontalCenter) && !isNaN(clickElementVerticalCenter)) {
            if (clickElementHorizontalCenter > backgroundPositionLeft.value+3000 && clickElementHorizontalCenter < (backgroundPositionLeft.value+3000 + 8000) && clickElementVerticalCenter > 8050 && clickElementVerticalCenter < (10050 + 80)) {
                canvas.getObjects().forEach(function(o) {
                    if(o.id == selectedObject.value) {
                        // TO DO : Fix the bin effect 
                        console.log('delete:: selectedObject', selectedObject);
                        canvas.remove(o);
                        updateLayerList()
                        showGeneralOptions()
                    }
                })
            }
        }
    });

    canvas.on('text:editing:entered', function(event) {
        clearText(event)
    })

    canvas.on('text:editing:exited', function(event) {
        unclearText(event)  
    })

    // Add drag and drop functionality for images
    if (canvasWrapper.value) {
        // Prevent default drag behaviors
        canvasWrapper.value.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            canvasWrapper.value.style.border = '2px dashed #007bff'
        })

        canvasWrapper.value.addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
            canvasWrapper.value.style.border = 'none'
        })

        canvasWrapper.value.addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            canvasWrapper.value.style.border = 'none'
            
            const files = e.dataTransfer.files
            if (files && files.length > 0) {
                const file = files[0]
                
                // Check if the file is an image
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader()
                    reader.onload = async function(e) {
                        const imageData = e.target.result
                        
                        // Get image dimensions
                        const tempImg = new Image()
                        const imageDimensions = await new Promise((resolve) => {
                            tempImg.onload = () => {
                                const dimensions = {
                                    height: tempImg.height,
                                    width: tempImg.width
                                }
                                resolve(dimensions)
                            }
                            tempImg.src = imageData
                        })
                        
                        // Add the image to the canvas - it will automatically respect the clipPath mask
                        addImage(imageData, undefined, undefined, imageDimensions.width, imageDimensions.height)
                    }
                    reader.readAsDataURL(file)
                }
            }
        })
    }
    
    // UX Enhancement: Add canvas event listeners for better user experience
    canvas.on('object:added', function(event) {
        updateEmptyStateVisibility()
        updateLayerList()
    })
    
    canvas.on('object:removed', function(event) {
        updateEmptyStateVisibility()
        updateLayerList()
    })
    
    canvas.on('selection:created', function(event) {
        setTimeout(() => {
            contextualHints.value?.showHint('objectSelected')
        }, 500)
    })
    
    // Check initial empty state
    setTimeout(() => {
        updateEmptyStateVisibility()
    }, 1000)
})

// Phase 3: Enhanced UI Methods

// Handle new toolbar events
function handleDeckColorChange(color) {
    colors.value.hex = color
    bgDeckColor.value = color
    canvas.getObjects().forEach(function(o){
        if(o.id == 'deckcolor'){
            o.set('fill', color)
        }
    })
    canvas.renderAll()
}

function handleTextColorChange(color) {
    textColor.value.hex = color
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fill', color)
        canvas.renderAll()
    }
}

function handleFontChange(fontFamily) {
    selectedFont.value = fontFamily
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fontFamily', fontFamily)
        canvas.renderAll()
    }
}

function handleFontSizeChange(action) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        let newSize = fontSize.value
        if (action === 'increase') {
            newSize = Math.min(fontSize.value + 2, 200)
        } else if (action === 'decrease') {
            newSize = Math.max(fontSize.value - 2, 8)
        } else if (typeof action === 'number') {
            newSize = Math.max(8, Math.min(200, action))
        }
        
        fontSize.value = newSize
        activeObj.set('fontSize', newSize)
        canvas.renderAll()
    }
}

function handleFontWeightChange(weight) {
    fontWeight.value = weight
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fontWeight', weight)
        isBold.value = weight === 'bold' || parseInt(weight) >= 600
        canvas.renderAll()
    }
}

function handleTextStyleChange(style) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        if (style === 'bold') {
            isBold.value = !isBold.value
            activeObj.set('fontWeight', isBold.value ? 'bold' : 'normal')
        } else if (style === 'italic') {
            isItalic.value = !isItalic.value
            activeObj.set('fontStyle', isItalic.value ? 'italic' : 'normal')
        } else if (style === 'underline') {
            isUnderline.value = !isUnderline.value
            activeObj.set('underline', isUnderline.value)
        }
        canvas.renderAll()
    }
}

function handleTextAlignChange(align) {
    textAlign.value = align
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('textAlign', align)
        canvas.renderAll()
    }
}

// Handle toolbar actions from OrganizedToolbar
function handleToolbarAction(action) {
    switch (action) {
        case 'deck-color':
            // Open native color picker directly
            if (deckColorInput.value) {
                deckColorInput.value.click()
            }
            break
        case 'text-color':
            if (hasSelectedText.value) {
                activeColorPicker.value = activeColorPicker.value === 'text' ? null : 'text'
            } else {
                showToast('warning', 'Primero selecciona un texto para cambiar su color', 'Selecciona un texto')
            }
            break
        case 'add-text':
            addText()
            break
        case 'emoji-picker':
            toggleEmoji()
            break
        case 'upload-image':
            document.querySelector('input[type="file"]').click()
            break
        case 'undo':
            undo()
            break
        case 'redo':
            redo()
            break
        case 'zoom-in':
            moreZoomButton()
            break
        case 'zoom-out':
            lessZoomButton()
            break
        case 'download':
            showPreviewAndExport()
            break
        case 'template-gallery':
            showTemplateGallery.value = true
            break
    }
}

// Template gallery methods
function hideTemplateGallery() {
    showTemplateGallery.value = false
}

function applyTemplate(template) {
    showLoading('Aplicando plantilla...', true, 0)
    
    // Clear current canvas except background elements
    canvas.getObjects().forEach(function(obj) {
        if (obj.id !== 'background' && obj.id !== 'deckcolor' && obj.id !== 'clipMask') {
            canvas.remove(obj)
        }
    })
    
    // Apply template deck color
    if (template.deckColor) {
        colors.value.hex = template.deckColor
        bgDeckColor.value = template.deckColor
        onDeckColorChange({ target: { value: template.deckColor } })
        updateProgress(30)
    }
    
    // Apply template elements
    template.elements.forEach((element, index) => {
        setTimeout(() => {
            if (element.type === 'text') {
                const text = new fabric.IText(element.content, {
                    id: 'text_' + Math.random().toString(16).slice(2),
                    left: backgroundPositionLeft.value + (element.x / 100 * deckBackgroundWidth.value),
                    top: calculateBackgroundDeckTopOffset() + (element.y / 100 * deckBackgroundHeight.value),
                    fontSize: element.size * 25,
                    fill: element.color,
                    fontFamily: 'Arial',
                    type: 'text'
                })
                text.setControlVisible('ml', false)
                text.setControlVisible('mb', false)
                text.setControlVisible('mr', false)
                text.setControlVisible('mt', false)
                canvas.add(text)
                canvas.moveTo(text, 4)
            } else if (element.type === 'emoji') {
                const emoji = new fabric.IText(element.content, {
                    id: 'emoji_' + Math.random().toString(16).slice(2),
                    left: backgroundPositionLeft.value + (element.x / 100 * deckBackgroundWidth.value),
                    top: calculateBackgroundDeckTopOffset() + (element.y / 100 * deckBackgroundHeight.value),
                    fontSize: element.size * 25,
                    type: 'smiley'
                })
                emoji.setControlVisible('ml', false)
                emoji.setControlVisible('mb', false)
                emoji.setControlVisible('mr', false)
                emoji.setControlVisible('mt', false)
                canvas.add(emoji)
                canvas.moveTo(emoji, 4)
            }
            
            // Update progress
            const progress = 30 + ((index + 1) / template.elements.length) * 60
            updateProgress(progress)
            
            // Complete when all elements are added
            if (index === template.elements.length - 1) {
                setTimeout(() => {
                    updateProgress(100)
                    hideLoading()
                    hideTemplateGallery()
                    canvas.renderAll()
                    updateLayerList()
                    showToast('success', `Plantilla "${template.name}" aplicada correctamente`, '¡Plantilla aplicada!')
                }, 300)
            }
        }, index * 200)
    })
}

// UX Enhancement Methods
function showLoading(message, showProgress = false, progress = 0) {
    loadingState.value = {
        isVisible: true,
        message: message,
        showProgress: showProgress,
        progress: progress
    }
}

function hideLoading() {
    loadingState.value.isVisible = false
}

function updateProgress(progress) {
    if (loadingState.value.showProgress) {
        loadingState.value.progress = Math.min(100, Math.max(0, progress))
    }
}

function showToast(type, message, title = '') {
    toastState.value = {
        isVisible: true,
        type: type,
        title: title,
        message: message
    }
    
    // Auto hide after 4 seconds
    setTimeout(() => {
        hideToast()
    }, 4000)
}

function hideToast() {
    toastState.value.isVisible = false
}

function updateEmptyStateVisibility() {
    const objects = canvas.getObjects().filter(obj => 
        obj.id !== 'background' && 
        obj.id !== 'deckcolor' && 
        obj.id !== 'clipMask' &&
        obj.id !== 'bin'
    )
    showEmptyState.value = objects.length === 0
}

function handleEmptyStateAction(action) {
    switch (action) {
        case 'add-text':
            addText()
            break
        case 'upload-image':
            document.querySelector('input[type="file"]').click()
            break
        case 'browse-templates':
            showTemplateGallery.value = true
            break
        case 'add-emoji':
            toggleEmoji()
            break
        case 'deck-color':
            // Close empty state popup and open native color picker
            hideEmptyState()
            if (deckColorInput.value) {
                deckColorInput.value.click()
            }
            break
    }
}

function hideEmptyState() {
    showEmptyState.value = false
}

function dismissEmptyState() {
    // User dismissed empty state, don't show it again for this session
    showEmptyState.value = false
    localStorage.setItem('einanuxt3-empty-state-dismissed', 'true')
}

function onHintDismiss(hintId) {
    // Handle hint dismissal if needed
    console.log('Hint dismissed:', hintId)
}

// Detect mobile device
function detectMobile() {
    isMobile.value = window.innerWidth <= 768
}

// Initialize mobile detection and features
// REMOVED: Duplicate onMounted hook - mobile detection is already handled in first onMounted

// Update undo/redo states - these should be connected to actual undo/redo functionality
// watch(() => canvas, () => {
//     if (canvas) {
//         // This is a simplified version - you'd need to implement proper undo/redo tracking
//         canUndo.value = false // Set based on actual undo stack
//         canRedo.value = false // Set based on actual redo stack
//     }
// })

// Phase 3.2: Preview & Export Methods
function showPreviewAndExport() {
    updateCanvasElements()
    showPreview.value = true
}

function hidePreview() {
    showPreview.value = false
}

function updateCanvasElements() {
    if (!canvas) return
    
    canvasElements.value = canvas.getObjects()
        .filter(obj => obj.id !== 'background' && obj.id !== 'deckcolor' && obj.id !== 'clipMask' && obj.id !== 'bin')
        .map(obj => ({
            id: obj.id,
            content: obj.text || obj.type,
            left: obj.left,
            top: obj.top,
            fontSize: obj.fontSize || 20,
            fill: obj.fill,
            fontFamily: obj.fontFamily,
            fontWeight: obj.fontWeight,
            type: obj.type
        }))
}

function handlePreviewExport(exportOptions) {
    showLoading(`Generando ${exportOptions.format.toUpperCase()} en calidad ${exportOptions.quality}...`, true, 0)
    
    // Simulate export process with progress
    let progress = 0
    const interval = setInterval(() => {
        progress += 15
        updateProgress(progress)
        
        if (progress >= 100) {
            clearInterval(interval)
            // Call the actual download function with enhanced options
            setTimeout(() => {
                startEnhancedDownload(exportOptions)
                hideLoading()
                hidePreview()
                showToast('success', `Diseño exportado en ${exportOptions.format.toUpperCase()}`, '¡Exportación completada!')
            }, 500)
        }
    }, 300)
}

function startEnhancedDownload(options = {}) {
    const quality = options.quality || 'high'
    const format = options.format || 'jpg'
    
    // Use existing download logic but with enhanced options
    startDownload()
}

// Phase 4: Advanced Features & Polish Methods

// Design Management Methods
function getCanvasData() {
    return canvas ? canvas.toJSON(['id']) : null
}

function loadDesign(designData) {
    if (!canvas || !designData) return
    
    showLoading('Cargando diseño...', true, 0)
    updateProgress(30)
    
    canvas.loadFromJSON(designData, () => {
        updateProgress(70)
        canvas.renderAll()
        updateLayerList()
        updateProgress(100)
        
        setTimeout(() => {
            hideLoading()
            showToast('success', 'Diseño cargado correctamente', '¡Listo!')
        }, 500)
    })
}

function onDesignSaved(design) {
    showToast('success', `Diseño "${design.name}" guardado correctamente`, '¡Guardado!')
}

function shareDesign(design) {
    currentDesignForSharing.value = design
    showShareModal.value = true
}

function closeShareModal() {
    showShareModal.value = false
    currentDesignForSharing.value = null
}

// Enhanced Layer Management Methods
function selectLayer(layerId) {
    const obj = canvas.getObjects().find(o => o.id === layerId)
    if (obj) {
        canvas.setActiveObject(obj)
        canvas.renderAll()
    }
}

function toggleLayerVisibility(layerId) {
    toggleHideObjectFromList(layerId, 'toggle')
}

function toggleLayerLock(layerId) {
    const obj = canvas.getObjects().find(o => o.id === layerId)
    if (obj) {
        obj.selectable = !obj.selectable
        obj.evented = !obj.evented
        canvas.renderAll()
        updateLayerList()
    }
}

function deleteLayer(layerId) {
    removeObject(layerId)
}

function duplicateLayer(layerId) {
    const obj = canvas.getObjects().find(o => o.id === layerId)
    if (obj) {
        obj.clone(cloned => {
            cloned.set({
                left: obj.left + 20,
                top: obj.top + 20,
                id: obj.type + Math.random().toString(16).slice(2)
            })
            canvas.add(cloned)
            canvas.renderAll()
            updateLayerList()
        })
    }
}

function reorderLayers(moveData) {
    const objects = canvas.getObjects()
    const objToMove = objects[moveData.from]
    
    // Remove and reinsert at new position
    canvas.remove(objToMove)
    canvas.insertAt(objToMove, moveData.to)
    canvas.renderAll()
    updateLayerList()
}

function updateLayerOpacity(data) {
    const obj = canvas.getObjects().find(o => o.id === data.layerId)
    if (obj) {
        obj.set('opacity', data.opacity)
        canvas.renderAll()
        updateLayerList()
    }
}

function renameLayer(data) {
    const obj = canvas.getObjects().find(o => o.id === data.layerId)
    if (obj) {
        obj.name = data.name
        updateLayerList()
    }
}

// Text Formatting Methods
function getSelectedTextObject() {
    if (!canvas) return null
    const activeObj = canvas.getActiveObject()
    return activeObj && activeObj.type === 'i-text' ? activeObj : null
}

function updateFontFamily(fontFamily) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fontFamily', fontFamily)
        canvas.renderAll()
    }
}

function updateFontSize(fontSize) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fontSize', fontSize)
        canvas.renderAll()
    }
}

function updateFontWeight(fontWeight) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fontWeight', fontWeight)
        canvas.renderAll()
    }
}

function updateTextStyle(styles) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        if (styles.bold !== undefined) {
            activeObj.set('fontWeight', styles.bold ? 'bold' : 'normal')
        }
        if (styles.italic !== undefined) {
            activeObj.set('fontStyle', styles.italic ? 'italic' : 'normal')
        }
        if (styles.underline !== undefined) {
            activeObj.set('underline', styles.underline)
        }
        canvas.renderAll()
    }
}

function updateTextAlign(textAlign) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('textAlign', textAlign)
        canvas.renderAll()
    }
}

function updateLineHeight(lineHeight) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('lineHeight', lineHeight)
        canvas.renderAll()
    }
}

function updateLetterSpacing(charSpacing) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('charSpacing', charSpacing * 1000) // Fabric.js uses different scale
        canvas.renderAll()
    }
}

function updateTextColor(color) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set('fill', color)
        canvas.renderAll()
    }
}

function updateTextShadow(shadow) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        if (shadow) {
            activeObj.set('shadow', new fabric.Shadow({
                color: shadow.color,
                blur: shadow.blur,
                offsetX: shadow.offsetX,
                offsetY: shadow.offsetY
            }))
        } else {
            activeObj.set('shadow', null)
        }
        canvas.renderAll()
    }
}

function updateTextTransform(textTransform) {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        let transformedText = activeObj.text
        
        switch (textTransform) {
            case 'uppercase':
                transformedText = activeObj.text.toUpperCase()
                break
            case 'lowercase':
                transformedText = activeObj.text.toLowerCase()
                break
            case 'capitalize':
                transformedText = activeObj.text.replace(/\b\w/g, l => l.toUpperCase())
                break
            case 'none':
            default:
                // Keep original text
                break
        }
        
        activeObj.set('text', transformedText)
        canvas.renderAll()
    }
}

function resetTextFormatting() {
    const activeObj = getSelectedTextObject()
    if (activeObj) {
        activeObj.set({
            fontFamily: 'Arial',
            fontSize: 18,
            fontWeight: 'normal',
            fontStyle: 'normal',
            underline: false,
            textAlign: 'left',
            lineHeight: 1.2,
            charSpacing: 0,
            shadow: null
        })
        canvas.renderAll()
    }
}

function copyTextFormatting(format) {
    // Format is already stored in the TextFormatting component
}

function pasteTextFormatting(format) {
    const activeObj = getSelectedTextObject()
    if (activeObj && format) {
        activeObj.set({
            fontFamily: format.fontFamily,
            fontSize: format.fontSize,
            fontWeight: format.fontWeight,
            fontStyle: format.italic ? 'italic' : 'normal',
            underline: format.underline,
            textAlign: format.textAlign,
            lineHeight: format.lineHeight,
            charSpacing: format.letterSpacing * 1000,
            fill: format.color
        })
        
        if (format.shadow) {
            activeObj.set('shadow', new fabric.Shadow({
                color: format.shadow.color,
                blur: format.shadow.blur,
                offsetX: format.shadow.offsetX,
                offsetY: format.shadow.offsetY
            }))
        }
        
        canvas.renderAll()
    }
}

function getDefaultLayerName(type) {
    const names = {
        'i-text': 'Texto',
        image: 'Imagen',
        smiley: 'Emoji',
        rect: 'Rectángulo',
        circle: 'Círculo',
        triangle: 'Triángulo'
    }
    return names[type] || 'Capa'
}

// Auto-save functionality
function setupAutoSave() {
    if (designManager.value) {
        designManager.value.setupAutoSave()
    }
}

// Update text selection state
function updateTextSelection() {
    const activeObj = canvas.getActiveObject()
    hasSelectedText.value = activeObj && activeObj.type === 'i-text'
    selectedTextObject.value = hasSelectedText.value ? activeObj : null
    
    // Update typography state when text is selected
    if (hasSelectedText.value && activeObj) {
        selectedFont.value = activeObj.fontFamily || 'Arial, sans-serif'
        fontSize.value = activeObj.fontSize || 18
        fontWeight.value = activeObj.fontWeight || '400'
        isBold.value = activeObj.fontWeight === 'bold' || parseInt(activeObj.fontWeight) >= 600
        isItalic.value = activeObj.fontStyle === 'italic'
        isUnderline.value = activeObj.underline || false
        textAlign.value = activeObj.textAlign || 'left'
        textColor.value.hex = activeObj.fill || '#000000'
    }
}

// Enhanced canvas event handlers for Phase 4
const originalSelectionCreated = canvas?.on ? true : false

if (canvas) {
    canvas.on('selection:created', (e) => {
        updateTextSelection()
        updateLayerList()
    })
    
    canvas.on('selection:updated', (e) => {
        updateTextSelection()
    })
    
    canvas.on('selection:cleared', (e) => {
        hasSelectedText.value = false
        selectedTextObject.value = null
    })
    
    canvas.on('object:added', (e) => {
        updateLayerList()
        setupAutoSave()
    })
    
    canvas.on('object:removed', (e) => {
        updateLayerList()
        setupAutoSave()
    })
    
    canvas.on('object:modified', (e) => {
        setupAutoSave()
    })
}

// Phase 5: Mobile Optimization Functions
function initializeMobileFeatures() {
    // Show onboarding for first-time mobile users
    if (isMobile.value && !localStorage.getItem('mobile_onboarding_completed')) {
        showMobileOnboarding.value = true
    }
    
    // Setup gesture detection for canvas
    if (canvasEl.value && isTouch.value) {
        setupGestureDetection(canvasEl.value)
    }
    
    // Setup mobile-specific event handlers
    onGesture('swipe', handleCanvasSwipe)
    onGesture('pinch', handleCanvasPinch)
    
    // Adjust canvas for mobile
    if (isMobile.value) {
        adjustCanvasForMobile()
    }
    
    // Setup smart gesture management for object interactions
    setupSmartGestureManagement()
}

function handleMobileToolSelect(tool) {
    selectedTool.value = tool
    lightHaptic()
    
    // Handle different tool selections
    switch (tool) {
        case 'text':
            addText()
            break
        case 'color':
            if (deckColorInput.value) {
                deckColorInput.value.click()
            }
            break
        case 'image':
            if (isCameraSupported.value) {
                handleMobileImageUpload()
            } else {
                if (file.value) {
                    file.value.click()
                }
            }
            break
        case 'emoji':
            toggleEmojiPicker()
            break
        case 'shapes':
            // Future: Add shape tools
            break
        case 'filters':
            // Future: Add filter tools
            break
        case 'layers':
            // Show mobile-friendly layer manager
            break
        case 'templates':
            // Show template gallery
            break
        default:
            break
    }
}

function handleMobileAction(action) {
    mediumHaptic()
    
    switch (action) {
        case 'undo':
            undo()
            break
        case 'redo':
            redo()
            break
        case 'save':
            handleMobileSave()
            break
        case 'download':
            handleMobileDownload()
            break
        default:
            break
    }
}

async function handleMobileImageUpload() {
    try {
        const imageDataUrl = await getImageFromDevice()
        if (imageDataUrl) {
            fabric.Image.fromURL(imageDataUrl, (img) => {
                // Scale image for mobile canvas
                const maxWidth = canvas.getWidth() * 0.4
                const maxHeight = canvas.getHeight() * 0.4
                
                if (img.width > maxWidth || img.height > maxHeight) {
                    const scale = Math.min(maxWidth / img.width, maxHeight / img.height)
                    img.scale(scale)
                }
                
                img.set({
                    left: canvas.getWidth() / 2,
                    top: canvas.getHeight() / 2,
                    originX: 'center',
                    originY: 'center'
                })
                
                canvas.add(img)
                canvas.setActiveObject(img)
                canvas.renderAll()
                
                updateLayersList()
                mediumHaptic()
            })
        }
    } catch (error) {
        console.error('Error uploading image:', error)
    }
}

function handleMobileSave() {
    const designData = {
        id: uuid.value || Date.now().toString(),
        name: currentDesignName.value || 'Mi Diseño',
        canvas: canvas.toJSON(),
        timestamp: Date.now(),
        mobile: true
    }
    
    if (isOnline.value) {
        // Save to server
        saveDesign(designData)
    } else {
        // Cache locally and add to sync queue
        cacheDesign(designData)
        addToSyncQueue({
            type: 'save_design',
            data: designData
        })
    }
    
    strongHaptic()
}

function handleMobileDownload() {
    // Generate high-quality image for mobile
    const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 0.9,
        multiplier: 2 // Higher resolution for mobile
    })
    
    currentDesignImage.value = dataURL
    currentDesignName.value = 'Mi Diseño de Tabla'
    currentDesignId.value = uuid.value || Date.now().toString()
    
    // Show mobile share modal instead of direct download
    showMobileShareModal.value = true
    mediumHaptic()
}

function handleMobileShare(shareData) {
    if (navigator.share) {
        navigator.share({
            title: shareData.name || 'Mi Diseño de Tabla',
            text: 'Mira mi diseño de tabla personalizada',
            url: shareData.url
        })
    }
}

function handleCanvasSwipe(data) {
    // Only handle canvas gestures when no objects are selected
    if (canvas.getActiveObject()) {
        return // Don't interfere with object manipulation
    }
    
    // Handle swipe gestures on canvas
    if (data.direction === 'up') {
        // Zoom in
        const zoom = canvas.getZoom()
        canvas.setZoom(Math.min(zoom * 1.1, 3))
    } else if (data.direction === 'down') {
        // Zoom out
        const zoom = canvas.getZoom()
        canvas.setZoom(Math.max(zoom * 0.9, 0.1))
    } else if (data.direction === 'left') {
        // Pan left
        const vpt = canvas.viewportTransform
        vpt[4] -= 50
        canvas.renderAll()
    } else if (data.direction === 'right') {
        // Pan right
        const vpt = canvas.viewportTransform
        vpt[4] += 50
        canvas.renderAll()
    }
    
    lightHaptic()
}

function handleCanvasPinch(data) {
    // Only handle canvas gestures when no objects are selected
    if (canvas.getActiveObject()) {
        return // Don't interfere with object manipulation
    }
    
    // Handle pinch-to-zoom
    if (data.scale > 1) {
        const zoom = canvas.getZoom()
        canvas.setZoom(Math.min(zoom * 1.1, 3))
    } else {
        const zoom = canvas.getZoom()
        canvas.setZoom(Math.max(zoom * 0.9, 0.1))
    }
    
    lightHaptic()
}

function setupSmartGestureManagement() {
    if (!canvas || !isMobile.value) return
    
    // Track object manipulation state
    let isObjectBeingManipulated = false
    
    // Disable gestures when object manipulation starts
    canvas.on('mouse:down', (event) => {
        if (event.target && event.target.type !== 'background') {
            isObjectBeingManipulated = true
            disableGestures()
        }
    })
    
    // Re-enable gestures when object manipulation ends
    canvas.on('mouse:up', (event) => {
        if (isObjectBeingManipulated) {
            // Small delay to prevent gesture detection from interfering
            setTimeout(() => {
                enableGestures()
                isObjectBeingManipulated = false
            }, 100)
        }
    })
    
    // Disable gestures during object events
    const objectEvents = ['object:moving', 'object:scaling', 'object:rotating']
    objectEvents.forEach(eventName => {
        canvas.on(eventName, () => {
            isObjectBeingManipulated = true
            disableGestures()
        })
    })
    
    // Re-enable gestures when object modification ends
    canvas.on('object:modified', () => {
        setTimeout(() => {
            enableGestures()
            isObjectBeingManipulated = false
        }, 100)
    })
    
    // Disable gestures when selecting objects
    canvas.on('selection:created', () => {
        isObjectBeingManipulated = true
        disableGestures()
    })
    
    canvas.on('selection:updated', () => {
        isObjectBeingManipulated = true
        disableGestures()
    })
    
    // Re-enable gestures when selection is cleared
    canvas.on('selection:cleared', () => {
        setTimeout(() => {
            enableGestures()
            isObjectBeingManipulated = false
        }, 100)
    })
}

function adjustCanvasForMobile() {
    if (!canvas) return
    
    // Adjust canvas size for mobile
    const container = canvasWrapper.value
    if (container && (isMobile.value || isMobileDevice.value === true)) {
        const containerWidth = window.innerWidth - 32 // Account for padding
        const containerHeight = window.innerHeight - 120 // Account for toolbars
        
        // Set canvas dimensions to container size
        canvas.setDimensions({width: containerWidth, height: containerHeight});
        
        // Calculate proper zoom to show the skateboard deck
        // The deck is roughly positioned at backgroundPositionLeft and has specific dimensions
        const deckWidth = deckBackgroundWidth.value || 2833
        const deckHeight = deckBackgroundHeight.value || 10119
        
        // Scale to fit the deck in the available space with some padding
        const scaleX = (containerWidth * 0.8) / deckWidth
        const scaleY = (containerHeight * 0.8) / deckHeight
        const scale = Math.min(scaleX, scaleY, 0.1) // Cap maximum zoom
        
        canvas.setZoom(scale)
        
        // Center the deck in the viewport
        const vpt = canvas.viewportTransform
        vpt[4] = containerWidth / 2 - (backgroundPositionLeft.value + deckWidth / 2) * scale
        vpt[5] = containerHeight / 2 - (calculateBackgroundDeckTopOffset() + deckHeight / 2) * scale
        
        canvas.renderAll()
    }
}

function toggleMobileToolbar() {
    showMobileToolbar.value = !showMobileToolbar.value
}

function closeMobileOnboarding() {
    showMobileOnboarding.value = false
}

function completeMobileOnboarding() {
    localStorage.setItem('mobile_onboarding_completed', 'true')
    showMobileOnboarding.value = false
    strongHaptic()
}

function skipMobileOnboarding() {
    localStorage.setItem('mobile_onboarding_completed', 'true')
    showMobileOnboarding.value = false
}

function closeMobileShareModal() {
    showMobileShareModal.value = false
}

// Watch for orientation changes (simplified)
// watch(orientation, (newOrientation) => {
//     if (isMobile.value) {
//         nextTick(() => {
//             adjustCanvasForMobile()
//         })
//     }
// })

// Watch for online/offline changes (simplified)
// watch(isOnline, (online) => {
//     if (online) {
//         // Show reconnection message
//         showMobileToast('Conexión restaurada - Sincronizando cambios...')
//     } else {
//         // Show offline message
//         showMobileToast('Trabajando sin conexión - Los cambios se guardarán localmente')
//     }
// })

function showMobileToast(message) {
    // Simple toast notification for mobile
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 left-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-center'
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast)
        }
    }, 3000)
}

</script>

<style>
/* Phase 3: Organized Toolbar Styles */
.organized-toolbar-container {
    position: fixed;
    top: 4rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

/* Hide old toolbar elements when organized toolbar is active */
.organized-toolbar-container ~ .options--bottom-right,
.organized-toolbar-container ~ .textedit--top {
    display: none;
}

/* Mobile adjustments */
@media (max-width: 768px) {
    .organized-toolbar-container {
        position: fixed;
        top: auto;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        transform: none;
        z-index: 100;
    }
}

.canvas__wrapper{
    width: 100%;
}

.canvas {
    top: -50px !important;
}

/* Mobile-specific styles */
@media (max-width: 768px) {
    .canvas__wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;
        background-color: #f5f5f5;
        padding: 1rem;
        padding-bottom: 100px; /* Space for mobile toolbar toggle */
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .canvas {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
        width: auto !important;
        height: auto !important;
        max-width: calc(100vw - 2rem) !important;
        max-height: calc(100vh - 120px) !important;
        margin: 0 auto !important;
        display: block !important;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        /* Ensure canvas maintains aspect ratio */
        object-fit: contain;
    }
}

/* Popover */
.popover__content {
  opacity: v-bind(popoverOpacity);
  visibility: v-bind(popoverVisible);
  z-index: v-bind(popoverZindex);
  position: absolute;
  top: v-bind(popoverTop);
  left: v-bind(popoverLeft);
  transform: v-bind(popoverTransform);
  background-color: #bfbfbf;
  padding: 1.5rem;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
  width: auto;
  transition: v-bind(popoverTransition);
}
.popover__content:before {
  position: absolute;
  z-index: -1;
  content: "";
  right: calc(50% - 10px);
  top: -8px;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent #bfbfbf transparent;
  transition-duration: 0.3s;
  transition-property: transform;
}
.popover__message {
  text-align: center;
}

.options--top {
    opacity: v-bind(optionsTopOpacity);
    visibility: v-bind(optionsTopVisible);
    z-index: v-bind(optionsTopZindex);
    position: absolute;
    width: 100%;
    height: 50px;
    top: -50px;
    /* left: 20px; */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: transparent;
}

.options--top-left {
    opacity: v-bind(optionsTopOpacity);
    visibility: v-bind(optionsTopVisible);
    z-index: v-bind(optionsTopZindex+10);
    position: absolute;
    width: 35%;
    height: 50px;
    top: -50px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: transparent;
}

.options--top-right {
    opacity: v-bind(optionsTopOpacity);
    visibility: v-bind(optionsTopVisible);
    z-index: v-bind(optionsTopZindex);
    position: absolute;
    width: 10%;
    height: 50px;
    top: -50px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content:center;
    background-color: #b9b5b4;
}

.options--bottom-left {
    position: absolute;
    width: 50%;
    height: 50px;
    bottom: 50px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /* background-color: #b9b5b4; */
}



.options--bottom-right {
    /* opacity: v-bind(optionsTopOpacity);
    visibility: v-bind(optionsTopVisible);
    z-index: v-bind(optionsTopZindex); */
    position: absolute;
    width: 50%;
    height: 50px;
    bottom: 50px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    /* background-color: #b9b5b4; */
}

.delete-elementbottom {
    /* opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex); */
    opacity: 1;
    visibility: visible;
    z-index: 1;
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 50px;
    /* left: 280px; */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #b9b5b4;

    /* padding: 1.5rem;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    
    width: auto;

  transform: 'translate(0, 10px);';
  transition: 'all 0 ease 0'; */
}

.delete-elementbottom--icon {
    width: 80px;
}
.textedit--top {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 20%;
    height: 50px;
    top: -50px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: transparent;
}

.objectmove--top {
    visibility: v-bind(objectMoveVisible);
    position: absolute;
    width: 20%;
    height: 50px;
    top: -50px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: transparent;
}

.textedit--top-center {
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 80%; /* 100%; */
    height: 50px;
    top: -47px;
    /* right: 10px; */
    /* top: v-bind(textEditFontTop); */
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
}

.textedit--bottom {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 100%;
    height: 40px;
    top: v-bind(textEditFontTop);
    display: flex;
    align-items: center;
    justify-content: center;
    
}

input[type='color'] {
    padding: 0;
    width: 50px;
    height: 70px;
    margin-top: -50px;
    margin-left: -10px;
}

.colorPickerWrapper {
  overflow: hidden;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  box-shadow: 1px 1px 3px 0px grey;
}

.colorPickerBgDeck {
    width: 37px;
    height: 37px;
    margin-right: 5px;
    margin-left: 5px;
}

.btn-add-color {
    width: 37px;
    height: 37px;
}

.rounded__btn {
   background: rgba(38, 37, 37, 0.82); 
   /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
   color: #fff;
   border-radius: 50%;
   width: 37px;
   height: 37px;
   text-align: center;
   padding-top: 7px;
   margin-right: 5px;
   margin-left: 5px;
   cursor: pointer;
}
.rounded__btn--activecolor {
    background: v-bind(activeTextColor);
}

.rounded__btn-downloadbig {
   width: 47px;
   height: 47px;
   font-size: 32px !important;
   margin-right: 10px;
   margin-bottom: 10px;
}

.rounded__btn-pt5 {
    padding-top: 5px;
}

.rounded__btn-active {
    background: #2b9f4e !important;
    transform: scale(0.95);
    box-shadow: 0 2px 8px rgba(43, 159, 78, 0.3);
}


.color-picker-container {
    position: relative;
    display: inline-block;
}

.emoji-picker-container {
    position: relative;
    display: inline-block;
}

.emoji-picker-container {
    position: relative;
    display: inline-block;
}

.simple-emoji-picker {
    position: absolute;
    top: 50px;
    right: 0;
    z-index: 1000;
    width: 320px;
    max-width: calc(100vw - 20px);
    background: white;
    border: 2px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    max-height: 400px;
    animation: dropdownSlide 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    flex-direction: column;
}

.simple-emoji-picker::before {
    content: '';
    position: absolute;
    top: -12px;
    right: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 12px solid white;
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.15));
    z-index: 1001;
}

.emoji-categories {
    display: flex;
    justify-content: space-around;
    padding: 12px 8px;
    border-bottom: 1px solid #e1e8ed;
    background: #f8fafc;
    border-radius: 12px 12px 0 0;
    gap: 2px;
    flex-wrap: wrap;
}

.category-tab {
    padding: 6px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid transparent;
    user-select: none;
}

.category-tab:hover {
    background: #e1e8ed;
    transform: scale(1.05);
}

.category-tab.active {
    background: #1da1f2;
    color: white;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(29, 161, 242, 0.3);
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    padding: 12px;
    overflow-y: auto;
    max-height: 280px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.emoji-grid::-webkit-scrollbar {
    width: 6px;
}

.emoji-grid::-webkit-scrollbar-track {
    background: transparent;
}

.emoji-grid::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.emoji-grid::-webkit-scrollbar-thumb:hover {
    background: #999;
}

.emoji-option {
    font-size: 20px;
    padding: 6px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.emoji-option:hover {
    background-color: #f0f0f0;
}

.emoji-option:active {
    background-color: #e0e0e0;
    transform: scale(0.95);
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .simple-emoji-picker {
        width: 280px;
        max-height: 320px;
        right: -10px;
    }
    
    .simple-emoji-picker::before {
        right: 25px;
    }
    
    .emoji-categories {
        padding: 8px 4px;
        gap: 1px;
    }
    
    .category-tab {
        font-size: 14px;
        min-width: 28px;
        height: 28px;
        padding: 4px 6px;
    }
    
    .emoji-grid {
        grid-template-columns: repeat(6, 1fr);
        gap: 3px;
        padding: 8px;
        max-height: 200px;
    }
    
    .emoji-option {
        font-size: 18px;
        padding: 4px;
    }
}

@media (max-width: 480px) {
    .simple-emoji-picker {
        width: 240px;
        max-height: 280px;
        right: -20px;
    }
    
    .simple-emoji-picker::before {
        right: 30px;
    }
    
    .emoji-categories {
        padding: 6px 2px;
        gap: 1px;
    }
    
    .category-tab {
        font-size: 12px;
        min-width: 24px;
        height: 24px;
        padding: 2px 4px;
    }
    
    .emoji-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 2px;
        padding: 6px;
        max-height: 160px;
    }
    
    .emoji-option {
        font-size: 16px;
        padding: 3px;
    }
}

.emoji-picker-dropdown {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    width: 350px;
    max-width: 90vw;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    overflow: hidden;
}

@keyframes dropdownSlide {
    0% {
        transform: translateX(-50%) translateY(-10px) scaleY(0.3);
        opacity: 0;
        transform-origin: top center;
    }
    60% {
        transform: translateX(-50%) translateY(-3px) scaleY(0.9);
        opacity: 0.8;
    }
    100% {
        transform: translateX(-50%) translateY(0) scaleY(1);
        opacity: 1;
        transform-origin: top center;
    }
}

/* Optional: fade out animation when closing */
.colorpicker-exit, .textcolorpicker-exit {
    animation: dropdownSlideOut 0.2s ease-in-out;
}

@keyframes dropdownSlideOut {
    0% {
        transform: translateY(0) scaleY(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-10px) scaleY(0.5);
        opacity: 0;
    }
}

.color-green {
    background-color: #78b657;
}
.color-blue {
    background-color: rgb(56, 107, 147);
}

.hidden {
    display: none !important;
}
</style>