import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { assertUniqueEntries } from './lib/content-integrity';
import { MONTH_PATTERN, PROJECT_STATUSES, SLUG_PATTERN } from './lib/content-patterns';
import { TAG_NAMES } from './lib/tags';

const BLOG_DIR = './src/content/blog';
const PROJECTS_DIR = './src/content/projects';

// slug, contentId가 같은 컬렉션 안에서 겹치면 빌드를 멈춘다(ARCHITECTURE.md #6.4).
assertUniqueEntries(BLOG_DIR);
assertUniqueEntries(PROJECTS_DIR);

// 태그 목록(src/lib/tags.ts)에 있는 이름만 받는다(ARCHITECTURE.md #6.4).
const tagName = z.enum(TAG_NAMES, {
  error: (issue) =>
    `태그 목록(src/lib/tags.ts)에 없는 태그 "${String(issue.input)}"이다. 목록에 먼저 추가한다.`,
});

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
        tags: z.array(tagName).default([]),
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

// 프로젝트(ARCHITECTURE.md #6.6). 기간은 연-월이고 endDate가 없으면 진행 중으로 보여 준다.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: PROJECTS_DIR }),
  schema: z
    .object({
      title: z.string().min(1),
      // glob loader가 이 값을 entry id(URL /projects/<slug>/)로 쓴다.
      slug: z.string().regex(SLUG_PATTERN),
      summary: z.string().min(1),
      startDate: z.string().regex(MONTH_PATTERN, { error: '기간은 YYYY-MM 형식으로 쓴다.' }),
      // Keystatic은 빈 칸을 빈 문자열로 저장하므로 진행 중(값 없음)으로 바꾼다.
      endDate: z
        .union([z.literal(''), z.string().regex(MONTH_PATTERN, { error: '기간은 YYYY-MM 형식으로 쓴다.' })])
        .optional()
        .transform((value) => value || undefined),
      role: z.string().min(1),
      // 기술 스택은 태그 목록에서 고른다. 칩이 로고와 태그 페이지 링크를 갖는다.
      stack: z.array(tagName).default([]),
      status: z.enum(PROJECT_STATUSES.map((status) => status.value)),
      githubUrl: z.url({ protocol: /^https?$/ }).optional(),
      serviceUrl: z.url({ protocol: /^https?$/ }).optional(),
      draft: z.boolean(),
    })
    .refine((data) => !data.endDate || data.endDate >= data.startDate, {
      error: '끝(endDate)이 시작(startDate)보다 앞설 수 없다.',
      path: ['endDate'],
    }),
});

export const collections = { blog, projects };
