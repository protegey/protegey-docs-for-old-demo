import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        docs_en: defineCollection({
            type: 'page',
            source: 'en/**/*.md',
        }),
        docs_fr: defineCollection({
            type: 'page',
            source: 'fr/**/*.md',
        }),
        docs_ar: defineCollection({
            type: 'page',
            source: 'ar/**/*.md',
        }),
        landing_en: defineCollection({
            type: 'page',
            source: 'en/index.md',
        }),
        landing_fr: defineCollection({
            type: 'page',
            source: 'fr/index.md',
        }),
        landing_ar: defineCollection({
            type: 'page',
            source: 'ar/index.md',
        }),
    },
})
