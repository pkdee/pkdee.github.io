import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { assertUniqueEntries } from './lib/content-integrity';
import { SLUG_PATTERN } from './lib/content-patterns';
import { TAG_NAMES } from './lib/tags';

const BLOG_DIR = './src/content/blog';

// slug, contentId가 글 사이에서 겹치면 빌드를 멈춘다(ARCHITECTURE.md #6.4).
assertUniqueEntries(BLOG_DIR);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: BLOG_DIR }),
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
        // 태그 목록(src/lib/tags.ts)에 있는 이름만 받는다(ARCHITECTURE.md #6.4).
        tags: z
          .array(
            z.enum(TAG_NAMES, {
              error: (issue) =>
                `태그 목록(src/lib/tags.ts)에 없는 태그 "${String(issue.input)}"이다. 목록에 먼저 추가한다.`,
            }),
          )
          .default([]),
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
