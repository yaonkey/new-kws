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
            categories: z.array(z.string()).optional(),
            labels: z.array(z.string()).optional(),
            is_schema: z.boolean().optional(),
            title: z.object({
              ru: z.string(),
              en: z.string(),
            }),
            description: z.object({
              ru: z.string(),
              en: z.string(),
            }),
            details: z.object({
              ru: z.string().optional(),
              en: z.string().optional(),
            }).optional(),
            price: z.union([
              z.number(),
              z.object({
                rub: z.number().optional(),
                usd: z.number().optional(),
              }).refine((value) => value.rub !== undefined || value.usd !== undefined, {
                message: 'Either rub or usd must be provided',
              }),
            ]),
            salePrice: z.union([
              z.number(),
              z.object({
                rub: z.number().optional(),
                usd: z.number().optional(),
              }).refine((value) => value.rub !== undefined || value.usd !== undefined, {
                message: 'Either rub or usd must be provided',
              }),
            ]).optional(),
            image: z.union([z.string(), z.array(z.string()).min(1)]),
            hasPdf: z.boolean().optional(),
            pdfPrice: z.union([
              z.number(),
              z.object({
                rub: z.number().optional(),
                usd: z.number().optional(),
              }).refine((value) => value.rub !== undefined || value.usd !== undefined, {
                message: 'Either rub or usd must be provided',
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
        locale: z.enum(['ru', 'en']),
        title: z.string(),
        excerpt: z.string(),
        date: z.string(),
        coverImage: z.string(),
      }),
    }),
  },
})
