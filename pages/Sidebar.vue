<template>
    <aside class="ml-[-100%] fixed z-10 top-0 pb-3 px-0 w-full flex flex-col justify-between h-screen border-r bg-white transition duration-300 md:w-3/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
        <div>
            <div class="-mx-6 px-10 py-4">
                <a href="#" title="home">
                    Logo
                </a>
            </div>

            <div class="flex min-h-screen w-full justify-center bg-gray-100">
                <button class="relative h-12 w-48 mt-10 ml-5 overflow-hidden rounded-lg bg-white text-lg shadow">
                    <span class="relative text-black">Upload Photo!</span>
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