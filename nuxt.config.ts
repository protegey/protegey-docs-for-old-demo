// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    extends: ["docus"],

    srcDir: "app/",

    compatibilityDate: "2024-11-01",

    telemetry: false,

    modules: ["@nuxt/content"],

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
                        "Protegey - Fraud Intelligence Platform Documentation",
                },
            ],
        },
    },
});
