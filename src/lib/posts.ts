import type { MarkdownHeading } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { TagName } from './tags';

export type BlogPost = CollectionEntry<'blog'>;

// 블로그 목록과 태그 페이지가 함께 쓰는 페이지 크기(DESIGN.md #8.10)
export const POSTS_PER_PAGE = 6;

/** 공개 글만 게시일 최신순으로 돌려준다. 초안은 운영 빌드에서 뺀다(ARCHITECTURE.md #6.5). */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post: BlogPost): string {
  return `/blog/${post.id}/`;
}

export interface TagSummary {
  name: TagName;
  count: number;
  /** 이 태그가 붙은 가장 최근 글의 게시일 */
  latest: Date;
}

/** 공개 글에 붙은 태그별 글 수. 글이 없는 태그는 들어가지 않는다. */
export function summarizeTags(posts: BlogPost[]): TagSummary[] {
  const summaries = new Map<TagName, TagSummary>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const summary = summaries.get(name);
      if (!summary) {
        summaries.set(name, { name, count: 1, latest: post.data.pubDate });
        continue;
      }
      summary.count += 1;
      if (post.data.pubDate > summary.latest) summary.latest = post.data.pubDate;
    }
  }
  return [...summaries.values()];
}

/** 글 수가 많은 순, 같으면 최근 글이 있는 순(태그 패널, 주요 태그 줄. DESIGN.md #8.9, #8.14) */
export function byPopularity(a: TagSummary, b: TagSummary): number {
  return b.count - a.count || b.latest.valueOf() - a.latest.valueOf() || byName(a, b);
}

/** 이름순(태그 목록 페이지. DESIGN.md #5.6) */
export function byName(a: TagSummary, b: TagSummary): number {
  return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
}

export function postsWithTag(posts: BlogPost[], name: TagName): BlogPost[] {
  return posts.filter((post) => post.data.tags.includes(name));
}

/** 목차에 넣을 제목(h2, h3). 각주 제목은 뺀다(TECH.md #6.5). */
export function tocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  return headings.filter(
    (heading) => (heading.depth === 2 || heading.depth === 3) && heading.slug !== 'footnote-label',
  );
}

// 읽기 시간 기준(TECH.md #6.5). 한글은 글자, 영어와 숫자는 단어, 코드 블록은 줄, 이미지는 개수로 센다.
const HANGUL_CHARS_PER_MINUTE = 500;
const LATIN_WORDS_PER_MINUTE = 238;
const SECONDS_PER_CODE_LINE = 3;
const CODE_FENCE = /^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm;
const IMAGE = /!\[[^\]]*\]\([^)]*\)|<(?:img|Image|Picture)\b[^>]*>/g;

/** 이미지 n장을 보는 시간(초). 첫 장 12초에서 한 장마다 1초씩 줄고 3초 밑으로 내려가지 않는다. */
function imageSeconds(count: number): number {
  let seconds = 0;
  for (let i = 0; i < count; i += 1) seconds += Math.max(3, 12 - i);
  return seconds;
}

/** 예상 읽기 시간(분). 올림하고 최소 1분이다. */
export function readingMinutes(body: string | undefined): number {
  if (!body) return 1;
  let codeLines = 0;
  const withoutCode = body.replace(CODE_FENCE, (_, _fence, code: string) => {
    codeLines += code.split('\n').filter((line) => line.trim() !== '').length;
    return '';
  });
  const images = withoutCode.match(IMAGE)?.length ?? 0;
  // MDX import·export 줄, 이미지, HTML·컴포넌트 태그, 링크 주소를 빼고 남은 글자를 센다.
  const prose = withoutCode
    .replace(/^(import|export)\s.*$/gm, '')
    .replace(IMAGE, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\]\([^)]*\)/g, ']');
  const hangul = prose.match(/[\p{Script=Hangul}\p{Script=Han}]/gu)?.length ?? 0;
  const latinWords = prose.match(/[A-Za-z0-9]+(?:['.-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const minutes =
    hangul / HANGUL_CHARS_PER_MINUTE +
    latinWords / LATIN_WORDS_PER_MINUTE +
    (codeLines * SECONDS_PER_CODE_LINE + imageSeconds(images)) / 60;
  return Math.max(1, Math.ceil(minutes));
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Asia/Seoul',
});

/** 예: 2026년 10월 20일 */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** `<time datetime>`용 YYYY-MM-DD(서울 기준) */
export function isoDate(date: Date): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(date);
}
