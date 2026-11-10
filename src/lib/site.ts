import type { ImageMetadata } from 'astro';
import type { TagName } from './tags';

// 사이트 전역 표기. 사이트 이름과 저자 표기는 아직 정하지 않았다(ARCHITECTURE.md #1.4).
// 정해지면 이 값만 바꾼다. 지금 값은 Figma 시안의 자리표시자이다.
export const SITE = {
  name: '사이트 이름',
  author: '저자 이름',
  description: '공부하며 정리한 내용을 기록한다.',
  /** 프로젝트 목록 설명. Figma 예시 문구이다. */
  projectsDescription: '직접 만든 프로젝트와 기술 선택 근거를 정리한다.',
  // 정하지 않았거나 아직 없는 링크는 undefined로 둔다. 그러면 화면에 나오지 않는다.
  rssPath: '/rss.xml' as string | undefined,
  /** 외부 프로필 링크(DESIGN.md #8.17). 푸터, 저자 카드, 프로필 카드, 소개 페이지(GitHub)가 쓴다. */
  social: {
    github: undefined as string | undefined,
    instagram: undefined as string | undefined,
    youtube: undefined as string | undefined,
    linkedin: undefined as string | undefined,
  },
  /** 저자 프로필(DESIGN.md #8.17). 글 끝 저자 카드와 블로그 목록 프로필 카드가 쓴다. */
  profile: {
    /** 한 줄 소개. Figma 시안의 자리표시자이다. */
    bio: '백엔드 개발을 공부하며 Java, Kotlin, Spring, CS 내용을 기록한다.',
    /** 프로필 사진. 정해지면 src/assets/ 아래 이미지를 import해 넣는다. 없으면 사람 아이콘을 보여 준다. */
    avatar: undefined as ImageMetadata | undefined,
  },
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
