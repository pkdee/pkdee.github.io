import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// 항목 사이의 중복 검사(ARCHITECTURE.md #6.4). Zod 스키마는 항목을 하나씩만 보고,
// Astro는 slug가 겹치면 경고만 남긴 채 뒤 파일로 덮어쓰므로 파일을 직접 읽어 확인한다.
// 초안도 검사한다. 공개할 때 처음 충돌이 드러나지 않게 하기 위해서이다.

const UNIQUE_FIELDS = ['slug', 'contentId'] as const;
type UniqueField = (typeof UNIQUE_FIELDS)[number];

function frontmatterValues(source: string): Partial<Record<UniqueField, string>> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match?.[1]) return {};
  const values: Partial<Record<UniqueField, string>> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = /^(slug|contentId):\s*(.+?)\s*$/.exec(line);
    if (field?.[1] && field[2]) {
      values[field[1] as UniqueField] = field[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  return values;
}

/** dir 아래 .mdx 파일의 slug, contentId가 겹치면 두 파일 경로를 담아 예외를 던진다. */
export function assertUniqueEntries(dir: string): void {
  const files = readdirSync(dir, { recursive: true, encoding: 'utf8' }).filter((file) =>
    file.endsWith('.mdx'),
  );
  const seen = new Map<string, string>();
  for (const file of files) {
    const values = frontmatterValues(readFileSync(join(dir, file), 'utf8'));
    for (const field of UNIQUE_FIELDS) {
      const value = values[field];
      if (!value) continue;
      const key = `${field}:${value}`;
      const other = seen.get(key);
      if (other) {
        const where = (name: string) => relative(process.cwd(), join(dir, name));
        throw new Error(`${field} "${value}"가 ${where(other)}와 ${where(file)}에서 겹친다. 하나를 바꾼다`);
      }
      seen.set(key, file);
    }
  }
}
