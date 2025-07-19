<template>
    <div class="layers-list px-4 pt-16 items-end">
      <div class="mx-auto w-full max-w-md rounded-l bg-white p-2">
        <ul v-for="layer in layers" :key="layer.id">
            <li @click="selectObjectFromList(layer.id)">{{layer.id}} - {{layer.type}}
                <button v-if="layer.opacity > 0.1" class="icon mr-4 cursor-pointer" @click="toggleHideObjectFromList(layer.id, 'hide')">Hide</button>
                <button v-if="layer.opacity == 0" class="icon mr-4 cursor-pointer" @click="toggleHideObjectFromList(layer.id, 'show')">Show</button>
                <button class="icon mr-4 cursor-pointer right" @click="removeObjectFromList(layer.id)">X</button>
            </li>
        </ul>
      </div>
    </div>
</template>
  
<script setup>
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
  import { ChevronUpIcon } from '@heroicons/vue/20/solid'
  import { ref, shallowRef } from 'vue'
  const { $bus } = useNuxtApp();

const props = defineProps({
    layers: Array
})

function removeObjectFromList(id) {
    $bus.$emit('removeObject', id)
}


function selectObjectFromList(selectedId) {
    $bus.$emit('selectObjectFromList', selectedId)
}

function toggleHideObjectFromList(selectedId, action) {
    $bus.$emit('toggleHideObjectFromList', {selectedId, action})
}
</script>
  
<style scoped>
li {
    border: 1px solid red;        
}
.icon {
    position: relative;
    float: right;
}
.layers-list {
    position: absolute;
    left: 10px;
    z-index: 1;
    width: 90%;
}
</style>