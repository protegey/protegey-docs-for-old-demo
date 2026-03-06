import { defineAppConfig } from "nuxt/app";

export default defineAppConfig({
  docus: {
    title: "Protegey Documentation",
    description: "Real-time fraud intelligence for modern infrastructure.",

    seo: {
      title: "Protegey Documentation Hub",
      description: "Real-time fraud intelligence for modern infrastructure.",
      titleTemplate: "%s · Protegey Docs",
    },

    search: {
      enable: true,
      inAdvanced: true,
    },

    url: "https://docs.protegey.com",

    socials: {
      github: "protegey",
      twitter: "protegey",
    },

    header: {
      title: "Protegey Docs",
      logo: true,
      showLinkIcon: true,
    },

    aside: {
      level: 1,
      collapsed: false,
      exclude: [],
    },

    main: {
      padded: true,
      fluid: true,
    },

    footer: {
      credits: {
        icon: "",
        text: "© 2026 Protegey. All rights reserved.",
        href: "https://protegey.com",
      },
      textLinks: [
        {
          text: "Privacy Policy",
          href: "https://protegey.com/privacy",
          target: "_blank",
        },
        {
          text: "Terms of Service",
          href: "https://protegey.com/terms",
          target: "_blank",
        },
      ],
      iconLinks: [],
    },
  },
});
