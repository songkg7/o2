import { AuthorStrategy } from './AuthorStrategy';
import { FrontMatter } from '../../FrontMatterConverter';

export class DefaultAuthorStrategy implements AuthorStrategy {
  applyAuthors(frontMatter: FrontMatter, authors: string): FrontMatter {
    return frontMatter;
  }
}
