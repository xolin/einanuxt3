<template>
    <!-- <section class="fixed pl-200"> -->
    <LayersList v-if="layersListVisible" :layers="layersList"></LayersList>
    <section v-resize="resize" ref="canvasWrapper" class="canvas__wrapper fixed top-12 " @click="canvasEv()">
        <canvas class="canvas" ref="canvasEl"></canvas>
        <div class="options--top">
            <div class="inline-block colorPickerWrapper colorPickerBgDeck">
                <input type="color" @input="bgDeckColorChange($event)" />
            </div>
            <div class="rounded--btn" @click="$refs.file.click()">
                img
                <input type="file" ref="file" @change="uploadFile($event)" class="hidden" />
            </div>
            <div class="rounded--btn" @click="addText()">
                txt
            </div>
            <div class="rounded--btn">    
                ;)
            </div>
        </div>
        <div class="options--top-left cursor-pointer" @click="toggleLayersList()">
            <Bars4Icon class="h-5 w-5 text-purple-500"/>
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
import { Bars4Icon } from '@heroicons/vue/20/solid'

const canvasWrapper = ref(null);
const canvasEl = ref(null);
let canvas = null;

let prints = ref([]);
let printsCount = ref(0);

const img = ref('');

const optionsTopVisible = ref('visible')
const optionsTopOpacity = ref(1);
const optionsTopZindex = ref(10);

const layersList = shallowRef([])
const layersListVisible = ref(false)

const bgDeckColor = ref('#3f75826b')
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

const lastSelectedObject = ref(null)

const fontSizeRange = ref([10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60]);
const fontFamilyAvailable = ref(['Times New Roman', 'Arial', 'Geneva', 'Courier', 'Helvetica', 'Avenir']);

fabric.Canvas.prototype.getAbsoluteCoords = function(object) {
    return {
      left: object.left, // + this._offset.left,
      top: object.top // + this._offset.top
    };
}

const btnWidth = 85, btnHeight = 18;
    
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
            && o.id !== "opacity3") {
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

function addText() {
    const txt = new fabric.IText('Tu texto', {id: 'txt' + Math.random().toString(16).slice(2), left: backgroundPositionLeft.value+600, top: 4500, fontSize: 600, fontFamily: 'Arial', fontWeight: 'normal', fill: '#000000', opacity: 1 });
    // txt.moveTo(2);
    //txt.rotate(-90);
    canvas.add(txt);
    canvas.moveTo(txt, 4)
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
    console.log('selectedObject.opacity', selectedObject.opacity);
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
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 200;
    newCanvas.height = 600;
    const newCanvasCtx = newCanvas.getContext('2d');
    
    
    const canvasBase = canvasEl.value.toDataURL('image/png')
    const imgCanvasBase = document.createElement("img");
    imgCanvasBase.src = canvasBase;
    imgCanvasBase.width = 200;
    imgCanvasBase.height = 630;

    newCanvasCtx.drawImage(imgCanvasBase, 400, 0, 400, 1260, 0, 0, 200, 630);
    
     prints.value.unshift({id: printsCount.value ,src: newCanvas.toDataURL('image/png')})
    printsCount.value++;
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
        width: deckBackgroundWidht.value,
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
    canvas.moveTo(rect,20)
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
    canvas.moveTo(rect2,10);
    canvas.add(rect2)

    const rect3 = new fabric.Rect({
        id: 'opacity3',
        top: deckBackgroundHeight.value-10,
        left: 0,
        width: 20000,
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
    canvas.moveTo(rect3,1);
    canvas.add(rect3)
}

function resize() {
    const ratio = window.innerWidth / window.innerHeight;
    const containerWidth = canvasWrapper.value.clientWidth;
    const scale          = containerWidth / canvas.getWidth();
    const zoom           = canvas.getZoom() * scale;
    
    canvas.setDimensions({width: containerWidth, height: containerWidth / ratio});
    
    if(window.innerHeight > 700 &&  window.innerHeight <= 900){
        canvas.setZoom(0.065)
    }else if(window.innerHeight > 650 &&  window.innerHeight <= 699) {
        canvas.setZoom(0.06)
    }else if(window.innerHeight > 600 &&  window.innerHeight <= 649) {
        canvas.setZoom(0.055)
    }else if(window.innerHeight > 550 &&  window.innerHeight <= 599) {
        canvas.setZoom(0.05)
    }else if(window.innerHeight > 500 &&  window.innerHeight <= 549) {
        canvas.setZoom(0.045)
    }else if(window.innerHeight > 450 &&  window.innerHeight <= 499) {
        canvas.setZoom(0.04)
    }else if(window.innerHeight > 400 &&  window.innerHeight <= 449) {
        canvas.setZoom(0.035)
    }else if(window.innerHeight > 350 &&  window.innerHeight <= 399) {
        canvas.setZoom(0.03)
    }else if(window.innerHeight > 300 &&  window.innerHeight <= 349) {
        canvas.setZoom(0.025)
    }
    const obj = canvas.getObjects();

    backgroundPositionLeft.value = window.innerWidth/2*15 - deckBackgroundWidth.value/2  //window.innerWidth/2 - deckBackgroundWidth.value/2

}
onMounted(() => {
    canvas = new fabric.Canvas(canvasEl.value, {
        width: 500, height:630
    });
    // canvas.setWidth(1417);
    // canvas.setHeight(5060)
    canvas.setZoom(0.06);
    canvas.renderAll()

    resize()
    // window.addEventListener('resize', resize()) // We really want a resize?

    // new fabric.Image.fromURL('./img/skatebackground.png', function(img) {
        // img.scale(0.11);
        // canvas.preserveObjectStacking = true;
    setBackground()
    setDeckBackground()
    setOpacityLayer()

    canvas.on('selection:created', function(event) {
        showGeneralOptions()
        if(event.selected[0].type === 'i-text') {
            positionBtn(event.selected[0])
            showTextOptions()   
        }
    })
    
    canvas.on('selection:updated', function(event) {
        showGeneralOptions()
        if(event.selected[0].type === 'i-text') {
            positionBtn(event.selected[0])
            showTextOptions()   
        }
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
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object
    })

    canvas.on('selection:cleared', function() {
        if(lastSelectedObject.value){
            lastSelectedObject.value.opacity = 1
        }
    })

    canvas.on('selection:updated', function(event) {
        var object = event.target;
        canvas.sendToBack(object);
        
        
        //object.sendToBack();
    });
    // canvas.getActiveObject(0).bringToFront()
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
  width: 150%;
  height: 150%;
  margin: -25%;
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
</style>