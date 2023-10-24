<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@48,400,0,0" />            
    <!-- <section class="fixed pl-200"> -->
    <LayersList v-if="layersListVisible" :layers="layersList"></LayersList>
    <section ref="canvasWrapper" v-resize="resize" class="canvas__wrapper fixed top-12 " @click="canvasEv()">
        <canvas ref="canvasEl" class="canvas"></canvas>
        <div class="options--bottom-left">
            <span hidden class="rounded__btn material-symbols-sharp" @click="toggleLayersList()" v-if="layersList.length>1000">
                layers
            </span>
            <span class="rounded__btn material-symbols-sharp" @click="moreZoomButton">zoom_in</span>
            <span class="rounded__btn material-symbols-sharp" @click="lessZoomButton">zoom_out</span>
        </div>
        <div class="options--top">
            <Chrome v-model="colors" class="colorpicker" @update:modelValue="setDeckColor()" />
            <!-- <input type="range" id="zoom" name="zoom" value="0.065" min="0.045" max="0.075" step="0.010" @change="changeZoom(value)"> -->
            
            <span class="rounded__btn material-symbols-sharp" :class="colorpickerVisibleClassObject" @click="toggleShowColorpicker()" v-html="colorpickerVisibleIconComputed">
            </span>
            <!-- <input type="color" value="#6697CC" @input="bgDeckColorChange($event)" /> -->
            <!-- <div class="inline-block colorPickerWrapper colorPickerBgDeck" >    
                <svg src="/img/icon/insta-board-icon-skateboard-deck-background-color.svg" class="btn-add-color"> </svg>
                <input type="color" value="#6697CC" @input="bgDeckColorChange($event)" />
            </div> -->            
            
                
            <span class="rounded__btn material-symbols-sharp" @click="$refs.file.click()">add_photo_alternate</span>
            <input ref="file" type="file"  accept="image/*;capture=camera" class="hidden" @change="uploadFile($event)" />
            <span class="rounded__btn material-symbols-sharp" @click="addText()">text_fields</span>
            <span class="rounded__btn material-symbols-sharp" :class="emojipickerVisibleClassObject" @click="toogleEmoji()" v-html="emojipickerVisibleIconComputed"></span>
            
            <EmojiPicker
                v-if="emojiVisible" 
                :native="true" 
                :hide-search="true" 
                :hide-group-icons="true" 
                :hide-group-names="true" 
                :disable-sticky-group-names="true" 
                :disable-skin-tones="true"
                @select="onSelectEmoji" 
            />
        </div>
        <div hidden>
            <!-- Hidden until release and refactor-->
            <button id="undo" ref="undoButton" type="button" v-bind="undoDisabled" @click="undo()">Undo</button>
            <button id="redo" ref="redoButton" type="button" v-bind="redoDisabled" @click="redo()">Redo</button>
        </div>
        
        <div class="options--bottom-right">
            <span class="rounded__btn cursor-pointer material-symbols-sharp color-green rounded__btn-downloadbig" @click="finishEdition()" :class="downloadVisibleClassObject" v-html="downloadVisibleIconComputed"></span>
            <!-- <span class="rounded__btn cursor-pointer material-symbols-sharp color-blue rounded__btn-downloadbig" @click="generatePrints()" :class="downloadVisibleClassObject" v-html="downloadVisibleIconComputed"></span> -->
        </div>
        <!-- <div class="options--top-right cursor-pointer" @click="toggleLayersList()" v-if="layersList.length>0">
            
        </div> -->
        <div class="textedit--top">
            <span class="rounded__btn material-symbols-sharp rounded__btn-pt5 rounded__btn--activecolor" :class="textcolorpickerVisibleClassObject" @click="toggleShowTextColorpicker()" v-html="textcolorpickerVisibleIconComputed"></span>
            <Chrome v-model="textColor" class="textcolorpicker" @update:modelValue="setTextColor()" />
            
            <!-- <div class="inline-block colorPickerWrapper">
                <input type="color" @input="fontColorChange($event)" />
            </div> -->
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
</template>
<script setup>
import { fabric } from 'fabric-with-gestures-notupdated';
import { ref, shallowRef, onMounted, computed } from 'vue';
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { Chrome } from '@ckpack/vue-color';

import { useStore } from 'vuex'

const canvasWrapper = ref(null);
const canvasEl = ref(null);
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

