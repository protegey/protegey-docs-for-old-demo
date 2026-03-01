import { defineContentConfig, defineCollection, z } from "@nuxt/content";

const schema = z.object({
  links: z
    .array(
      z.object({
        label: z.string(),
        icon: z.string(),
        to: z.string(),
        target: z.string().optional(),
      }),
    )
    .optional(),
});

export default defineContentConfig({
  collections: {
    landing_en: defineCollection({ type: "page", source: "en/index.md" }),
    docs_en: defineCollection({ type: "page", source: "en/**", schema }),

    landing_fr: defineCollection({ type: "page", source: "fr/index.md" }),
    docs_fr: defineCollection({ type: "page", source: "fr/**", schema }),

    landing_ar: defineCollection({ type: "page", source: "ar/index.md" }),
    docs_ar: defineCollection({ type: "page", source: "ar/**", schema }),
  },
});
