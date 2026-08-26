<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <UHeader :to="localePath('/')">
    <template #title>
      <AppHeaderLogo />
    </template>

    <template #right>
      <UContentSearchButton />
      <UColorModeButton />
    </template>

    <template #body>
      <AppHeaderBody />
    </template>
  </UHeader>
</template>
