import { Plugin } from 'obsidian';
import { O2PluginSettings, O2SettingTab } from './settings';
import JekyllSetting from './jekyll/settings/JekyllSettings';
import DocusaurusSettings from './docusaurus/settings/DocusaurusSettings';
import { convertToChirpy } from './jekyll/chirpy';
import { convertToDocusaurus } from './docusaurus/docusaurus';

export default class O2Plugin extends Plugin {
  jekyll: O2PluginSettings;
  docusaurus: O2PluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'jekyll-chirpy-syntax',
      name: 'convert to Jekyll Chirpy',
      checkCallback: (checking: boolean) => {
        if (this.jekyll.afterPropertiesSet()) {
          if (checking) {
            return true;
          }
          convertToChirpy(this);
        }

        if (this.docusaurus.afterPropertiesSet()) {
          if (checking) {
            return true;
          }
          convertToDocusaurus(this);
        }
      },
    });

    this.addSettingTab(new O2SettingTab(this.app, this));
  }

  onunload() {

  }

  async loadSettings() {
    this.jekyll = Object.assign(new JekyllSetting(), await this.loadData());
    this.docusaurus = Object.assign(new DocusaurusSettings(), await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.jekyll);
    await this.saveData(this.docusaurus);
  }
}

