<template>
    <div class="button-font">Aa</div>
</template>

<script setup>
defineProps({
    font: String
})
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