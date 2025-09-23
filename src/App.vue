<script setup lang="ts">

import Navbar from '@/components/Navbar.vue';
import Converter from '@/components/converter.vue';
import { useFileOperations } from '@/composables/useFileOperations';
import clsx from 'clsx';

const { loading } = useFileOperations()

</script>

<template>
  <div :class="clsx('flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6 lg:p-8', 
    {
      'opacity-50 select-none': loading
    })"
  >
    <div class="lg:rounded-[36px] lg:bg-black lg:p-5 w-full lg:max-w-7xl">
      <div class="bg-background rounded-2xl p-5">
        <div class="w-full">
          <Navbar />
          <Converter/>
        </div>
      </div>
    </div>
  </div>

  <!-- Spinner -->
  <div v-if="loading" class="fixed inset-0 bg-black/60">
    <div class="flex items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-20 w-20 border-b border-t border-white"></div>
    </div>
  </div>
</template>