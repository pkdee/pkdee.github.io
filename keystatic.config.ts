import { collection, config, fields } from '@keystatic/core';
import { MONTH_PATTERN, PROJECT_STATUSES, SLUG_PATTERN } from './src/lib/content-patterns';
import { TAGS } from './src/lib/tags';

// 빌드 검증은 src/content.config.ts가 맡는다. 필드를 바꾸면 두 파일을 함께 고친다.
const slugRule = {
  regex: SLUG_PATTERN,
  message: '영문 소문자, 숫자, 하이픈(-)만 쓸 수 있습니다.',
};

const monthRule = {
  regex: MONTH_PATTERN,
  message: 'YYYY-MM 형식으로 씁니다. 예: 2026-03',
};

// 블로그 태그와 프로젝트 기술 스택이 함께 쓰는 태그 선택 필드. 고른 순서를 지킨다.
const tagSelect = (label: string) =>
  fields.select({
    label,
    description: '목록에 없는 태그는 src/lib/tags.ts에 먼저 추가합니다.',
    options: TAGS.map(({ name }) => ({ label: name, value: name })),
    defaultValue: TAGS[0].name,
  });

export default config({
  storage: { kind: 'local' },
  collections: {
    blog: collection({
      label: '블로그',
      path: 'src/content/blog/*',
      slugField: 'slug',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate'],
      schema: {
        title: fields.text({ label: '제목', validation: { isRequired: true } }),
        // name 값은 frontmatter slug(URL)에, slug 값은 파일명에 저장된다.
        slug: fields.slug({
          name: {
            label: 'URL slug',
            description: '글 주소 /blog/<slug>/에 쓰입니다. 공개 후에는 바꾸지 않습니다.',
            validation: { isRequired: true, pattern: slugRule },
          },
          slug: { label: '파일명', validation: { pattern: slugRule } },
        }),
        description: fields.text({
          label: '설명',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: '게시일',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({ label: '수정일' }),
        draft: fields.checkbox({
          label: '초안',
          description: '체크되어 있으면 사이트에 공개되지 않습니다.',
          defaultValue: true,
        }),
        // 순서가 대체 표지에 쓰이므로(첫 로고 태그) 고른 순서를 지키는 array + select로 둔다.
        tags: fields.array(
          tagSelect('태그'),
          { label: '태그', itemLabel: (props) => props.value },
        ),
        featured: fields.checkbox({ label: '추천 글', defaultValue: false }),
        cover: fields.image({
          label: '대표 이미지',
          directory: 'src/assets/images/posts',
          publicPath: '@assets/images/posts/',
        }),
        coverAlt: fields.text({
          label: '대표 이미지 대체 텍스트',
          description: '대표 이미지를 넣으면 반드시 씁니다.',
        }),
        canonicalUrl: fields.url({
          label: 'canonical URL',
          description: '다른 곳에 먼저 발행한 글일 때만 씁니다.',
        }),
        authorId: fields.text({ label: '작성자 ID' }),
        contentId: fields.text({ label: '콘텐츠 ID' }),
        content: fields.mdx({
          label: '본문',
          options: { heading: [2, 3, 4] },
        }),
      },
    }),
    // 프로젝트(ARCHITECTURE.md #6.6). 빌드 검증은 src/content.config.ts가 맡는다.
    projects: collection({
      label: '프로젝트',
      path: 'src/content/projects/*',
      slugField: 'slug',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'startDate'],
      schema: {
        title: fields.text({ label: '제목', validation: { isRequired: true } }),
        slug: fields.slug({
          name: {
            label: 'URL slug',
            description: '프로젝트 주소 /projects/<slug>/에 쓰입니다. 공개 후에는 바꾸지 않습니다.',
            validation: { isRequired: true, pattern: slugRule },
          },
          slug: { label: '파일명', validation: { pattern: slugRule } },
        }),
        summary: fields.text({
          label: '요약',
          description: '프로젝트가 해결한 문제를 한 문장으로 씁니다. 카드와 검색 설명에 쓰입니다.',
          multiline: true,
          validation: { isRequired: true },
        }),
        startDate: fields.text({
          label: '시작',
          validation: { isRequired: true, pattern: monthRule },
        }),
        endDate: fields.text({
          label: '끝',
          description: '비워 두면 "진행 중"으로 보입니다.',
          validation: { pattern: monthRule },
        }),
        role: fields.text({ label: '담당 역할', validation: { isRequired: true } }),
        stack: fields.array(tagSelect('기술'), {
          label: '기술 스택',
          itemLabel: (props) => props.value,
        }),
        status: fields.select({
          label: '상태',
          options: PROJECT_STATUSES.map(({ value, label }) => ({ label, value })),
          defaultValue: 'in-progress',
        }),
        githubUrl: fields.url({ label: 'GitHub 링크' }),
        serviceUrl: fields.url({ label: '서비스 링크' }),
        draft: fields.checkbox({
          label: '초안',
          description: '체크되어 있으면 사이트에 공개되지 않습니다.',
          defaultValue: true,
        }),
        content: fields.mdx({
          label: '상세 설명',
          description: '권장 구조: 개요, 문제, 요구사항과 제약사항, 설계, 기술 선택 근거, 구현과 문제 해결, 결과, 한계와 회고',
          options: { heading: [2, 3, 4] },
        }),
      },
    }),
  },
});
