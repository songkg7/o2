import { AuthorStrategy } from './AuthorStrategy';
import { FrontMatter } from '../../FrontMatterConverter';

export class JekyllAuthorStrategy implements AuthorStrategy {
  applyAuthors(frontMatter: FrontMatter, authors: string): FrontMatter {
    const authorsList = authors.split(',').map(author => author.trim());
    delete frontMatter.authors;
    if (authorsList.length === 1) {
      frontMatter.author = authorsList[0];
    } else {
      frontMatter.authors = `[${authorsList.join(', ')}]`;
    }
    return frontMatter;
  }
}
