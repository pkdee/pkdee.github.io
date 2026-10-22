import type { MarkdownHeading } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

// 블로그 목록과 태그 페이지가 함께 쓰는 페이지 크기(DESIGN.md #8.10)
export const POSTS_PER_PAGE = 6;

/** 공개 게시물만 게시일 최신순으로 돌려준다. 초안은 운영 빌드에서 뺀다(ARCHITECTURE.md #6.5). */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(post: BlogPost): string {
  return `/blog/${post.id}/`;
}

/** 목차에 넣을 제목(h2, h3). 각주 제목은 뺀다(TECH.md #6.5). */
export function tocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  return headings.filter(
    (heading) => (heading.depth === 2 || heading.depth === 3) && heading.slug !== 'footnote-label',
  );
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
