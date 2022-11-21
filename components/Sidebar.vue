<template>
    <aside class="ml-[-100%] fixed z-10 top-0 pb-3 px-0 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-3/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
        <div>
            <div class="-mx-6 px-10 py-4">
                <a href="#" title="home">
                    Logo
                </a>
            </div>
            <div class="flex h-24 w-full justify-center bg-gray-100">
                <input type="file" @change="uploadFile" />
            </div>
            <div class="flex h-24 w-full justify-center bg-gray-100">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="generatePrintsEmit">generatePrints</button>
            </div>
        </div>


        <div>

            <Listbox as="div" v-model="selected">
                <ListboxLabel class="block text-sm font-medium text-gray-700">Assigned to</ListboxLabel>
                <div class="relative mt-1">
                <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                    <span class="flex items-center">
                    <img :src="selected.avatar" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                    <span class="ml-3 block truncate">{{ selected.name }}</span>
                    </span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                </ListboxButton>

                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                    <ListboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption as="template" v-for="person in people" :key="person.id" :value="person" v-slot="{ active, selected }">
                        <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                        <div class="flex items-center">
                            <img :src="person.avatar" alt="" class="h-6 w-6 flex-shrink-0 rounded-full" />
                            <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ person.name }}</span>
                        </div>

                        <span v-if="selected" :class="[active ? 'text-white' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                        </li>
                    </ListboxOption>
                    </ListboxOptions>
                </transition>
                </div>
            </Listbox>

        </div>

        <div class="px-6 -mx-6 pt-4 flex justify-between items-center border-t">
            <button class="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span class="group-hover:text-gray-700">Logout</span>
            </button>
        </div>
    </aside>
</template>

<script>
import { ref } from 'vue'

export default {
    name: "Sidebar",
    setup(props, { emit }) {
        const { $bus } = useNuxtApp();
        const fileInput = ref(null);
        const img = ref({});

        function uploadFile(event) {
            const input = event.target;
            if(input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    img.value.url = e.target.result;
                    img.onload = function () {
                        data.height = this.height;
                        data.width = this.width;
                        
                        $bus.$emit('uploadImage', img.value, width, height)
                    }
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function generatePrintsEmit() {
            $bus.$emit('generatePrint');
        }

        return {
            fileInput, img,
            uploadFile, generatePrintsEmit
        }
    }
}
</script>