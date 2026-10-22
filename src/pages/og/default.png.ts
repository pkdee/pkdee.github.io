import type { APIRoute } from 'astro';
import { renderDefaultOgImage } from '../../lib/og-image';

// 기본 공유 이미지. 빌드할 때 dist/og/default.png로 한 번 만든다(DESIGN.md #8.16).
export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('astro.config.mjs의 site가 있어야 공유 이미지를 만들 수 있다.');
  const png = await renderDefaultOgImage(site);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
