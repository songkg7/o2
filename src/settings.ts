import { App, PluginSettingTab, Setting } from "obsidian"
import O2Plugin from "./main"

export interface O2PluginSettings {
    attachmentDir: string
    readyDir: string;
    publishedDir: string;

    jekyllSetting(): JekyllSetting;

    targetPath(): string;

    resourcePath(): string;

    afterPropertiesSet(): boolean;
}

export class JekyllSetting implements O2PluginSettings {
    attachmentDir: string
    readyDir: string
    publishedDir: string
    jekyllPath: string
    jekyllRelativeResourcePath: string

    constructor() {
        this.attachmentDir = 'attachments'
        this.readyDir = 'ready'
        this.publishedDir = 'published'
        this.jekyllPath = ''
        this.jekyllRelativeResourcePath = 'assets/img'
    }

    targetPath(): string {
        return `${this.jekyllPath}/_posts`
    }

    resourcePath(): string {
        return `${this.jekyllPath}/${this.jekyllRelativeResourcePath}`
    }

    afterPropertiesSet(): boolean {
        return this.jekyllPath != ''
    }

    jekyllSetting(): JekyllSetting {
        return this
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
        this.addReadyDirectorySetting()
        this.addPublishedDirectorySetting()
        this.addAttachmentDirectorySetting()
        this.addJekyllPathSetting()
        // this.containerEl.createEl('h2', {
        //     text: 'Advanced settings',
        // })
    }

    private addJekyllPathSetting() {
        new Setting(this.containerEl)
            .setName('Jekyll path')
            .setDesc('The absolute path where Jekyll is installed.')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(this.plugin.settings.jekyllSetting().jekyllPath)
                .onChange(async (value) => {
                    this.plugin.settings.jekyllSetting().jekyllPath = value
                    await this.plugin.saveSettings()
                }))
    }

    private addAttachmentDirectorySetting() {
        new Setting(this.containerEl)
            .setName('Attachment directory')
            .setDesc('The directory where attachments will be placed.')
            .addText(text => text
                .setPlaceholder('Enter directory name')
                .setValue(this.plugin.settings.attachmentDir)
                .onChange(async (value) => {
                    this.plugin.settings.attachmentDir = value
                    await this.plugin.saveSettings()
                }))
    }

    private addReadyDirectorySetting() {
        new Setting(this.containerEl)
            .setName('Ready directory')
            .setDesc('The directory where documents ready to be published will be placed.')
            .addText(text => text
                .setPlaceholder('Enter directory name')
                .setValue(this.plugin.settings.readyDir)
                .onChange(async (value) => {
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
                    this.plugin.settings.publishedDir = value
                    await this.plugin.saveSettings()
                }))
    }

}
