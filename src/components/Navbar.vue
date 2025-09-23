<script setup lang="ts">
  import Button from './ui/Button.vue';
  import StarIcon from '@/assets/icons/star.svg';
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Button variant="secondary">
      <StarIcon />
    </Button>

    <h1 class="text-xl font-bold">Dot Dash</h1>

    <Button variant="secondary">
      <StarIcon />
    </Button>
  </div>
</template>