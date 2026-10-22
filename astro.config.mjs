// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

// Keystatic 관리 UI는 `npm run cms`(KEYSTATIC=true)일 때만 켠다.
// 서버 라우트를 추가하므로 운영 빌드에 넣으면 어댑터가 없어 빌드가 실패한다.
const cms = process.env.KEYSTATIC === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://pkdee.github.io',

  // Keystatic 관리 UI는 끝 슬래시 없이 API를 호출하므로 CMS 모드에서만 'ignore'로 둔다.
  trailingSlash: cms ? 'ignore' : 'always',

  // 별도 홈 화면이 없으므로 첫 화면은 블로그 목록이다(ARCHITECTURE.md #3.2, TECH.md #7.3).
  redirects: { '/': '/blog/' },

  // 두 라우트가 같은 주소를 만들면 경고 대신 빌드를 실패시킨다(ARCHITECTURE.md #3.2).
  prerenderConflictBehavior: 'error',

  integrations: [react(), mdx(), ...(cms ? [keystatic()] : [])],

  vite: {
    plugins: [tailwindcss()]
  }
});