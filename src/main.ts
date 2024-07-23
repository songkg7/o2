import { Notice, Plugin } from 'obsidian';
import { O2SettingTab, ObsidianPathSettings } from './settings';
import JekyllSettings from './jekyll/settings/JekyllSettings';
import DocusaurusSettings from './docusaurus/settings/DocusaurusSettings';
import { convertToChirpy } from './jekyll/chirpy';
import { convertToDocusaurus } from './docusaurus/docusaurus';
import { archiving, cleanUp } from './utils';
import validateSettings from './core/validation';

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
        if (this.jekyll.afterPropertiesSet() || this.docusaurus.afterPropertiesSet()) {
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

  onunload() {

  }

  async loadSettings() {
    this.obsidianPathSettings = Object.assign(new ObsidianPathSettings(), await this.loadData());
    this.jekyll = Object.assign(new JekyllSettings(), await this.loadData());
    this.docusaurus = Object.assign(new DocusaurusSettings(), await this.loadData());
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
    await convertToChirpy(plugin)
      .finally(() => cleanUp(plugin));
  }

  if (plugin.docusaurus.afterPropertiesSet()) {
    await convertToDocusaurus(plugin)
      .finally(() => cleanUp(plugin));
  }
};
