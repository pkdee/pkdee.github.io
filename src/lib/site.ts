// 사이트 전역 표기. 사이트 이름과 저자 표기는 아직 정하지 않았다(ARCHITECTURE.md #1.4).
// 정해지면 이 값만 바꾼다. 지금 값은 Figma 시안의 자리표시자이다.
export const SITE = {
  name: '사이트 이름',
  author: '저자 이름',
  description: '공부하며 정리한 내용을 기록한다.',
  // 정하지 않았거나 아직 없는 링크는 undefined로 둔다. 그러면 푸터에 나오지 않는다.
  // RSS는 피드를 만들 때(ARCHITECTURE.md #11.1의 11단계) '/rss.xml'로 바꾼다.
  rssPath: undefined as string | undefined,
  githubUrl: undefined as string | undefined,
} as const;

export const NAV_ITEMS = [
  { label: 'Blog', href: '/blog/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'About', href: '/about/' },
] as const;
