import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    extends: ['docus'],

    /* -------------------------------------------------
     * App Structure
     * ------------------------------------------------- */
    compatibilityDate: '2024-11-01',
    telemetry: false,

    /* -------------------------------------------------
     * Docus Configuration
     * ------------------------------------------------- */
    docus: {
        title: 'Protegey Documentation',
        description: 'Real-time fraud intelligence for modern infrastructure.',
        url: 'https://docs.protegey.com',
        socials: {
            github: 'protegey',
            twitter: 'protegey',
        },
        header: {
            title: 'Protegey Docs',
            logo: false,
            showLinkIcon: true,
        },
    },

    /* -------------------------------------------------
     * Modules
     * ------------------------------------------------- */
    modules: [
        '@nuxtjs/i18n',
    ],

    /* -------------------------------------------------
     * Internationalization
     * ------------------------------------------------- */
    i18n: {
        langDir: '../i18n/locales',
        locales: [
            { code: 'en', name: 'English', file: 'en.json', language: 'en-US' },
            { code: 'fr', name: 'Français', file: 'fr.json', language: 'fr-FR' },
            { code: 'ar', name: 'العربية', file: 'ar.json', language: 'ar-EG' },
        ],
        defaultLocale: 'en',
        strategy: 'prefix_except_default',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root',
        },
    },

    /* -------------------------------------------------
     * Nuxt Content
     * ------------------------------------------------- */
    content: {
        locales: ['en', 'fr', 'ar'],
        defaultLocale: 'en',
        documentDriven: true,
    },

    /* -------------------------------------------------
     * Canonical Routing Rules
     * ------------------------------------------------- */
    // routeRules: {
    //     // Language roots (NO trailing slash)
    //     '/': { trailingSlash: false },
    //     '/en': { trailingSlash: false },
    //     '/fr': { trailingSlash: false },
    //     '/ar': { trailingSlash: false },
    //
    //     // All docs pages REQUIRE trailing slash
    //     '/en/**': { trailingSlash: true },
    //     '/fr/**': { trailingSlash: true },
    //     '/ar/**': { trailingSlash: true },
    // },

    /* -------------------------------------------------
     * Runtime Config
     * ------------------------------------------------- */
    runtimeConfig: {
        public: {
            apiBase:
                process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000',
        },
    },

    /* -------------------------------------------------
     * Global Head
     * ------------------------------------------------- */
    app: {
        head: {
            title: 'Protegey Documentation',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1',
                },
                {
                    name: 'description',
                    content:
                        'Protegey - Real-time fraud intelligence for modern infrastructure.',
                },
            ],
        },
    },

    /* -------------------------------------------------
     * Future Compatibility
     * ------------------------------------------------- */
    future: {
        compatibilityVersion: 4,
    },
})
