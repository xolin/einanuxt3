<template>
    <div class="h-screen overflow-hidden flex items-center" style="background: #edf2f7;">
        <Sidebar />
        <div class="ml-auto mb-6 lg:w-[75%] md:w-9/12 xl:w-[80%] 2xl:w-[85%]">
            <div class="px-6 pt-6 2xl:container">
                <div class="grid gap-6 md:grid-cols-8 lg:grid-cols-3">
                    <div class="md:col-span-2 lg:col-span-3" >
                        <div class="h-full py-8 px-6 space-y-6 rounded-xl border border-gray-200 bg-white">
                            <Nuxt />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>