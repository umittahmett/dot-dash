<script setup lang="ts">
  import Button from './ui/Button.vue';
  import StarIcon from '@/assets/icons/star.svg';
  import CogIcon from '@/assets/icons/cog.svg';
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Button variant="secondary">
      <StarIcon />
    </Button>

    <h1 class="text-xl font-bold">Dot Dash</h1>

    <Button variant="secondary">
      <CogIcon />
    </Button>
  </div>
</template>