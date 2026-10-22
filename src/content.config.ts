import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SLUG_PATTERN, TAG_PATTERN } from './lib/content-patterns';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        // glob loader가 이 값을 entry id(URL)로 쓴다.
        slug: z.string().regex(SLUG_PATTERN),
        description: z.string().min(1),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        draft: z.boolean(),
        tags: z.array(z.string().regex(TAG_PATTERN)).default([]),
        featured: z.boolean().default(false),
        cover: image().optional(),
        coverAlt: z.string().min(1).optional(),
        canonicalUrl: z.url({ protocol: /^https?$/ }).optional(),
        authorId: z.string().min(1).optional(),
        contentId: z.string().min(1).optional(),
      })
      .refine((data) => !data.cover || data.coverAlt, {
        error: '대표 이미지(cover)를 쓰면 대체 텍스트(coverAlt)도 써야 한다.',
        path: ['coverAlt'],
      }),
});

export const collections = { blog };
