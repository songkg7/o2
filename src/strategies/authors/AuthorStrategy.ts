import { FrontMatter } from '../../FrontMatterConverter';

export interface AuthorStrategy {
  applyAuthors(frontMatter: FrontMatter, authors: string): FrontMatter;
}

