import { Plugin } from 'obsidian';
import { JekyllSetting, O2PluginSettings, O2SettingTab } from "./settings";
import { convertToChirpy } from "./jekyll/chirpy";

export default class O2Plugin extends Plugin {
    settings: O2PluginSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'jekyll-chirpy-syntax',
            name: 'converting to jekyll chirpy',
            checkCallback: (checking: boolean) => {
                // TODO: init jekyll from to folder
                if (this.settings.afterPropertiesSet()) {
                    if (checking) {
                        return true;
                    }
                    convertToChirpy(this);
                }
            }
        });

        this.addSettingTab(new O2SettingTab(this.app, this));

    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign(new JekyllSetting(), await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

}
