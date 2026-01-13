
<script setup lang="ts">
import appConfig from '../../app.config';
</script>

<!-- Create the AppHeaderLogo.vue component -->
<template>
    <UColorModeImage
      v-if="appConfig.docus?.header?.logo?.dark || appConfig.docus?.header?.logo?.light"
      :light="appConfig.docus?.header?.logo?.light || appConfig.docus?.header?.logo?.dark"
      :dark="appConfig.docus?.header?.logo?.dark || appConfig.docus?.header?.logo?.light"
      :alt="appConfig.docus?.title || appConfig.docus?.header?.title"
      class="h-6 w-auto shrink-0"
    />
    <span v-else>
      {{ appConfig.docus?.title }}
    </span>
  </template>