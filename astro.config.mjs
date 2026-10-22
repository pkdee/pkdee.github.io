// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import { satteri } from '@astrojs/markdown-satteri';

import keystatic from '@keystatic/astro';

import tailwindcss from '@tailwindcss/vite';

import { codeBlockFrame } from './src/lib/shiki-code-block.ts';
import { callout } from './src/lib/callout.ts';

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

  // Sitemap은 빌드한 페이지만 담으므로 초안은 빠진다(TECH.md #6.7).
  integrations: [react(), mdx(), sitemap(), ...(cms ? [keystatic()] : [])],

  // 코드 블록은 라이트 테마 하나로 그리고 macOS 창 모양으로 감싼다(DESIGN.md #3.5, #8.5).
  // github-light-default는 Figma 시안의 구문 색과 같다.
  markdown: {
    // MDX도 이 처리기를 이어받는다. 알림 상자 문법(> [!NOTE])을 바꾸고 각주 라벨을 한국어로 쓴다(DESIGN.md #8.3, #8.13).
    processor: satteri({
      hastPlugins: [callout()],
      features: {
        gfm: {
          footnotes: { label: '각주', backLabel: '{reference}번 각주를 단 곳으로 돌아가기' },
        },
      },
    }),
    shikiConfig: {
      theme: 'github-light-default',
      transformers: [codeBlockFrame()],
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});