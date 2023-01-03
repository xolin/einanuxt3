<template>
    <!-- <section class="fixed pl-200"> -->
    <LayersList v-if="layersListVisible" :layers="layersList"></LayersList>
    <section v-resize="resize" ref="canvasWrapper" class="canvas__wrapper fixed top-12 " @click="canvasEv()">
        <canvas class="canvas" ref="canvasEl"></canvas>
        <div class="options--top-left cursor-pointer" @click="generatePrints()" >
            <ArrowDownCircleIcon class="h-10 w-10 text-black-500" />
        </div>
        <div class="options--top">
            <!-- <input type="range" id="zoom" name="zoom" value="0.065" min="0.045" max="0.075" step="0.010" @change="changeZoom(value)"> -->
            <button type="button" id="addZoom" @click="moreZoomButton" hidden>ZoomIn</button>
            <button type="button" id="removeZoom" @click="lessZoomButton" hidden> ZoomOut </button>
            
            <div class="inline-block colorPickerWrapper colorPickerBgDeck" >
                
                <svg src="/img/icon/insta-board-icon-skateboard-deck-background-color.svg" class="btn-add-color"> </svg>
                <input type="color" value="#6697CC" @input="bgDeckColorChange($event)" />
            </div>
            <div @click="$refs.file.click()" id="btn-add-picture">
                
                <!-- <svg src="./img/icon/insta-board-icon-add-skateboard-picture.svg" style="width: 37px; height: 37px;"> </svg> -->

                <input type="file" ref="file"  accept="image/*;capture=camera" @change="uploadFile($event)" class="hidden" />
            </div>
            <div class="rounded--btn" @click="addText()">
                txt
            </div>
            <div class="rounded--btn" @click="toogleEmoji()">
                ;)
                <EmojiPicker :native="true" 
                    @select="onSelectEmoji" 
                    v-if="emojiVisible" 
                    hide-search="true" 
                    hide-group-icons="true" 
                    hide-group-names="true" 
                    disable-sticky-group-names="true"
                    disable-skin-tones="true" 
                />
            </div>
        </div>
        <div hidden>
            <!-- Hidden until release -->
            <button type="button" id="undo" ref="undoButton" v-bind="undoDisabled" @click="undo()">Undo</button>
            <button type="button" id="redo" ref="redoButton" v-bind="redoDisabled" @click="redo()">Redo</button>
        </div>
        <div class="options--top-right cursor-pointer" @click="toggleLayersList()" v-if="layersList.length>0">
            <Bars4Icon class="h-8 w-8 text-black-500"/>
        </div>
        <div class="textedit--top">
            <div class="inline-block colorPickerWrapper">
                <input type="color" @input="fontColorChange($event)" />
            </div>
        </div>
        <div class="textedit--bottom ">
            <fontfamilytool
                v-for="fontFamily in fontFamilyAvailable"
                :font="fontFamily" 
                :key="fontFamily"
            ></fontfamilytool>
        </div>
    </section>
    <!-- <section class="prints">
        <b>Prints</b>
        <span v-for="print in prints" :key="print.id">
            <img :src="print.src">
        </span>
    </section> -->
</template>
<script setup>
import { fabric } from 'fabric-with-gestures-notupdated';
import { ref, shallowRef, onMounted } from 'vue';
import { Bars4Icon, ArrowDownCircleIcon } from '@heroicons/vue/20/solid'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const canvasWrapper = ref(null);
const canvasEl = ref(null);
let canvas = null;
const isMobileDevice = ref(null);

let prints = ref([]);
let printsCount = ref(0);

const img = ref('');

const optionsTopVisible = ref('visible')
const optionsTopOpacity = ref(1);
const optionsTopZindex = ref(10);

const layersList = shallowRef([])
const layersListVisible = ref(false)

const emojiVisible = ref(false)

const bgDeckColor = ref('#6697CC') // Old value: #3f75826b
const backgroundPositionLeft = ref(2650)
const backgroundScale = ref(74500)
const deckBackgroundWidth = ref(2833)
const deckBackgroundHeight = ref(10119)

