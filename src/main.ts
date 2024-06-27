import { Plugin } from 'obsidian';
import { O2PluginSettings, O2SettingTab } from './settings';
import { convertToChirpy } from './jekyll/chirpy';
import JekyllSetting from './jekyll/settings/JekyllSettings';
import DocusaurusSettings from './docusaurus/settings/DocusaurusSettings';

export default class O2Plugin extends Plugin {
  jekyll: O2PluginSettings;
  docusaurus: O2PluginSettings;

  async onload() {
    await this.loadSettings();

    this.addCommand({
      id: 'jekyll-chirpy-syntax',
      name: 'convert to Jekyll Chirpy',
      checkCallback: (checking: boolean) => {
        // TODO: init jekyll from to folder
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
          // convertToDocusaurus(this);
          console.log('convert to docusaurus');
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
  }
}

