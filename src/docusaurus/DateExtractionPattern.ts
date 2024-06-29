/**
 * SINGLE: YYYY-MM-DD-my-blog-post-title.md
 * MDX: YYYY-MM-DD-my-blog-post-title.mdx
 * Single folder + index.md: YYYY-MM-DD-my-blog-post-title/index.md
 * Folder named by date: YYYY-MM-DD/my-blog-post-title.md
 * Nested folders by date: YYYY/MM/DD/my-blog-post-title.md
 * Partially nested folders by date: YYYY/MM-DD/my-blog-post-title.md
 * Nested folders + index.md: YYYY/MM/DD/my-blog-post-title/index.md
 * Date in the middle of path: category/YYYY/MM-DD-my-blog-post-title.md
 */
export const DateExtractionPattern: Record<string, DateExtractionPatternInterface> = {
  SINGLE: {
    pattern: 'YYYY-MM-DD-my-blog-post-title.md',
    regexp: /(\d{4})-(\d{2})-(\d{2})-(.*)\.md/,
  },
  MDX: {
    pattern: 'YYYY-MM-DD-my-blog-post-title.mdx',
    regexp: /(\d{4})-(\d{2})-(\d{2})-(.*)\.mdx/,
  },
  SINGLE_FOLDER_INDEX: {
    pattern: 'YYYY-MM-DD-my-blog-post-title/index.md',
    regexp: /(\d{4})-(\d{2})-(\d{2})-(.*)\/index\.md/,
  },
  FOLDER_NAMED_BY_DATE: {
    pattern: 'YYYY-MM-DD/my-blog-post-title.md',
    regexp: /(\d{4})-(\d{2})-(\d{2})\/(.*)\.md/,
  },
  NESTED_FOLDERS_BY_DATE: {
    pattern: 'YYYY/MM/DD/my-blog-post-title.md',
    regexp: /(\d{4})\/(\d{2})\/(\d{2})\/(.*)\.md/,
  },
  PARTIALLY_NESTED_FOLDERS_BY_DATE: {
    pattern: 'YYYY/MM-DD/my-blog-post-title.md',
    regexp: /(\d{4})\/(\d{2})-(\d{2})\/(.*)\.md/,
  },
  NESTED_FOLDERS_INDEX: {
    pattern: 'YYYY/MM/DD/my-blog-post-title/index.md',
    regexp: /(\d{4})\/(\d{2})\/(\d{2})\/(.*)\/index\.md/,
  },
  // FIXME:
  DATE_IN_MIDDLE_OF_PATH: {
    pattern: 'category/YYYY/MM-DD-my-blog-post-title.md',
    regexp: /category\/(\d{4})\/(\d{2})-(\d{2})-(.*)\.md/,
  },
};

export interface DateExtractionPatternInterface {
  pattern: string;
  regexp: RegExp;
}
