<script setup lang="ts">
import { useAppConfig } from 'nuxt/app';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const appConfig = useAppConfig() as any
const { t } = useI18n()

const links = computed(() => [
  ...Object.entries(appConfig.socials || {}).map(([key, url]) => ({
    'icon': `i-simple-icons-${key}`,
    'to': url,
    'target': '_blank',
    'aria-label': t('social.link_aria', { key }),
  })),
  appConfig.github && appConfig.github.url && {
    'icon': 'i-simple-icons-github',
    'to': appConfig.github.url,
    'target': '_blank',
    'aria-label': t('social.github_repo'),
  },
].filter(Boolean))
</script>

<template>
  <template v-if="links.length">
    <UButton v-for="(link, index) of links" :key="index" size="sm"
      v-bind="{ color: 'neutral', variant: 'ghost', ...link }" />
  </template>
  <UColorModeButton />
</template>