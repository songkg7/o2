import { O2PluginSettings } from '../../settings';

export default class DocusaurusSettings implements O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;
  docusaurusPath: string;
  docusaurusRelativeResourcePath: string;
  isAutoCreateFolder: boolean;

  targetPath(): string {
    throw new Error('Method not implemented.');
  }
  resourcePath(): string {
    throw new Error('Method not implemented.');
  }
  afterPropertiesSet(): boolean {
    throw new Error('Method not implemented.');
  }
}
