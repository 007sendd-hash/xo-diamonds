import { defineCollection, z } from "astro:content";

const products = defineCollection({
  schema: z.object({
    title: z.string(),
    price: z.number(),
    category: z.enum(["кольца", "серьги", "подвески", "браслеты", "колье"]),
    collection: z.string().optional(),
    isNew: z.boolean().default(false),
    featured: z.boolean().default(false),
    images: z.array(z.string()).default([]),
    material: z.string().optional(),
    carat: z.string().optional(),
    diamondType: z.string().optional(),
    cut: z.string().optional(),
    color: z.string().optional(),
    clarity: z.string().optional(),
    weight: z.string().optional(),
    description: z.string().optional(),
    sizes: z.array(z.number()).default([]),
  }),
});

const collectionsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    products: z.array(z.string()).default([]),
  }),
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    category: z.enum(["guide", "style", "news"]).default("guide"),
  }),
});

export const collections = { products, collections: collectionsCollection, blog };
