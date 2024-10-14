import { O2PluginSettings } from '../../settings';
import { DateExtractionPattern } from '../DateExtractionPattern';
import { PlatformType } from '../../enums/PlatformType';
import { AuthorStrategy } from '../../strategies/authors/AuthorStrategy';

export default class DocusaurusSettings implements O2PluginSettings {
  docusaurusPath: string;
  dateExtractionPattern: string;
  authors: string = '';
  authorStrategy: AuthorStrategy;
  platform: PlatformType = PlatformType.Docusaurus;

  targetPath(): string {
    return `${this.docusaurusPath}/blog`;
  }

  resourcePath(): string {
    return `${this.docusaurusPath}/static/img`;
  }

  afterPropertiesSet(): boolean {
    return this.docusaurusPath !== undefined && this.docusaurusPath.length !== 0;
  }

  pathReplacer = (year: string, month: string, day: string, title: string): string => {
    const patternInterface = DateExtractionPattern[this.dateExtractionPattern];
    return patternInterface.replacer(year, month, day, title);
  };
}
