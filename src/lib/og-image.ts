import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { SITE } from './site';

// 기본 공유 이미지 크기. Open Graph와 Twitter Card 큰 이미지가 권장하는 1.91:1이다.
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// 디자인 토큰(src/styles/global.css)과 같은 값이다. CSS 변수를 읽을 수 없어 값을 옮겨 쓴다.
const COLOR = { background: '#ffffff', text: '#171717', muted: '#525252', primary: '#2c4bc7' };
const PADDING = 80;
const ACCENT_HEIGHT = 16;

type Weight = 'Bold' | 'Regular' | 'Medium';

// 빌드 환경에 한글 글꼴이 없어도 같은 결과가 나오도록 pretendard 패키지의 글꼴 파일을 직접 쓴다.
const fontFile = (weight: Weight) =>
  fileURLToPath(import.meta.resolve(`pretendard/dist/public/static/Pretendard-${weight}.otf`));

// Pango 마크업이라 &, <, >를 이스케이프한다.
const escapeMarkup = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/** 글자 한 덩어리를 투명 배경 PNG로 그린다. dpi 72에서 글꼴 크기(pt)가 픽셀과 같다. */
async function renderText(text: string, weight: Weight, size: number, color: string) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${escapeMarkup(text)}</span>`,
      font: `Pretendard ${weight} ${size}`,
      fontfile: fontFile(weight),
      width: OG_IMAGE_WIDTH - PADDING * 2,
      wrap: 'word-char',
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, height: info.height };
}

/**
 * 대표 이미지가 없는 페이지에 쓰는 기본 공유 이미지(DESIGN.md #8.16).
 * 사이트 이름, 설명, 주소를 SITE와 site 설정에서 읽으므로 값이 바뀌면 다음 빌드에 함께 바뀐다.
 */
export async function renderDefaultOgImage(siteUrl: URL): Promise<Buffer> {
  const name = await renderText(SITE.name, 'Bold', 72, COLOR.text);
  const description = await renderText(SITE.description, 'Regular', 36, COLOR.muted);
  const host = await renderText(siteUrl.host, 'Medium', 28, COLOR.primary);

  const nameTop = 200;
  return sharp({
    create: {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      channels: 3,
      background: COLOR.background,
    },
  })
    .composite([
      {
        input: {
          create: { width: OG_IMAGE_WIDTH, height: ACCENT_HEIGHT, channels: 3, background: COLOR.primary },
        },
        top: 0,
        left: 0,
      },
      { input: name.data, top: nameTop, left: PADDING },
      { input: description.data, top: nameTop + name.height + 24, left: PADDING },
      { input: host.data, top: OG_IMAGE_HEIGHT - PADDING - host.height, left: PADDING },
    ])
    .png()
    .toBuffer();
}
