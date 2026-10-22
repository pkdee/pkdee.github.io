import type { APIRoute } from 'astro';

// 모든 검색엔진에 전체 공개 페이지를 허용하고 Sitemap 주소를 알린다(TECH.md #6.7).
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs의 site가 없어 Sitemap 주소를 만들 수 없다.');
  const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site)}`, ''];
  return new Response(body.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
