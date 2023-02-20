import { App, PluginSettingTab, Setting } from "obsidian"
import O2Plugin from "./main"

export interface O2PluginSettings {
    jekyllRelativeResourcePath: string
    resourceDir: string
    readyDir: string;
    publishedDir: string;
    jekyllTargetPath: string;
    jekyllResourcePath: string;
    afterPropertiesSet(): boolean;
}

export const DEFAULT_SETTINGS: O2PluginSettings = {
    readyDir: 'ready',
    publishedDir: 'published',
    resourceDir: 'resources',
    jekyllTargetPath: '',
    jekyllResourcePath: '',
    jekyllRelativeResourcePath: 'assets/img',

    afterPropertiesSet(): boolean {
        return this.jekyllResourcePath !== '' && this.jekyllTargetPath !== ''
    }
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
        this.addJekyllTargetPathSetting()
        this.addJekyllResourcePathSetting()
        // this.containerEl.createEl('h2', {
        //     text: 'Advanced settings',
        // })
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

    private addJekyllTargetPathSetting() {
        new Setting(this.containerEl)
            .setName('Jekyll target path')
            .setDesc('The absolute path where Jekyll markdown will be generated.')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(this.plugin.settings.jekyllTargetPath)
                .onChange(async (value) => {
                    console.log('Jekyll path: ' + value)
                    this.plugin.settings.jekyllTargetPath = value
                    await this.plugin.saveSettings()
                }))
    }

    private addJekyllResourcePathSetting() {
        new Setting(this.containerEl)
            .setName('Jekyll resource path')
            .setDesc('The absolute path where the image file should be copied.')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(this.plugin.settings.jekyllResourcePath)
                .onChange(async (value) => {
                    console.log('Jekyll resource path: ' + value)
                    this.plugin.settings.jekyllResourcePath = value
                    await this.plugin.saveSettings()
                }))
    }
}
