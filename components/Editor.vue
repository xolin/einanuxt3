<template>
    <!-- <section class="fixed pl-200"> -->
    <section class="fixed top-12 right-48">
        <canvas class="canvas" width="600" height="600" ref="canvasEl"></canvas>
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
import { ref, onMounted } from 'vue';

const canvasEl = ref(null);
let canvas = null;

let prints = ref([]);
let printsCount = ref(0);

const { $bus } = useNuxtApp();
$bus.$on('uploadImage', (data) => {
    addImage(data.url)
})

$bus.$on('generatePrint', () =>{
    generatePrints()
})


function addImage(img, top, left, width, height, scale) {
    if(top === undefined) top = 200
    if(left === undefined) left = 150
    if(width === undefined) width = 70
    if(height === undefined) height = 50
    if(scale === undefined) scale = 0.2

    new fabric.Image.fromURL(img, function(img) {
        img.scale(scale);
        img.moveTo(0)
        canvas.add(img);
    }, {
        top: top,
        left: left,
        width: width,  
        height: height,
        multiplier: 2
    })
}

function generatePrints(){
    const newCanvas = document.createElement('canvas');
    newCanvas.width = 200;
    newCanvas.height = 600;
    const newCanvasCtx = newCanvas.getContext('2d');
    
    
    const canvasBase = canvasEl.value.toDataURL('image/png')
    const imgCanvasBase = document.createElement("img");
    imgCanvasBase.src = canvasBase;
    
    newCanvasCtx.drawImage(imgCanvasBase, 200, 0, 200, 630, 0, 0, 200, 630);
    imgCanvasBase.width = 200;
    imgCanvasBase.height = 630;
    prints.value.unshift({id: printsCount.value ,src: newCanvas.toDataURL('image/png')})
    printsCount.value++;
    // newCanvas = null
}

onMounted(() => {
    canvas = new fabric.Canvas(canvasEl.value);

    new fabric.Image.fromURL('./img/skatebackground.png', function(img) {
        img.scale(0.11);
        img.bringToFront();
        img.moveTo(1)
        canvas.add(img);
    }, {
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        hoverCursor: 'default',
        top: 10,
        left: 220,
        width: 1400,  
        height: 5000,
        multiplier: 2
    })

     addImage('./b.jpg', 10, 275, 1100, 1410, 0.3)
})

</script>

<style>
.canvas {
    border: 1px solid grey;
}</style>