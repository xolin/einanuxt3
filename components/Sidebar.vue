<template>
    <aside class="ml-[-100%] fixed z-10 top-0 pb-3 px-0 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-3/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
        <div class="bg-gray-100">
            <div class="px-4 py-4 bg-gray-300">
                <a href="#" title="home">
                    Logo
                </a>
            </div>
            <!-- <div class="flex h-24 w-full justify-center mb-3 mt-0 ">
                <div class="bg-blue-100 w-full justify-center mt-0">
                    <ul>
                        
                        {{activeObject.id}}
                    </ul>
                </div>
            </div> -->
            <div class="flex h-12 w-full justify-center my-3">
                <button class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-2 px-4 rounded" @click="$refs.file.click()">
                    Upload image
                </button>
                <input type="file" ref="file" @change="uploadFile" class="hidden" />
            </div>

            <div class="flex h-12 w-full justify-center my-3">
                <button class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-2 px-4 rounded" @click="addText">
                    Add text
                </button>  
            </div>
            <div class="flex h-12 w-full justify-center my-3">
                <button class="bg-blue-200 hover:bg-blue-500 hover:text-white text-blue-500 text-center py-2 px-4 rounded" @click="generatePrintsEmit">
                    generatePrints
                </button>
            </div>
        </div>

        <div>            
            <div class="flex h-12 w-full justify-center my-3">
                <Sizelist />

            </div>
            <div class="flex h-18 w-full justify-center my-20">
                <button class="bg-green-200 hover:bg-green-500 hover:text-white text-green-500 text-center py-3 px-8 rounded font-semibold" @click="generatePrintsEmit">
                    Order
                </button>
            </div>
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

<script lang="js">
import { ref, reactive } from 'vue'
import { CheckIcon } from "@heroicons/vue/24/solid"

export default {
    name: "Sidebar",
    setup(props, { emit }) {
        const { $bus } = useNuxtApp();
        const fileInput = ref(null);
        const img = ref('');
        const textInput = ref('');
        const activeObject = reactive({ id: 'none' });
        
        $bus.$on('activeObj', (data) => {
            activeObject.id = data;
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

                    const data = {};
                    data.url = img.value;
                    data.width = imageDimensions.width;
                    data.height = imageDimensions.height;

                    $bus.$emit('uploadImage', data) // img.value, data.width, data.height)
                }
                reader.readAsDataURL(input.files[0]);
            }
        }

        function addText() {
            $bus.$emit('addText')
        }

        function generatePrintsEmit() {
            $bus.$emit('generatePrint');
        }

        return {
            fileInput, textInput, img, activeObject,
            uploadFile, addText, generatePrintsEmit
        }
    }
}
</script>