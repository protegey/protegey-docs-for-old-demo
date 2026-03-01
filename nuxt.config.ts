import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  extends: ["docus"],

  /* -------------------------------------------------
   * App Structure
   * ------------------------------------------------- */
  compatibilityDate: "2024-11-01",
  telemetry: false,

  /* -------------------------------------------------
   * Modules
   * ------------------------------------------------- */
  modules: ["@nuxtjs/i18n"],

  /* -------------------------------------------------
   * Internationalization
   * ------------------------------------------------- */
  i18n: {
    langDir: "../i18n/locales",
    locales: [
      { code: "en", name: "English", file: "en.json", language: "en-US" },
      { code: "fr", name: "Français", file: "fr.json", language: "fr-FR" },
      { code: "ar", name: "العربية", file: "ar.json", language: "ar-EG" },
    ],
    defaultLocale: "en",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  /* -------------------------------------------------
   * Nuxt Content
   * ------------------------------------------------- */
  content: {
    locales: ["en", "fr", "ar"],
    defaultLocale: "en",
    documentDriven: true,
    trailingSlash: true,
  },

  /* -------------------------------------------------
   * Runtime Config
   * ------------------------------------------------- */
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000",
    },
  },

  /* -------------------------------------------------
   * Global Head
   * ------------------------------------------------- */
  app: {
    head: {
      title: "Protegey Documentation",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "description",
          content:
            "Protegey - Real-time Fraud Intelligence for Modern Infrastructure.",
        },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicon-96x96.png",
        },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },

  /* -------------------------------------------------
   * Future Compatibility
   * ------------------------------------------------- */
  future: {
    compatibilityVersion: 4,
  },
});
