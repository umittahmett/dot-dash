<script setup lang="ts">
  // Icons
  import CopyIcon from '@/assets/icons/copy.svg';
  import CopiedIcon from '@/assets/icons/copied.svg';

  // Third Party
  import { useClipboard } from '@vueuse/core'

  // Utils
  import clsx from 'clsx';

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

<template>
  <div class="relative">
    <textarea 
      style="word-wrap: break-word; word-spacing: 6px;"
      :class="[
        'py-2 px-4 font-bold bg-white rounded-lg shadow-[0_4px_20px_0_rgba(154, 154, 154, 0.25)] text-black placeholder:text-black/50 text-lg outline-0 resize-none',
        {
          'bg-gray-100 opacity-60': disabled
        },
        extraClass
      ]"
      rows="8"
      :disabled="disabled"
      v-model="value"
      v-bind="$attrs"
    />

    <button @click="copy(value || '')" :class="clsx('cursor-pointer absolute text-white rounded-xl p-2 right-3 bottom-4 active:scale-95', copied ? 'bg-secondary' : 'bg-primary')">
      <CopyIcon v-show="!copied" class="duration-200" />
      <CopiedIcon v-show="copied"  class="duration-200" />
    </button>
  </div>
</template>