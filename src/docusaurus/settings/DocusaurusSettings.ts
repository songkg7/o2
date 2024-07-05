import { O2PluginSettings } from '../../settings';
import { DateExtractionPattern } from '../DateExtractionPattern';

export default class DocusaurusSettings implements O2PluginSettings {
  docusaurusPath: string;
  dateExtractionPattern: string;

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
