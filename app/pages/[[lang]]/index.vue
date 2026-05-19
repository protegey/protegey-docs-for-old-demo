<script setup lang="ts">
const route = useRoute()
const locale = route.params.lang || 'en'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Protegey Documentation</h1>
      <p class="text-gray-600 mb-4">Language: {{ locale }}</p>
      <p>Welcome to the Protegey documentation.</p>
    </div>
  </div>
</template>