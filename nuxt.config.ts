import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: ["docus"],

    docus: {
        title: "Protegey Documentation",
        description: "Real-time fraud intelligence for modern infrastructure.",
        url: "https://docs.protegey.com",
        socials: {
            github: "protegey",
            twitter: "protegey",
        },
        header: {
            title: "Protegey Docs",
            logo: false,
            showLinkIcon: true,
        },
    },

    srcDir: "app/",

    compatibilityDate: "2024-11-01",

    telemetry: false,

    modules: ["@nuxt/content", "@nuxt/i18n"],

    i18n: {
        locales: [
            { code: "en", name: "English", file: "en.json" },
            { code: "fr", name: "Français", file: "fr.json" },
            { code: "ar", name: "العربية", file: "ar.json" },
        ],
        defaultLocale: "fr",
        strategy: "prefix",
    },

    future: {
        compatibilityVersion: 4,
    },

    router: {
        options: {
            strict: true,
        },
    },

    // Disable SSR for protected routes to ensure middleware runs client-side
    routeRules: {
        "/partners/**": { ssr: false },
        "/internal/**": { ssr: false },
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
        },
    },

    app: {
        head: {
            title: "Protegey Documentation",
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                {
                    name: "description",
                    content:
                        "Protegey - Real-time fraud intelligence for modern infrastructure.",
                },
            ],
        },
    },
});
