import { App, PluginSettingTab, Setting } from "obsidian"
import O2Plugin from "./main"

export interface O2PluginSettings {
    readyDir: string;
    publishedDir: string;
    jekyllTargetDir: string;
}

export const DEFAULT_SETTINGS: O2PluginSettings = {
    readyDir: 'ready',
    publishedDir: 'published',
    jekyllTargetDir: 'jekyll',
}

export class O2SettingTab extends PluginSettingTab {
    plugin: O2Plugin

    constructor(app: App, plugin: O2Plugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        this.containerEl.empty()
        this.containerEl.createEl('h2', {
            text: 'Settings for O2 plugin.',
        })
        this.addDraftDirectorySetting()
        this.addPublishedDirectorySetting()
        this.addJekyllTargetDirectorySetting()
        this.containerEl.createEl('h2', {
            text: 'Advanced settings',
        })
    }

    private addDraftDirectorySetting() {
        new Setting(this.containerEl)
            .setName('Draft directory')
            .setDesc('The directory where documents ready to be published will be placed.')
            .addText(text => text
                .setPlaceholder('Enter directory name')
                .setValue(this.plugin.settings.readyDir)
                .onChange(async (value) => {
                    console.log('Draft path: ' + value)
                    this.plugin.settings.readyDir = value
                    await this.plugin.saveSettings()
                }))
    }

    private addPublishedDirectorySetting() {
        new Setting(this.containerEl)
            .setName('Published directory')
            .setDesc('The directory where publishing will complete and the documents will be moved.')
            .addText(text => text
                .setPlaceholder('Enter directory name')
                .setValue(this.plugin.settings.publishedDir)
                .onChange(async (value) => {
                    console.log('Published path: ' + value)
                    this.plugin.settings.publishedDir = value
                    await this.plugin.saveSettings()
                }))
    }

    private addJekyllTargetDirectorySetting() {
        new Setting(this.containerEl)
            .setName('Jekyll target directory')
            .setDesc('The directory where Jekyll will be generated.')
            .addText(text => text
                .setPlaceholder('Enter directory name')
                .setValue(this.plugin.settings.jekyllTargetDir)
                .onChange(async (value) => {
                    console.log('Jekyll path: ' + value)
                    this.plugin.settings.jekyllTargetDir = value
                    await this.plugin.saveSettings()
                }))
    }
}
