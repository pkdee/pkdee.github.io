// Content Collections 스키마(src/content.config.ts)와 Keystatic 편집 화면(keystatic.config.ts)이 함께 쓰는 형식 규칙
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const TAG_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .+#-]*$/;
/** 프로젝트 기간(연-월). 예: 2026-03 */
export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

/** 프로젝트 상태. 값은 frontmatter에, label은 화면과 편집 화면에 쓴다. */
export const PROJECT_STATUSES = [
  { value: 'in-progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
  { value: 'stopped', label: '중단' },
] as const;
