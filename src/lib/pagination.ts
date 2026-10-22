export type PageItem = { type: 'page'; page: number } | { type: 'gap' };

/**
 * 페이지 이동에 놓을 번호 칸을 정한다(DESIGN.md #8.10).
 * 처음, 마지막, 현재 페이지와 그 앞뒤 번호만 두고 나머지는 gap(…)으로 줄인다.
 * maxSlots: 이전·다음을 뺀 칸 수. 데스크톱 7, 모바일 5.
 */
export function pageItems(current: number, last: number, maxSlots: 5 | 7): PageItem[] {
  const pages = (from: number, to: number): PageItem[] =>
    Array.from({ length: to - from + 1 }, (_, i) => ({ type: 'page', page: from + i }));
  const gap: PageItem = { type: 'gap' };

  if (last <= maxSlots) return pages(1, last);

  // 한쪽 끝에 붙은 번호 묶음의 길이(gap과 반대쪽 끝 번호 두 칸을 뺀 나머지)
  const edge = maxSlots - 2;
  if (current <= edge - 1) return [...pages(1, edge), gap, ...pages(last, last)];
  if (current >= last - edge + 2) return [...pages(1, 1), gap, ...pages(last - edge + 1, last)];

  const around = maxSlots === 7 ? 1 : 0;
  return [...pages(1, 1), gap, ...pages(current - around, current + around), gap, ...pages(last, last)];
}
