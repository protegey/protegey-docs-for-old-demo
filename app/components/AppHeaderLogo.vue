<script setup lang="ts">
import appConfig from '../../app.config';
</script>

<!-- Create the AppHeaderLogo.vue component -->
<template>
  <div class="flex items-center gap-2">
    <img src="/favicon.svg" alt="Protegey" class="h-8 w-auto shrink-0" />
    <span class="font-bold text-lg hidden md:block">{{ $t('navigation.doc_portal_title') }}</span>
  </div>
</template>