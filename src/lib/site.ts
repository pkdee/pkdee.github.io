import type { TagName } from './tags';

// 사이트 전역 표기. 사이트 이름과 저자 표기는 아직 정하지 않았다(ARCHITECTURE.md #1.4).
// 정해지면 이 값만 바꾼다. 지금 값은 Figma 시안의 자리표시자이다.
export const SITE = {
  name: '사이트 이름',
  author: '저자 이름',
  description: '공부하며 정리한 내용을 기록한다.',
  /** 프로젝트 목록 설명. Figma 예시 문구이다. */
  projectsDescription: '직접 만든 프로젝트와 기술 선택 근거를 정리한다.',
  // 정하지 않았거나 아직 없는 링크는 undefined로 둔다. 그러면 푸터에 나오지 않는다.
  rssPath: '/rss.xml' as string | undefined,
  githubUrl: undefined as string | undefined,
  /** 소개 페이지(DESIGN.md #5.7). 자기소개는 아직 Figma 자리표시자이다. */
  about: {
    intro: '여기에 자기소개를 쓴다. 공부하는 분야와 블로그를 운영하는 이유를 짧게 적는다.',
    // 태그 목록(src/lib/tags.ts)의 이름만 쓴다. 칩이 태그 페이지로 연결된다.
    interests: ['Java', 'Kotlin', 'Spring', 'CS'] as TagName[],
    email: undefined as string | undefined,
  },
} as const;

export const NAV_ITEMS = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const;
