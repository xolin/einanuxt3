<template>
    <!-- <section class="fixed pl-200"> -->
    <section class="fixed top-12 right-48" @click="canvasEv()">
        <canvas class="canvas" width="600" height="660" ref="canvasEl"></canvas>
        <div class="options--top">
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
        <div class="textedit--top">
            <div class="inline-block colorPickerWrapper">
                <input type="color" @input="fontColorChange($event)" />
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-6 h-6">
                <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
            </svg>



        </div>
        <div class="tr">
            <div class="range">
                <input type="range" class="range--input" value="25" min="8" max="50" @input="fontsizeChange($event)"> <!-- oninput="rangeValue.innerText = this.value">> -->
            </div> 
        </div>
        <!-- <div class="popover__content">
            

            <select @input="fontsizeChange($event)">
                <option v-for="el in fontSizeRange" :value="el" :key="el.index"> {{el}}</option>
            </select>
            <select @change="fontfamilyChange($event)">
                <option v-for="el in fontFamilyAvailable" :value="el" :key="el.index">{{el}}</option>
            </select>
            
            <div class="inline-block colorPickerWrapper">
                <input type="color" @input="fontBackgroundColorChange($event)" />
            </div>
            
            <span class="bg-gray-200 hover:bg-gray-100 border-b-4 border-gray-400 hover:border-gray-200 text-black text-center py-1 px-2 font-bold w-6 h-30 pt-0" @click="$refs.fontBoldCheckbox.click()">
                <input ref="fontBoldCheckbox" type="checkbox" name="fontBold" id="fontBold" value="Bold" @change="fontWeightChange($event)" class="hidden">
                <label for="fontBold">
                    <img src="~/assets/icons/svg/bold.svg" width="10" class="inline" />
                </label>
            </span>
            
            <span class="bg-gray-200 hover:bg-gray-100 border-b-4 border-gray-400 hover:border-gray-200 text-black text-center py-1 px-2 font-bold w-6 h-30 pt-0" @click="$refs.fontItalicCheckbox.click()">
                <input ref="fontItalicCheckbox" type="checkbox" name="fontItalic" value="Italic" @input="fontStyleChange($event)" class="hidden">
                <label for="fontItalic">
                    <img src="~/assets/icons/svg/italic.svg" width="10" class="inline" />
                </label>
            </span>

            <span class="bg-gray-200 hover:bg-gray-100 border-b-4 border-gray-400 hover:border-gray-200 text-black text-center py-1 px-2 font-bold w-6 h-30 pt-0" @click="$refs.fontUnderlineCheckbox.click()">
                <input ref="fontUnderlineCheckbox" type="checkbox" name="fontUnderline" value="Underline" @input="fontUnderlineChange($event)" class="hidden">
                <label for="fontUnderline">
                    <img src="~/assets/icons/svg/underline.svg" width="10" class="inline"/>
                </label>
            </span>
                
        </div> -->
        <div class="textedit--bottom ">
            <fontfamilytool
                v-for="fontFamily in fontFamilyAvailable"
                :font="fontFamily" 
                :key="fontFamily"
            ></fontfamilytool>
        </div>

    </section>
    <section class="prints">
        <b>Prints</b>
        <span v-for="print in prints" :key="print.id">
            <img :src="print.src">
        </span>
    </section>
</template>

<script setup>
import { fabric } from 'fabric';
import { ref, onMounted, computed } from 'vue';

const canvasEl = ref(null);
let canvas = null;

let prints = ref([]);
let printsCount = ref(0);

const img = ref('');

const optionsTopVisible = ref('visible')
const optionsTopOpacity = ref(1);
const optionsTopZindex = ref(10);



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

const { $bus } = useNuxtApp();
// $bus.$on('uploadImage', (data) => {
//     addImage(data.url, undefined, undefined, data.width, data.height)
// })

// $bus.$on('addText', () => {
//     addText()
// })

