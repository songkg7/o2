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
export const DateExtractionPattern = {
  SINGLE: 'YYYY-MM-DD-my-blog-post-title.md',
  MDX: 'YYYY-MM-DD-my-blog-post-title.mdx',
  SINGLE_FOLDER_INDEX: 'YYYY-MM-DD-my-blog-post-title/index.md',
  FOLDER_NAMED_BY_DATE: 'YYYY-MM-DD/my-blog-post-title.md',
  NESTED_FOLDERS_BY_DATE: 'YYYY/MM/DD/my-blog-post-title.md',
  PARTIALLY_NESTED_FOLDERS_BY_DATE: 'YYYY/MM-DD/my-blog-post-title.md',
  NESTED_FOLDERS_INDEX: 'YYYY/MM/DD/my-blog-post-title/index.md',
  DATE_IN_MIDDLE_OF_PATH: 'category/YYYY/MM-DD-my-blog-post-title.md',
} as const;
