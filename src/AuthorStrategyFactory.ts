import { PlatformType } from './enums/PlatformType';
import {
  AuthorStrategy,


} from './strategies/authors/AuthorStrategy';
import { DocusaurusAuthorStrategy } from './strategies/authors/DocusaurusAuthorStrategy';
import { JekyllAuthorStrategy } from './strategies/authors/JekyllAuthorStrategy';
import { DefaultAuthorStrategy } from './strategies/authors/DefaultAuthorStrategy';

export class AuthorStrategyFactory {
  static createStrategy(platform: PlatformType, authors: string): AuthorStrategy {
    if (!authors) {
      return new DefaultAuthorStrategy();
    }
    switch (platform) {
      case PlatformType.Jekyll:
        return new JekyllAuthorStrategy();
      case PlatformType.Docusaurus:
        return new DocusaurusAuthorStrategy();
      default:
        return new DefaultAuthorStrategy();
    }
  }
}