$bus.$on('generatePrint', () =>{
    generatePrints()
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
            
            // const data = {};
            // data.url = img.value;
            // data.width = imageDimensions.width;
            // data.height = imageDimensions.height;
            //$bus.$emit('uploadImage', data) // img.value, data.width, data.height)
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function canvasEv() {
    popoverVisible.value = 'hidden'
    optionsTopVisible.value = 'visible'
    optionsTopOpacity.value = 1
    optionsTopZindex.value = 10
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
    }
    
    // if(canvas.getActiveObject()) {
    //     $bus.$emit('activeObj',canvas.getActiveObject().get('id'));
    // }else{
    //     $bus.$emit('activeObj', 'none');
    // }
}

function addText() {
    const txt = new fabric.IText('Tu texto', { left: 100, top: 100, fontSize: 20, fontFamily: 'Arial', fontWeight: 'normal', fill: '#000000' });
    canvas.add(txt);
    canvas.sendToBack(txt);
}

function addImage(image, top, left, width, height, scale) {
    if(top === undefined) top = 10
    if(left === undefined) left = 150
    if(width === undefined) width = 1700
    if(height === undefined) height = 1400
    if(scale === undefined) scale = 0.2

    new fabric.Image.fromURL(image, function(img) {
        img.scale(scale);
        img.moveTo(1)
        canvas.add(img);
        canvas.sendToBack(img);
        positionBtn(img);
    }, {
        id: Math.random().toString(16).slice(2),
        top: top,
        left: left,
        width: width,  
        height: height,
        multiplier: 2,
        opacity: 1
    })
}


function fontfamilyChange(event) {
    canvas.getActiveObject().fontFamily = event.target.value;
    canvas.renderAll();
}

function fontsizeChange(event) {
    canvas.getActiveObject().fontSize = event.target.value;
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

onMounted(() => {
    canvas = new fabric.Canvas(canvasEl.value);

    // new fabric.Image.fromURL('./img/skatebackground.png', function(img) {
        // img.scale(0.11);
        // canvas.preserveObjectStacking = true;
    new fabric.Image.fromURL('./img/maka-deck-template-svg.png', function(img) {
        img.scale(0.9)
        canvas.bringToFront(img);
        canvas.add(img);
    }, {
        id: 'background',
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        hoverCursor: 'default',
        top: 0,
        left: 220,
        width: 1400,  
        height: 5000,
        multiplier: 2,
    })

    canvas.on('object:moving', function(event) {
        var object = event.target;
        object.opacity = 0.4
        lastSelectedObject.value = object
    })

    canvas.on('selection:cleared', function() {
        lastSelectedObject.value.opacity = 1
        // object = lastSelectedObject.value
        // object.opacity = 1
    })

    canvas.on('selection:updated', function(event) {
        var object = event.target;
        canvas.sendToBack(object);
        
        
        //object.sendToBack();
        console.log("Selected", object);
    });
    // canvas.getActiveObject(0).bringToFront()
    
    //addImage('./b.jpg', 10, 275, 1100, 1410, 0.3)
    
    // canvas.on('mouse:down', (e) => this.mouseDown(e));
    // canvas._onMouseDown('canvas.getActiveObject()', canvas.getActiveObject())
})

</script>

<style>
/* .canvas {
    border: 1px solid grey;
} */

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
    height: 40px;
    top: -43px;
    left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.textedit--top {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 100%;
    height: 40px;
    top: -43px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.textedit--bottom {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 100%;
    height: 40px;
    top: 620px;
    display: flex;
    align-items: center;
    justify-content: center;
    
}





.range {
    /* border: 1px solid red; */
    position: absolute;
    /* width: 10%; */
    height: 400px;
    /* top: -530px; */
    /* -webkit-transform:rotate(90deg);
    -moz-transform:rotate(90deg);
    -o-transform:rotate(90deg); 
     transform:rotate(270deg); */
}

.range--input {
    left: -195px;
    top: 190px;
    width: 400px;
    
    -webkit-transform:rotate(-90deg);
    -moz-transform:rotate(-90deg);
    -o-transform:rotate(-90deg); 
    transform: rotate(-90deg);
}

.tr {
    opacity: v-bind(popoverOpacity);
    visibility: v-bind(popoverVisible);
    z-index: v-bind(popoverZindex);
    position: absolute;
    width: 10%;
    left: 20px;
    height: 400px;
    top: -530px;
    padding-bottom: 21.27%; /* = width / 1.41 */
    position: relative;
    overflow: hidden;
}

.tr:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 400%;
    background: #a09f9f81;
    transform-origin: 87% -81%;
    transform: rotate(2deg);
}


input[type=range] {
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  /* width: 100%; Specific width is required for Firefox. */
  background: transparent; /* Otherwise white in Chrome */
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;

}

input[type=range]:focus {
  outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
}

input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;

  /* Hides the slider so custom styles can be added */
  background: transparent; 
  border-color: transparent;
  color: transparent;
}

.triangle-range-background-slider {
  position: relative;
  display: block;
  margin-top: -27px;
  height: 20px;
  background: url('https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg'); 
  background-size: 100% auto;
  z-index: 1;
}
/* Input to work with triangle */
input[type=range] {
  position: relative;
  z-index: 3;
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

.rounded--btn {
   background: #000; 
   color: #fff;
   border-radius: 50%;
   width: 37px;
   height: 37px;
   text-align: center;
   padding-top: 5px;
   margin-right: 10px;
   cursor: pointer;
}
</style>