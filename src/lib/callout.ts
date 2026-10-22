import type { Element, ElementContent } from 'hast';
import type { HastPluginDefinition } from 'satteri';

// 알림 종류와 고정 제목(DESIGN.md #8.13). GitHub 알림 문법과 같은 다섯 종류이다.
const CALLOUT_TITLES = {
  note: '참고',
  tip: '팁',
  important: '중요',
  warning: '경고',
  caution: '주의',
} as const;

type CalloutType = keyof typeof CALLOUT_TITLES;

// GitHub처럼 표시는 첫 줄에 단독으로 쓰고 대소문자를 가리지 않는다. 예: > [!WARNING]
const MARKER = /^\[!(note|tip|important|warning|caution)\][ \t]*(?:\r?\n|$)/i;

const isBlank = (node: ElementContent) => node.type === 'text' && node.value.trim() === '';

/**
 * `> [!NOTE]` 같은 인용을 알림 상자로 바꾼다(DESIGN.md #8.13).
 * Sätteri는 GitHub 알림 문법을 지원하지 않아 hast 단계에서 바꾼다(TECH.md #1.3).
 * 결과는 `<div class="callout callout-note">` 안에 제목 `<p class="callout-title">`과 본문이다.
 * 표시 뒤에 본문이 없거나 종류를 모르면 GitHub처럼 일반 인용으로 둔다.
 */
export function callout(): HastPluginDefinition {
  return {
    name: 'callout',
    element: {
      filter: ['blockquote'],
      visit(node) {
        const children = node.children.filter((child) => !isBlank(child));
        const first = children[0];
        if (first?.type !== 'element' || first.tagName !== 'p') return;
        const lead = first.children[0];
        if (lead?.type !== 'text') return;
        const match = MARKER.exec(lead.value);
        if (!match?.[1]) return;

        const type = match[1].toLowerCase() as CalloutType;
        const rest = lead.value.slice(match[0].length);
        const firstChildren = [...(rest ? [{ ...lead, value: rest }] : []), ...first.children.slice(1)];
        const body = [
          ...(firstChildren.length > 0 ? [{ ...first, children: firstChildren }] : []),
          ...children.slice(1),
        ];
        if (body.length === 0) return;

        const title: Element = {
          type: 'element',
          tagName: 'p',
          // 종류 이름은 검색 결과 발췌에 필요 없으므로 색인에서 뺀다(TECH.md #6.10).
          properties: { className: ['callout-title'], dataPagefindIgnore: '' },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['callout-icon'], ariaHidden: 'true' },
              children: [],
            },
            { type: 'text', value: CALLOUT_TITLES[type] },
          ],
        };
        // role="alert"는 쓰지 않는다. 화면 낭독기가 페이지를 열 때마다 끼어들어 읽기 때문이다.
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['callout', `callout-${type}`] },
          children: [title, ...body],
        };
      },
    },
  };
}
