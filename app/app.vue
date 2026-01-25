<script setup lang="ts">
import { computed, provide, onMounted } from 'vue'
import { useRoute, useRouter, navigateTo, useRuntimeConfig, useAsyncData, useLazyAsyncData } from '#app'
import { useHead, useSeoMeta } from '#imports'
import type { ContentNavigationItem } from '@nuxt/content'
import * as nuxtUiLocales from '@nuxt/ui/locale'
import { useAppConfig } from 'nuxt/app'

const { seo } = useAppConfig()
const site = useSiteConfig()
const { locale, locales, isEnabled, switchLocalePath } = useDocusI18n()
const {
    canAccessPartnerDocs,
    isInternal
} = useAuth()

const nuxtUiLocale = computed(() => nuxtUiLocales[locale.value as keyof typeof nuxtUiLocales] || nuxtUiLocales.en)
const lang = computed(() => nuxtUiLocale.value.code)
const dir = computed(() => nuxtUiLocale.value.dir)

useHead({
    meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
        { rel: 'icon', href: '/favicon.ico' },
    ],
    htmlAttrs: {
        lang,
        dir,
    },
})

useSeoMeta({
    titleTemplate: seo.titleTemplate,
    title: seo.title,
    description: seo.description,
    ogSiteName: site.name,
    twitterCard: 'summary_large_image',
})

// Helper to check if path matches a prefix, accounting for locales
const matchesPath = (path: string, prefix: string) => {
    const localesPrefixes = ['en', 'fr', 'ar']
    const cleanPath = path.replace(new RegExp(`^/(${localesPrefixes.join('|')})`), '')
    return cleanPath.startsWith(prefix)
}

if (isEnabled.value) {
    const route = useRoute()
    const defaultLocale = useRuntimeConfig().public.i18n.defaultLocale!
    onMounted(() => {
        const currentLocale = route.path.split('/')[1]
        if (!locales.some(locale => locale.code === currentLocale)) {
            return navigateTo(switchLocalePath(defaultLocale) as string)
        }
    })
}

const { data: navigation } = await useAsyncData(() => `navigation_${locale.value}`, async () => {
    const collectionName = `docs_${locale.value}`
    const nav = await queryCollectionNavigation(collectionName as any)
    return nav
}, {
    transform: (data: ContentNavigationItem[]) => {
        if (!data) return []
        // With docs_en, the root is usually /en
        const rootResult = data.find(item => item.path === `/${locale.value}`)?.children ||
            data.find(item => item.path === locale.value)?.children ||
            data || []
        return rootResult
    },
    watch: [locale],
})

const { data: files } = useLazyAsyncData(`search_${locale.value}`, () => {
    const collectionName = `docs_${locale.value}`
    return queryCollectionSearchSections(collectionName as any)
}, {
    server: false,
    watch: [locale],
})

// Filter search sections based on user permissions
const filteredFiles = computed(() => {
    if (!files.value) return []

    return files.value.filter((file: any) => {
        const path = file.id || file.path || file._path || ''
        if (matchesPath(path, '/partners') && !canAccessPartnerDocs.value) return false
        if (matchesPath(path, '/internal') && !isInternal.value) return false
        return true
    })
})

provide('navigation', navigation)
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
