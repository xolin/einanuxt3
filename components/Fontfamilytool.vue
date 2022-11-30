<template>
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
}

</script>

<style scoped>
.button-font {
    font-family: v-bind(font);
    font-size: 20px;
    width: 37px;
    height: 37px;
    background: #000;
    border-radius: 50%;
    color: #fff;
    text-align: center;
    padding-top: 2px;
    margin-right: 10px;
}
</style>