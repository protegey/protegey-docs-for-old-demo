<script setup lang="ts">
import { computed } from "vue";

const route = useRoute();
const { locale } = useI18n();

const { data: page } = await useAsyncData(
  () => `docs_page_${route.path}`,
  () => queryCollection(`docs_${locale.value}` as any).path(route.path).first(),
  { watch: [() => route.path, locale] },
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const toc = computed(() => page.value?.body?.toc?.links || []);

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
});
</script>

<template>
  <UMain>
    <UContainer>
      <UPage v-if="page">
        <template #left>
          <UPageAside>
            <DocsAsideLeftBody />
          </UPageAside>
        </template>

        <UPageHeader :title="page.title" :description="page.description" />

        <UPageBody>
          <ContentRenderer :value="page" />
        </UPageBody>

        <template v-if="toc.length" #right>
          <UContentToc :links="toc" />
        </template>
      </UPage>
    </UContainer>
  </UMain>
</template>
