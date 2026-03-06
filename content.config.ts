import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    products: defineCollection({
      type: 'page',
      source: 'products/**/*.md',
      schema: z.object({
        products: z.array(
          z.object({
            slug: z.string(),
            category: z.string().optional(),
            title: z.object({
              ru: z.string(),
              en: z.string(),
            }),
            description: z.object({
              ru: z.string(),
              en: z.string(),
            }),
            price: z.union([
              z.number(),
              z.object({
                rub: z.number(),
                usd: z.number(),
              }),
            ]),
            image: z.union([z.string(), z.array(z.string()).min(1)]),
            hasPdf: z.boolean().optional(),
            pdfPrice: z.union([
              z.number(),
              z.object({
                rub: z.number(),
                usd: z.number(),
              }),
            ]).optional(),
          }),
        ),
      }),
    }),
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        slug: z.string(),
        title: z.object({
          ru: z.string(),
          en: z.string(),
        }),
        excerpt: z.object({
          ru: z.string(),
          en: z.string(),
        }),
        date: z.string(),
        coverImage: z.string(),
      }),
    }),
  },
})
