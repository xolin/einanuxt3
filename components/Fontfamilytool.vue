<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Caveat|Sevillana|Moon+Dance|Anton|Pacifico|Exo+2|Crimson+Text">
    <span>
        <div class="button-font" @click="emitFontChange(font)">Aa</div>
    </span>
</template>

<script setup>
const { $bus } = useNuxtApp();

defineProps({
    font: String
})

function emitFontChange(font) {
    $bus.$emit('fontfamilyChange', font);
    console.log('font:::', font);
}

</script>

<style scoped>
.button-font {
    font-family: v-bind(font);
    font-size: 19px;
    width: 34px;
    height: 34px;
    background: rgba(38, 37, 37, 0.82); 
    border-radius: 50%;
    color: #fff;
    text-align: center;
    padding-top: 2px;
    margin-right: 10px;
    cursor: pointer;
}
</style>