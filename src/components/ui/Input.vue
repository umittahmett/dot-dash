<template>
  <div class="relative">
    <textarea 
      style="word-wrap: break-word; word-spacing: 6px;"
      :class="[
        'py-2 px-4 font-bold bg-white min-h-48 rounded-lg shadow-[0_4px_20px_0_rgba(154, 154, 154, 0.25)] text-black placeholder:text-black/50 text-lg outline-0 resize-none',
        {
          'bg-gray-100 opacity-60': disabled
        },
        extraClass
      ]"
      :disabled="disabled"
      v-model="value"
      v-bind="$attrs"
    />

    <button @click="copy(value || '')" class="absolute right-3 bottom-4 active:scale-95">
      <CopyIcon v-show="!copied" class="duration-200 text-primary" />
      <CopiedIcon v-show="copied"  class="duration-200 text-secondary" />
    </button>
  </div>
</template>

<script setup lang="ts">
  import CopyIcon from '@/assets/icons/copy.svg';
  import CopiedIcon from '@/assets/icons/copied.svg';

  import { useClipboard } from '@vueuse/core'

  const value = defineModel<string>()
  const { copy, copied } = useClipboard()

  defineOptions({
    inheritAttrs: false
  })

  interface Props {
    disabled?: boolean
    extraClass?: string
    type?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    extraClass: '',
    type: '',
  })
</script>
