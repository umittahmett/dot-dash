<script setup lang="ts">
  import Button from './ui/Button.vue';
  import StarIcon from '@/assets/icons/star.svg';
  import CogIcon from '@/assets/icons/cog.svg';
  import XIcon from '@/assets/icons/x.svg'
  import { ref } from 'vue';
  import { onClickOutside } from '@vueuse/core'


  const open = ref(false)
  const menu = ref<HTMLElement | null>(null)

  const toggleMenu = () => {
    open.value = !open.value
  }

  onClickOutside(menu, () => open.value = false)
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Button variant="secondary">
      <StarIcon />
    </Button>

    <h1 class="text-xl font-bold">Dot Dash</h1>

    <Button @click="toggleMenu" variant="secondary">
      <CogIcon />
    </Button>
  </div>

  <Transition appear>
    <div ref="menu" v-if="open" class="absolute top-0 left-0 w-full h-fit rounded-2xl overflow-hidden bg-white z-10 pt-24 pb-8 px-6 shadow-md">
      <div class="flex items-center gap-6 justify-center flex-col text-primary mt-4">
        <div class="flex items-start w-full gap-2 flex-col">
          <p>
            <span class="">Speed:</span>
            <span class="ml-2 text-secondary font-medium">{{ 10 }}%</span>
          </p>

          <input type="range" min="50" max="200" step="10"
            class="w-full h-2 bg-background accent-primary rounded-lg appearance-none cursor-pointer" />
        </div>

        <div class="flex items-start w-full gap-2 flex-col">
          <p>
            <span class="">Tone:</span>
            <span class="ml-2 text-secondary font-medium">{{ 100 }}Hz</span>
          </p>

          <input type="range" min="200" max="1000" step="10"
            class="w-full h-2 bg-background accent-primary rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>

      <div class="mt-4 absolute top-9 px-6 right-0 flex items-center justify-between w-full">
        <span class="text-2xl font-bold text-black/50" >Settings:</span>

        <Button size="sm-icon" @click="toggleMenu" variant="secondary"><XIcon/></Button>
      </div>

    </div>
  </Transition>
</template>