import ApacheKafkaBrand from '../assets/logos/apache-kafka-brand.svg';
import ApacheKafkaMono from '../assets/logos/apache-kafka-mono.svg';
import AstroBrand from '../assets/logos/astro-brand.svg';
import AstroMono from '../assets/logos/astro-mono.svg';
import JavaBrand from '../assets/logos/java-brand.svg';
import JavaMono from '../assets/logos/java-mono.svg';
import KotlinBrand from '../assets/logos/kotlin-brand.svg';
import KotlinMono from '../assets/logos/kotlin-mono.svg';
import MdxBrand from '../assets/logos/mdx-brand.svg';
import MdxMono from '../assets/logos/mdx-mono.svg';
import RedisBrand from '../assets/logos/redis-brand.svg';
import RedisMono from '../assets/logos/redis-mono.svg';
import SpringBrand from '../assets/logos/spring-brand.svg';
import SpringMono from '../assets/logos/spring-mono.svg';
import type { LogoKey } from './tags';

type SvgComponent = typeof JavaBrand;

export interface Logo {
  brand: SvgComponent;
  mono: SvgComponent;
  /** 대체 표지 배경: Surface 위에 브랜드 색 12%(DESIGN.md #8.2). Tailwind가 찾을 수 있게 클래스 전체를 쓴다. */
  coverClass: string;
}

// Figma Icon 페이지 Logos의 Brand, Mono 변형. 출처, 라이선스, 브랜드 색은 각 로고 컴포넌트 설명을 따른다(DESIGN.md #8.6).
// SVG는 24px 칸 기준 크기이고 칸 가운데에 놓는다(TagIcon).
// prettier-ignore
export const LOGOS: Record<LogoKey, Logo> = {
  'apache-kafka': { brand: ApacheKafkaBrand, mono: ApacheKafkaMono, coverClass: 'bg-[color-mix(in_srgb,#231F20_12%,var(--color-surface))]' },
  astro: { brand: AstroBrand, mono: AstroMono, coverClass: 'bg-[color-mix(in_srgb,#BC52EE_12%,var(--color-surface))]' },
  java: { brand: JavaBrand, mono: JavaMono, coverClass: 'bg-[color-mix(in_srgb,#0074BD_12%,var(--color-surface))]' },
  kotlin: { brand: KotlinBrand, mono: KotlinMono, coverClass: 'bg-[color-mix(in_srgb,#7F52FF_12%,var(--color-surface))]' },
  mdx: { brand: MdxBrand, mono: MdxMono, coverClass: 'bg-[color-mix(in_srgb,#1B1F24_12%,var(--color-surface))]' },
  redis: { brand: RedisBrand, mono: RedisMono, coverClass: 'bg-[color-mix(in_srgb,#FF4438_12%,var(--color-surface))]' },
  spring: { brand: SpringBrand, mono: SpringMono, coverClass: 'bg-[color-mix(in_srgb,#6DB33F_12%,var(--color-surface))]' },
};