const colors = ref('#026ed9')
const textColor = ref('3D94FF')
const fontFamilyAvailable = ref(['Caveat', 'Sevillana', 'Moon Dance', 'Anton', 'Pacifico', 'Exo 2', 'Crimson Text' ]);

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
            && o.id !== "opacity1"
            && o.id !== "opacity2"
            && o.id !== "opacity3"
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
        const reader = new FileReader();
        reader.onload = async function(e) {
            img.value = e.target.result;
            
            //const photoUrl = URL.createObjectURL(input.files[0]);

            const tempImg = new Image();
            const imageDimensions = await new Promise((resolve) => {
                tempImg.onload = () => {
                    const dimensions = {
                        height: tempImg.height,
                        width: tempImg.width
                    };
                    resolve(dimensions);
                }
                tempImg.src = img.value;
            })
            addImage(img.value, undefined, undefined, imageDimensions.width, imageDimensions.height)
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
            textColor.value = o.fill
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

function toogleEmoji() {
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

function finishEdition(){
    generatePrints.value = true
    const svgContent = canvas.toSVG({
            width: 25000,
            height: 25000,
            viewBox: {
                x: 0,
                y: 0,
                width: 25000,
                height: 25000
            }
        }),
        blob = new Blob([svgContent], {
          type: "image/svg+xml"
        })
    const a = document.createElement("a");
    if(typeof(a.download) === "string") {
        let url = window.URL.createObjectURL(blob);
        a.download = "print.svg";
        a.href = url
    }else {
        navigator.msSaveBlob(blob, 'test.svg')
    }
      
    a.target = "_blank";
    setTimeout(() => {
        a.click();
    }, 1000);
    
                
    

    const canvasJSON = canvas.toJSON()
    //fetch('http://api.einaskateco.com/designs/', {
    fetch('http://localhost:80/api/designs/', {
        method: 'POST',
        // contentType: 'multipart/form-data',
        headers: {
            'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
            "json": JSON.stringify(canvasJSON),
            "svg": canvas.toSVG(),
            "source": 'web',
            "uuid": uuid.value,
            "img_generated": canvas.toDataURL('jpeg')//jpeg
        })
    })
    generatePrints.value = false
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
    console.log('!!!!!!!!!');
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
    const rect = new fabric.Rect({ 
        top: calculateBackgroundDeckTopOffset(), 
        left: backgroundPositionLeft.value + 445,
        width: deckBackgroundWidth.value-100,
        //height: 5060,
         height: deckBackgroundHeight.value-100,
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

function setOpacityLayer() {
    const rect = new fabric.Rect({
        id: 'opacity1',
        excludeFromExport: true,
        top: 0,
        left: 0,
        width: backgroundPositionLeft.value+ 345,
        height: deckBackgroundHeight.value + calculateBackgroundDeckTopOffset(),
        fill: '#fff',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 1
    })
    canvas.moveTo(rect,1)
    canvas.add(rect)



    const rect2 = new fabric.Rect({
        id: 'opacity2',
        excludeFromExport: true,
        top: 0,
        left: backgroundPositionLeft.value + deckBackgroundWidth.value+345,
        width: backgroundPositionLeft.value+10000,
        height: deckBackgroundHeight.value + calculateBackgroundDeckTopOffset(),
        fill: '#fff',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 1
    })
    canvas.moveTo(rect2,2);
    canvas.add(rect2)

    const rect3 = new fabric.Rect({
        id: 'opacity3',
        excludeFromExport: true,
        top: (deckBackgroundHeight.value-10)+calculateBackgroundDeckTopOffset(),
        left: 0,
        width: 40000,
        height: deckBackgroundHeight.value,
        fill: '#fff',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 1
    })
    canvas.moveTo(rect3,3);
    canvas.add(rect3)

    if (calculateBackgroundDeckTopOffset() > 0) {
        const rect4 = new fabric.Rect({
            id: 'opacity4',
            excludeFromExport: true,
            top: 0,
            left: backgroundPositionLeft.value+345,
            width: deckBackgroundWidth.value,
            height: calculateBackgroundDeckTopOffset(),
            fill: '#fff',
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
            selectable: false,
            evented: false,
            hoverCursor: 'default',
            opacity: 1
        })
        canvas.moveTo(rect4, 4);
        canvas.add(rect4)
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

}
onMounted(() => {
    canvas = new fabric.Canvas(canvasEl.value, {
        width: 500, height:630
    });
    canvas.setZoom(0.06);
    canvas.renderAll()
    isMobileDeviceCheck()
    resize()
    setBackground()
    setDeckBackground()
    setOpacityLayer()
    createBin()
    makeId()
    
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
        var snapZone = 150;
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object

        var objectMiddleHorizontal = event.target.left + (event.target.width * event.target.scaleX) / 2;
        if (objectMiddleHorizontal > backgroundPositionLeft.value+1700 - snapZone && objectMiddleHorizontal < backgroundPositionLeft.value+1700 + snapZone) {
            console.log('objectMiddleHorizontal', objectMiddleHorizontal);
            console.log('backgroundPositionLeft.value+1700', backgroundPositionLeft.value+1700);
            event.target.set({
                //left: backgroundPositionLeft.value / 2 - (event.target.width * event.target.scaleX) / 2,
                left: backgroundPositionLeft.value+1700 - (event.target.width * event.target.scaleX) / 2,
            })//.setCoords();

            canvas.add(line9);

            document.addEventListener("mouseup", () => {
                canvas.remove(line9);
            });

        } else {
            canvas.remove(line9);
        }

        var clickElementHorizontalCenter = event.target?.left + (event.target?.width/2)
        var clickElementVerticalCenter = event.target?.top + (event.target?.height/2)
        if(event.target?.type === 'i-text'){
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
})

</script>

<style>
.canvas__wrapper{
    width: 100%;
}

.canvas {
    top: -50px !important;
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
}

.v3-emoji-picker {
    position: absolute;
    top: 50px;
    left: v-bind((innerWidth/2));
    /* width: 100%; */
}

.colorpicker {
    position: absolute;
    top: 50px;
    width: 25%;
    min-width: 200px;
    visibility: v-bind(colorpickerVisible);
}

.textcolorpicker {
    position: absolute;
    top: 50px;
    left: v-bind((innerWidth/2));
    visibility: v-bind(textcolorpickerVisible);
}

.vc-chrome-fields-wrap, .vc-chrome-alpha-wrap { /* Hide Hex and alpha selector color picker */
    display: none;
}

.vc-chrome-hue-wrap {
    margin-top: 11px;
}

.color-green {
    background-color: #78b657;
}
.color-blue {
    background-color: rgb(56, 107, 147);
}
</style>