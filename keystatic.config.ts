import { collection, config, fields } from '@keystatic/core';
import { SLUG_PATTERN } from './src/lib/content-patterns';
import { TAGS } from './src/lib/tags';

// 빌드 검증은 src/content.config.ts가 맡는다. 필드를 바꾸면 두 파일을 함께 고친다.
const slugRule = {
  regex: SLUG_PATTERN,
  message: '영문 소문자, 숫자, 하이픈(-)만 쓸 수 있습니다.',
};

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
          fields.select({
            label: '태그',
            description: '목록에 없는 태그는 src/lib/tags.ts에 먼저 추가합니다.',
            options: TAGS.map(({ name }) => ({ label: name, value: name })),
            defaultValue: TAGS[0].name,
          }),
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
  },
});
