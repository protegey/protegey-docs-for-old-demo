<script setup lang="ts">

const route = useRoute();
const { locale } = useI18n();

const { data: page } = await useAsyncData(
  () => `landing_page_${locale.value}`,
  () =>
    queryCollection(`landing_${locale.value}` as any)
      .path(route.path)
      .first(),
  { watch: [locale] },
);
</script>

<template>
  <UMain>
    <ContentRenderer v-if="page" :value="page" />
  </UMain>
</template>
