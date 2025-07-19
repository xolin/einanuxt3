<template>
    <div>
      <Listbox v-model="selected" as="div" class="p-3">
        <ListboxLabel class="block ml-2 text-sm font-medium text-gray-700">Deck size:</ListboxLabel>
        <div class="relative mt-1">
          <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-0 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
            <span class="flex items-center">
              <span class="ml-3 block truncate">{{ selected.name }}</span>
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <ChevronDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>

          <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ListboxOptions class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <ListboxOption v-for="size in sizes" :key="size.id" v-slot="{ active, selected }" as="template" :value="size">
                <li :class="[active ? 'text-white bg-indigo-600' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                  <div class="flex items-center">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate']">{{ size.name }}</span>
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
  </template>
  <script setup lang="ts">
  import { ChevronDownIcon, CheckIcon } from "@heroicons/vue/24/solid"
  import {
    Listbox, ListboxLabel,ListboxButton, ListboxOptions, ListboxOption
  } from "@headlessui/vue"
  const isOpen = ref(false)
  const sizes = [{
            id: 1,
            name: 'Small size 8"'
        },
        {
            id: 2,
            name: 'Medium size 8,25"'
        },
        {
            id: 3,
            name: 'Big size 8,5"'
        }]
        const selected = ref(sizes[2])
  
  // generic global interaction tracking example
  onMounted(() => {
    document.addEventListener('click', (e) => {
      const el = e.target
      if (!(el instanceof HTMLElement)) {
        return
      }
      if (el.matches('a, button')) {
        console.log('Tracked interaction:', el.textContent)
      }
    })
  })
  
  </script>
  