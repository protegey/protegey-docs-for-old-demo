<script setup lang="ts">
const route = useRoute()
const locale = route.params.lang || 'en'
const slug = route.params.slug
</script>

<template>
  <div class="min-h-screen p-8">
    <h1 class="text-2xl font-bold mb-4">Documentation</h1>
    <p class="text-gray-600">Locale: {{ locale }}</p>
    <p class="text-gray-600">Path: {{ slug ? slug.join('/') : 'index' }}</p>
  </div>
</template>