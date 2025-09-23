<script setup lang="ts">

import IPhoneFrame from '@/components/IPhoneFrame.vue';
import Navbar from '@/components/Navbar.vue';
import Converter from '@/components/converter.vue';
import { useFileOperations } from '@/composables/useFileOperations';
import clsx from 'clsx';
import { watch } from 'vue';

const { loading } = useFileOperations()

watch(loading, (newLoading) =>{
  console.log(newLoading)
})

</script>

<template>
  <div :class="clsx('flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8', 
  {
    'opacity-50 select-none': loading
  })">
    <IPhoneFrame>
      <div class="space-y-5 w-full max-w-3xl">
        <Navbar />
        <Converter/>
      </div>
    </IPhoneFrame>
  </div>


  <div v-if="loading" class="fixed inset-0 bg-black/60">
    <div class="flex items-center justify-center h-screen">
      <div class="animate-spin rounded-full h-20 w-20 border-b border-t border-white"></div>
    </div>

  </div>
</template>