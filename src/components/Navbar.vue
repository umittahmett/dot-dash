<script setup lang="ts">
  import Button from './ui/Button.vue';
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Button size="icon" variant="secondary">
      <div class="rounded-full size-2 bg-white">

      </div>
    </Button>

    <h1 class="text-2xl font-bold">Dot Dash</h1>

    <Button size="icon" variant="secondary">
      <div class="w-4 h-1 bg-white"></div>
    </Button>
  </div>
</template>