import { O2PluginSettings } from '../../settings';

export class DocusaurusSettings implements O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;
  docusaurusPath: string;
  docusaurusRelativeResourcePath: string;
  isAutoCreateFolder: boolean;
}