const popoverLeft = ref('0px');
const popoverTop = ref('0px');
const popoverVisible = ref('hidden')
const popoverOpacity = ref(0);
const popoverZindex = ref(-1);
const popoverTransform = ref('translate(0, 10px);')
const popoverTransition = ref('all 0 ease 0')

const fontBoldCheckbox = ref(null)
const fontItalicCheckbox = ref(null)
const fontUnderlineCheckbox = ref(null)

const selectedObject = ref(null)
const lastSelectedObject = ref(null)

const bin = ref(null)

const fontSizeRange = ref([10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60]);
const fontFamilyAvailable = ref(['Times New Roman', 'Arial', 'Geneva', 'Courier', 'Helvetica', 'Avenir']);

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
            redoButton.disabled= "disabled";
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
                    undoButton.disabled= "disabled";
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
            redoButton.disabled= "disabled";
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
            redoButton.disabled= "disabled";
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
            
            const photoUrl = URL.createObjectURL(input.files[0]);

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
            optionsTopOpacity.value = 0
            optionsTopZindex.value = -1
        }
    }else {
        popoverVisible.value = 'hidden'
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
    console.log('vaaaaa', value);
    if(value !== undefined) {
        canvas.setZoom(value)
        canvas.renderAll();
    }
}

function addText() {
    const txt = new fabric.IText('Tu texto', {id: 'txt' + Math.random().toString(16).slice(2), left: backgroundPositionLeft.value+600, top: 4500, fontSize: 600, fontFamily: 'Arial', fontWeight: 'normal', fill: '#000000', opacity: 1 });
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
    new fabric.Image.fromURL('../img/bin.png', function(img) {
        // canvas.bringToFront(img);
         img.moveTo(6)
        img.scaleToHeight(backgroundScale.value, false)
        bin.value = img;
        canvas.add(img);
    }, {
        id: 'bin',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: true,
        hoverCursor: 'default',
        top: 8050,
        left: backgroundPositionLeft.value+700,
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
    // const selectedObject = selectObjectFromList(id)
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

function fontsizeChange(event) {
    canvas.getActiveObject().fontSize = event.target.value;
    canvas.renderAll();
}

function onSelectEmoji(emoji) {
    const smiley = new fabric.IText(emoji.i, {id: 'smiley' + Math.random().toString(16).slice(2), left: backgroundPositionLeft.value+600, top: 4500, fontSize: 600, opacity: 1, type: 'smiley' });
    canvas.add(smiley);
    canvas.moveTo(smiley, 4)
    canvas.renderAll();
    updateLayerList()
}

function bgDeckColorChange(event) {
    canvas.getObjects().forEach(function(o){
        if(o.id == 'deckcolor'){
            o.set('fill', event.target.value)
        }
    })
    canvas.renderAll();
}

function fontColorChange(event) {
    canvas.getActiveObject().set('fill', event.target.value);
    canvas.renderAll();
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
      canvas.renderAll();
    };
  }
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
    
    
    optionsTopVisible.value = 'hidden'
    optionsTopOpacity.value = 0
    optionsTopZindex.value = -1
}

function showGeneralOptions() {
    popoverVisible.value = 'hidden'
    optionsTopVisible.value = 'visible'
    optionsTopOpacity.value = 1
    optionsTopZindex.value = 10
}

function generatePrints(){
    canvas.discardActiveObject().renderAll()
    hideBin()
    
    const newCanvas = document.createElement('canvas');
    newCanvas.width = deckBackgroundWidth.value;
    newCanvas.height = deckBackgroundHeight.value;
    const newCanvasCtx = newCanvas.getContext('2d');
    
    canvas.setZoom(1)
    canvas.width = 10000// deckBackgroundWidth.value // CHANGE THIS TO THE SIMULATED CANVAS SIZE TO GET THE FUlL IMAGE SIZE
    canvas.height = deckBackgroundHeight.value
    
        
    const canvasBase = canvas.toDataURL('image/jpeg')
        
    canvas.setZoom(0.065)
    resize()
    const imgCanvasBase = document.createElement("img");
    imgCanvasBase.width = '10000px' // deckBackgroundWidth.value
    imgCanvasBase.height = deckBackgroundHeight.value
    imgCanvasBase.src = canvasBase;
    imgCanvasBase.onload = function() {
        imgCanvasBase.decode()
        .then(() => {
            document.body.appendChild(imgCanvasBase)
            newCanvasCtx.drawImage(imgCanvasBase, backgroundPositionLeft.value+280, 0, deckBackgroundWidth.value, deckBackgroundHeight.value, 0, 0, deckBackgroundWidth.value, deckBackgroundHeight.value);
            setTimeout(() => {
                const a = document.createElement("a");
                const newCanvasJPG = newCanvas.toDataURL('image/jpeg')
                setTimeout(() => {
                    a.href = newCanvasJPG
                    a.download = "Print.jpg";
                    a.click();
                }, 10);    
                document.body.removeChild(imgCanvasBase)
            }, 10);
        })
        .catch((encodingError) => {
            console.log('encodingError', encodingError);
        })
    }
    

    // prints.value.unshift({id: printsCount.value ,src: newCanvas.toDataURL('image/png')})
    // printsCount.value++;
    // newCanvas = null
}

function setBackground() {
    const imge = new fabric.Image.fromURL('./img/maka-deck-template-svg.png', function(img) {
        //img.scale(1)
        canvas.bringToFront(img);
        img.moveTo(6)
        img.scaleToHeight(backgroundScale.value, false)
        canvas.add(img);
    }, {
        id: 'background',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        top: 0,
        left: backgroundPositionLeft.value,
        //left: canvas.getWidth()/2,
        width: 1417,
        height: 5060,
    })
}

function setDeckBackground() {
    const rect = new fabric.Rect({ 
        top: 0, 
        left: backgroundPositionLeft.value + 350,
        width: deckBackgroundWidth.value,
        height: deckBackgroundHeight.value,
        fill: bgDeckColor.value,
        id: 'deckcolor',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
    })
    // canvas.sendToBack(rect)
    canvas.add(rect)
    canvas.moveTo(rect,2);
}

function setOpacityLayer() {
    const rect = new fabric.Rect({
        id: 'opacity1',
        top: 0,
        left: 0,
        width: backgroundPositionLeft.value,
        height: deckBackgroundHeight.value,
        fill: '#b9b5b4',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 0.75
    })
    // canvas.bringToFront(rect)
    canvas.moveTo(rect,1)
    canvas.add(rect)
    // canvas.bringForward(rect)



    const rect2 = new fabric.Rect({
        id: 'opacity2',
        top: 0,
        left: backgroundPositionLeft.value + 3400,
        width: backgroundPositionLeft.value+10000,
        height: deckBackgroundHeight.value,
        fill: '#b9b5b4',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 0.75
    })
    // canvas.bringToFront(rect2)
    canvas.moveTo(rect2,2);
    canvas.add(rect2)

    const rect3 = new fabric.Rect({
        id: 'opacity3',
        top: deckBackgroundHeight.value-10,
        left: 0,
        width: 40000,
        height: deckBackgroundHeight.value,
        fill: '#b9b5b4',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        opacity: 0.75
    })
    // canvas.bringToFront(rect2)
    canvas.moveTo(rect3,3);
    canvas.add(rect3)
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
    
    if(window.innerHeight > 700 &&  window.innerHeight <= 900 && window.innerHeight > 650){
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
    
    var line9 = new fabric.Line([
        backgroundPositionLeft.value+1700 , deckBackgroundHeight.value,
        backgroundPositionLeft.value+1700 , 10 //backgroundPositionLeft.value
    ], {
        strokeDashArray: [50, 50],
        stroke: 'red',
    })

    line9.selectable = false;
    line9.evented = false;
    var confirmIconCode = "data:image/png;base64,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";

    const confirmIcon = document.createElement("img");
    confirmIcon.src = confirmIconCode
    //confirmIcon.src = './img/icon/Eo_circle_green_checkmark.svg'

    function renderConfirmIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(confirmIcon, -size/2, -size/2, size, size);
        ctx.restore();
    }
    
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: 0.5,
        offsetY: -20,
        cursorStyle: 'pointer',
        mouseUpHandler: confirmPostion,
        render: renderConfirmIcon,
        cornerSize: 32
    });
   

    canvas.on('selection:created', function(event) {
        showGeneralOptions()
        selectedObject.value = canvas.getActiveObject().get('id')
        if(event.selected[0].type === 'i-text') {
            positionBtn(event.selected[0])
        }
    })
    
    canvas.on('selection:updated', function(event) {
        showGeneralOptions()
        selectedObject.value = canvas.getActiveObject().get('id')
        if(event.selected[0].type === 'i-text') {
            positionBtn(event.selected[0])
        }
    })

    canvas.on('selection:cleared', function() {
        if(lastSelectedObject.value){
            lastSelectedObject.value.opacity = 1
        }
        hideBin()
    })

    canvas.on('touch:gesture', function(event) {
        if(lastSelectedObject.value && event.target !== lastSelectedObject.value) {
            lastSelectedObject.value.opacity = 1
        }
    })
    canvas.on('mouse:down', function(event) {
        if(lastSelectedObject.value && event.target !== lastSelectedObject.value) {
            lastSelectedObject.value.opacity = 1
        }
        
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
    })

    canvas.on('object:modified', function(event) {
        updateCanvasState();
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
            
            event.target.set({
                //left: backgroundPositionLeft.value / 2 - (event.target.width * event.target.scaleX) / 2,
                left: backgroundPositionLeft.value+1700 - (event.target.width * event.target.scaleX) / 2,
            }).setCoords();

            canvas.add(line9);

            document.addEventListener("mouseup", () => {
                canvas.remove(line9);
            });

        } else {
            canvas.remove(line9);
        }

        var clickElementTop = event.target?.top + object.height/2
        var clickElementLeft = event.target?.left + object.width/2
        if(event.target?.type === 'i-text'){
            if (clickElementLeft > backgroundPositionLeft.value+700 && clickElementLeft < (backgroundPositionLeft.value+700 + 8000) && clickElementTop > 8050 && clickElementTop < (10050 + 80)) {
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
        var clickElementTop = event.target?.top
        var clickElementLeft = event.target?.left
        
        if (clickElementLeft > backgroundPositionLeft.value+700 && clickElementLeft < (backgroundPositionLeft.value+700 + 8000) && clickElementTop > 8050 && clickElementTop < (10050 + 80)) {
            canvas.getObjects().forEach(function(o) {
                if(o.id == selectedObject.value) {
                    canvas.remove(o);
                    updateLayerList()
                }
            })
        }
    });

    canvas.on('text:editing:entered', function(event) {
        if(event.target.type !== 'smiley'){
            showTextOptions()
        }
        clearText(event)
    })
})

</script>

<style>
.canvas__wrapper{
    width: 100%;
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
    justify-content: center;
    background-color: #b9b5b4;
}

.options--top-left {
    opacity: v-bind(optionsTopOpacity);
    visibility: v-bind(optionsTopVisible);
    z-index: v-bind(optionsTopZindex+10);
    position: absolute;
    width: 10%;
    height: 50px;
    top: -50px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content:center;
    background-color: #b9b5b4;
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
    width: 100%;
    height: 50px;
    top: -50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #b9b5b4;
}

.textedit--bottom {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 100%;
    height: 40px;
    top: 630px;
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

#btn-add-picture {
    width: 37px;
    height: 37px;
    background: url('./img/icon/insta-board-icon-add-skateboard-picture.svg');    
}

.rounded--btn {
   background: #000; 
   color: #fff;
   border-radius: 50%;
   width: 37px;
   height: 37px;
   text-align: center;
   padding-top: 5px;
   margin-right: 5px;
   margin-left: 5px;
   cursor: pointer;
}
.v3-emoji-picker {
    position: absolute;
    top: 50px;
    left: 0px;
    width: 100%;
} 
</style>