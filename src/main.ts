import { Notice, Plugin } from 'obsidian';
import { O2SettingTab, ObsidianPathSettings } from './settings';
import JekyllSettings from './platforms/jekyll/settings/JekyllSettings';
import DocusaurusSettings from './platforms/docusaurus/settings/DocusaurusSettings';
import { convertToChirpy } from './platforms/jekyll/chirpy';
import { convertToDocusaurus } from './platforms/docusaurus/docusaurus';
import { archiving, cleanUp } from './core/utils/utils';
import validateSettings from './core/validation';

interface O2PluginSettings {
  obsidianPathSettings: ObsidianPathSettings;
  jekyll: JekyllSettings;
  docusaurus: DocusaurusSettings;
}

const DEFAULT_SETTINGS: O2PluginSettings = {
  obsidianPathSettings: new ObsidianPathSettings(),
  jekyll: new JekyllSettings(),
  docusaurus: new DocusaurusSettings()
};

export default class O2Plugin extends Plugin {
  obsidianPathSettings: ObsidianPathSettings;
  jekyll: JekyllSettings;
  docusaurus: DocusaurusSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'grammar-transformation',
      name: 'Grammar Transformation',
      checkCallback: (checking: boolean) => {
        if (
          this.jekyll.afterPropertiesSet() ||
          this.docusaurus.afterPropertiesSet()
        ) {
          if (checking) {
            return true;
          }
          o2ConversionCommand(this)
            .then(() => new Notice('Converted to successfully.', 5000))
            .then(() => {
              if (this.obsidianPathSettings.isAutoArchive) {
                archiving(this);
              }
            });
        }
      },
    });

    this.addSettingTab(new O2SettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    const data = await this.loadData() as O2PluginSettings;
    
    // Merge saved settings with defaults
    this.obsidianPathSettings = Object.assign(new ObsidianPathSettings(), DEFAULT_SETTINGS.obsidianPathSettings, data?.obsidianPathSettings);
    this.jekyll = Object.assign(new JekyllSettings(), DEFAULT_SETTINGS.jekyll, data?.jekyll);
    this.docusaurus = Object.assign(new DocusaurusSettings(), DEFAULT_SETTINGS.docusaurus, data?.docusaurus);
  }

  async saveSettings() {
    await this.saveData({
      obsidianPathSettings: this.obsidianPathSettings,
      jekyll: this.jekyll,
      docusaurus: this.docusaurus,
    });
  }
}

const o2ConversionCommand = async (plugin: O2Plugin) => {
  await validateSettings(plugin);
  if (plugin.jekyll.afterPropertiesSet()) {
    await convertToChirpy(plugin).finally(() => cleanUp(plugin));
  }

  if (plugin.docusaurus.afterPropertiesSet()) {
    await convertToDocusaurus(plugin).finally(() => cleanUp(plugin));
  }
};
