<template>
  <button
    v-bind="$attrs"
    class="cursor-pointer relative active:scale-95 mb-1 mr-1 disabled:cursor-not-allowed disabled:select-none disabled:active:scale-100 disabled:opacity-50">
    <div :class="[
      'relative z-2 text-white border-2 border-black rounded-lg [&>svg]:size-6 flex items-center justify-center',
      extraClass,
      {
        'bg-primary': variant === 'primary',
        'bg-secondary': variant === 'secondary'
      },
      {
        'px-2.5 py-1.5 text-sm gap-2': size === 'sm',
        'px-5 py-3 text-2xl gap-2.5': size === 'lg',
        'w-[68px] h-[52px] text-2xl': size === 'icon',
        'w-[36px] h-[36px] text-2xl': size === 'sm-icon'
      }
    ]">

      <slot />
    </div>

    <div class="bg-black z-1 size-full rounded-lg absolute -bottom-1 -right-1"></div>
  </button>
</template>

<script setup lang="ts">
import clsx from 'clsx';

interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'lg' | 'icon' | 'sm-icon'
  extraClass?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'lg',
  extraClass: ''
})
</script>
