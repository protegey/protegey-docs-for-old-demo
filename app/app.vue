<script setup lang="ts">
import { computed, provide } from "vue";
import type { ContentNavigationItem } from "@nuxt/content";
import * as nuxtUiLocales from "@nuxt/ui/locale";

const appConfig = useAppConfig() as any;
const { locale, locales } = useI18n();
const { canAccessPartnerDocs, isInternal } = useAuth();

const nuxtUiLocale = computed(
  () =>
    nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] ||
    nuxtUiLocales.en,
);
const lang = computed(() => nuxtUiLocale.value.code);
const dir = computed(() => nuxtUiLocale.value.dir);

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang,
    dir,
  },
});

useSeoMeta({
  titleTemplate: appConfig.seo?.titleTemplate,
  title: appConfig.seo?.title,
  description: appConfig.seo?.description,
  ogSiteName: appConfig.title,
  twitterCard: "summary_large_image",
});

// Helper to check if path matches a prefix, accounting for locales
const matchesPath = (path: string, prefix: string) => {
  const localePrefixes = (locales.value || []).map((l: any) => l.code);
  const cleanPath = path.replace(
    new RegExp(`^/(${localePrefixes.join("|")})`),
    "",
  );
  return cleanPath.startsWith(prefix);
};

const { data: navigation } = await useAsyncData(
  () => `navigation_${locale.value}`,
  () => queryCollectionNavigation(`docs_${locale.value}` as any),
  {
    transform: (data: ContentNavigationItem[]) => {
      if (!data) return [];
      // Collections are rooted at /<locale>, unwrap that level
      return data.find((item) => item.path === `/${locale.value}`)?.children || data;
    },
    watch: [locale],
  },
);

const { data: files } = useLazyAsyncData(
  () => `search_${locale.value}`,
  async () => {
    const [docs, landing] = await Promise.all([
      queryCollectionSearchSections(`docs_${locale.value}` as any),
      queryCollectionSearchSections(`landing_${locale.value}` as any),
    ]);
    return [...(docs || []), ...(landing || [])];
  },
  {
    server: false,
    watch: [locale],
  },
);

// Filter search sections based on user permissions
const filteredFiles = computed(() => {
  if (!files.value) return [];

  return files.value.filter((file: any) => {
    const path = file.id || file.path || "";
    if (matchesPath(path, "/partners") && !canAccessPartnerDocs.value)
      return false;
    if (matchesPath(path, "/internal") && !isInternal.value) return false;
    return true;
  });
});

provide("navigation", navigation);
</script>

<template>
  <UApp :locale="nuxtUiLocale">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <AppHeader v-if="$route.meta.header !== false" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter v-if="$route.meta.footer !== false" />

    <ClientOnly>
      <LazyUContentSearch :files="filteredFiles" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
