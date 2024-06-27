import { O2PluginSettings } from '../../settings';

export default class DocusaurusSettings implements O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;
  docusaurusPath: string;
  docusaurusRelativeResourcePath: string;
  isAutoCreateFolder: boolean;
  dateExtractionPattern: string;

  targetPath(): string {
    throw new Error('Method not implemented.');
  }
  resourcePath(): string {
    throw new Error('Method not implemented.');
  }
  afterPropertiesSet(): boolean {
    return this.docusaurusPath.length !== 0;
  }
}
