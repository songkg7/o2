import { AuthorStrategy } from './AuthorStrategy';
import { FrontMatter } from '../../FrontMatterConverter';

export class DocusaurusAuthorStrategy implements AuthorStrategy {
  applyAuthors(frontMatter: FrontMatter, authors: string): FrontMatter {
    const authorsList = authors.split(',').map(author => author.trim());
    delete frontMatter.author;
    if (authorsList.length === 1) {
      frontMatter.authors = authorsList[0];
    } else {
      frontMatter.authors = `[${authorsList.join(', ')}]`;
    }
    return frontMatter;
  }
}
