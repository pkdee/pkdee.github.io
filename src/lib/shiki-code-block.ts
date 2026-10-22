import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';

// 셸 명령은 Terminal 창으로 그리고 줄 번호를 붙이지 않는다(DESIGN.md #8.5).
const TERMINAL_LANGS = new Set(['sh', 'bash', 'zsh', 'shell', 'console', 'shellsession']);
const PLAIN_LANGS = new Set(['plaintext', 'text', 'txt']);

// github-light-default의 주석 색 #6E7781은 Code Background 위에서 4.21:1이라
// Figma 시안의 #57606A(5.91:1)로 바꾼다(TECH.md #1.3).
const COMMENT_COLOR = /#6e7781/gi;
const COMMENT_COLOR_ACCESSIBLE = '#57606A';

const el = (
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[] = [],
): Element => ({ type: 'element', tagName, properties, children });

const text = (value: string): ElementContent => ({ type: 'text', value });

/**
 * 코드 블록을 macOS 창 모양으로 감싼다(DESIGN.md #8.5).
 * 머리글에는 창 버튼(장식), 파일 이름 또는 언어, 복사 버튼을 둔다.
 * 파일 이름은 코드 펜스 메타의 title="..."로 쓴다. 예: ```java title="TransferService.java"
 * 복사 버튼은 hidden으로 두고, 복사 스크립트(PostLayout)가 있을 때만 보인다.
 */
export function codeBlockFrame(): ShikiTransformer {
  return {
    name: 'code-block-frame',
    span(node) {
      const style = node.properties.style;
      if (typeof style === 'string') {
        node.properties.style = style.replace(COMMENT_COLOR, COMMENT_COLOR_ACCESSIBLE);
      }
    },
    root(root) {
      const pre = root.children.find((child): child is Element => child.type === 'element');
      if (!pre) return;

      const lang = this.options.lang;
      const meta = this.options.meta?.__raw ?? '';
      const isTerminal = TERMINAL_LANGS.has(lang);
      const title =
        /title="([^"]+)"/.exec(meta)?.[1] ??
        (isTerminal ? 'Terminal' : PLAIN_LANGS.has(lang) ? '' : lang);

      // 파일 이름과 복사 버튼 글자는 검색 색인에서 뺀다(TECH.md #6.10).
      const header = el('div', { className: ['code-block-header'], dataPagefindIgnore: '' }, [
        el('span', { className: ['code-block-controls'], ariaHidden: 'true' }),
        el('span', { className: ['code-block-title'] }, [text(title)]),
        el('span', { className: ['code-block-actions'] }, [
          el('button', { type: 'button', className: ['code-block-copy'], hidden: true }, [
            el('span', { className: ['code-block-copy-icon'], ariaHidden: 'true' }),
            el('span', { className: ['code-block-copy-label'], ariaLive: 'polite' }, [
              text('복사'),
            ]),
          ]),
        ]),
      ]);

      // Sätteri는 Shiki 결과의 첫 자식만 쓰므로 하나의 요소로 감싼다.
      root.children = [
        el(
          'div',
          { className: ['code-block'], dataVariant: isTerminal ? 'terminal' : 'code' },
          [header, pre],
        ),
      ];
    },
  };
}
