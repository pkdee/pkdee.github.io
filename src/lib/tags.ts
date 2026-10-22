import { TAG_PATTERN } from './content-patterns';

// 쓸 수 있는 태그 목록(ARCHITECTURE.md #6.4, DESIGN.md #8.6). 글에는 이 목록에 있는 이름만 쓸 수 있다.
// Content Collections 스키마와 Keystatic 편집 화면이 이 목록을 함께 쓰므로 SVG를 import하지 않는다.
// 로고 파일은 tag-logos.ts에 있다. 새 로고는 Figma Logos에서 Brand와 Mono SVG를 받아 함께 추가한다.

export type LogoKey = 'apache-kafka' | 'astro' | 'java' | 'kotlin' | 'mdx' | 'redis' | 'spring';

export interface TagDefinition {
  /** 화면에 그대로 보여 주는 영문 표기 */
  name: string;
  /** Figma Logos의 로고. 없으면 # 아이콘을 쓴다. */
  logo?: LogoKey;
}

export const TAGS = [
  { name: 'Astro', logo: 'astro' },
  { name: 'Concurrency' },
  { name: 'CS' },
  { name: 'Database' },
  { name: 'Guide' },
  { name: 'HTTP' },
  { name: 'Java', logo: 'java' },
  { name: 'JVM' },
  { name: 'Kafka', logo: 'apache-kafka' },
  { name: 'Kotlin', logo: 'kotlin' },
  { name: 'MDX', logo: 'mdx' },
  { name: 'Redis', logo: 'redis' },
  { name: 'Spring', logo: 'spring' },
  { name: 'Web' },
] as const satisfies readonly TagDefinition[];

export type TagName = (typeof TAGS)[number]['name'];

export const TAG_NAMES = TAGS.map((tag) => tag.name) as [TagName, ...TagName[]];

/**
 * 태그 URL slug(TECH.md #6.4). 소문자로 바꾸고 #은 sharp, +는 p로 바꾼다.
 * 공백과 .은 하이픈으로 바꾸고 연속된 하이픈은 하나로 줄인다. 예: C# → csharp, C++ → cpp, Node.js → node-js
 */
export function tagSlug(name: string): string {
  return name
    .toLowerCase()
    .replaceAll('#', 'sharp')
    .replaceAll('+', 'p')
    .replace(/[\s.]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

export function tagUrl(name: string): string {
  return `/tags/${tagSlug(name)}/`;
}

export function findTag(name: string): TagDefinition | undefined {
  return TAGS.find((tag) => tag.name === name);
}

// 목록이 잘못되면 빌드를 멈춘다. 표기가 달라도 slug가 같으면 같은 태그 페이지를 덮어쓰기 때문이다.
const seen = new Map<string, string>();
for (const { name } of TAGS) {
  if (!TAG_PATTERN.test(name)) {
    throw new Error(`태그 "${name}"에 쓸 수 없는 문자가 있다. 영문, 숫자와 공백 . + # - 만 쓴다.`);
  }
  const slug = tagSlug(name);
  const other = seen.get(slug);
  if (other) {
    throw new Error(`태그 "${other}"와 "${name}"의 slug가 "${slug}"로 같다. 표기를 하나로 통일한다.`);
  }
  seen.set(slug, name);
}
