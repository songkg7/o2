import { O2PluginSettings } from '../../settings';

export default class DocusaurusSettings implements O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;
  docusaurusPath: string;
  isAutoCreateFolder: boolean;
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
}
