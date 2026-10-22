import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/posts';
import { SITE } from '../lib/site';

// RSS(TECH.md #6.7). 공개 글만 쓰고 본문 대신 description 요약을 넣는다.
export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config.mjs의 site가 없어 RSS 링크를 만들 수 없다.');
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    trailingSlash: true,
    customData: '<language>ko-kr</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: [...post.data.tags],
    })),
  });
};
