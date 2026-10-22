import { getCollection, type CollectionEntry } from 'astro:content';
import { PROJECT_STATUSES } from './content-patterns';

export type Project = CollectionEntry<'projects'>;

/** 공개 프로젝트만 시작일 최신순으로 돌려준다. 초안은 운영 빌드에서 뺀다(ARCHITECTURE.md #6.5). */
export async function getPublishedProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true,
  );
  return projects.sort((a, b) => b.data.startDate.localeCompare(a.data.startDate));
}

export function projectUrl(project: Project): string {
  return `/projects/${project.id}/`;
}

/** 2026-03 → 2026.03 */
function formatMonth(month: string): string {
  return month.replace('-', '.');
}

/** 예: 2026.03 ~ 2026.10, 끝이 없으면 2026.03 ~ 진행 중 */
export function formatPeriod({ startDate, endDate }: Project['data']): string {
  return `${formatMonth(startDate)} ~ ${endDate ? formatMonth(endDate) : '진행 중'}`;
}

export function statusLabel(status: Project['data']['status']): string {
  return PROJECT_STATUSES.find((item) => item.value === status)?.label ?? status;
}
