import { App, PluginSettingTab, Setting } from "obsidian";
import O2Plugin from "./main";

export interface O2PluginSettings {
    attachmentsFolder: string
    readyFolder: string;
    backupFolder: string;

    jekyllSetting(): JekyllSetting;

    targetPath(): string;

    resourcePath(): string;

    afterPropertiesSet(): boolean;
}

export class JekyllSetting implements O2PluginSettings {
    attachmentsFolder: string;
    readyFolder: string;
    backupFolder: string;
    jekyllPath: string;
    jekyllRelativeResourcePath: string;

    constructor() {
        this.attachmentsFolder = 'attachments';
        this.readyFolder = 'ready';
        this.backupFolder = 'backup';
        this.jekyllPath = '';
        this.jekyllRelativeResourcePath = 'assets/img';
    }

    targetPath(): string {
        return `${this.jekyllPath}/_posts`;
    }

    resourcePath(): string {
        return `${this.jekyllPath}/${this.jekyllRelativeResourcePath}`;
    }

    afterPropertiesSet(): boolean {
        return this.jekyllPath != '';
    }

    // FIXME: As I know, abstraction is better solution but this is something weird.
    // temporary solution
    jekyllSetting(): JekyllSetting {
        return this;
    }
}

export class O2SettingTab extends PluginSettingTab {
    plugin: O2Plugin;

    constructor(app: App, plugin: O2Plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        this.containerEl.empty();
        this.containerEl.createEl('h2', {
            text: 'Settings for O2 plugin.',
        });
        this.addReadyFolderSetting();
        this.addBackupFolderSetting();
        this.addAttachmentsFolderSetting();
        this.addJekyllPathSetting();
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
                    this.plugin.settings.jekyllSetting().jekyllPath = value;
                    await this.plugin.saveSettings();
                }));
    }

    private addAttachmentsFolderSetting() {
        new Setting(this.containerEl)
            .setName('Folder to store attachments in')
            .setDesc('Where the attachments will be stored.')
            .addText(text => text
                .setPlaceholder('Enter folder name')
                .setValue(this.plugin.settings.attachmentsFolder)
                .onChange(async (value) => {
                    this.plugin.settings.attachmentsFolder = value;
                    await this.plugin.saveSettings();
                }));
    }

    private addReadyFolderSetting() {
        new Setting(this.containerEl)
            .setName('Folder to convert notes to another syntax in')
            .setDesc('Where the notes will be converted to another syntax.')
            .addText(text => text
                .setPlaceholder('Enter folder name')
                .setValue(this.plugin.settings.readyFolder)
                .onChange(async (value) => {
                    this.plugin.settings.readyFolder = value;
                    await this.plugin.saveSettings();
                }));
    }

    private addBackupFolderSetting() {
        new Setting(this.containerEl)
            .setName('Folder to backup notes before execute converting process in')
            .setDesc('Where the notes will be backup before converting.')
            .addText(text => text
                .setPlaceholder('Enter folder name')
                .setValue(this.plugin.settings.backupFolder)
                .onChange(async (value) => {
                    this.plugin.settings.backupFolder = value;
                    await this.plugin.saveSettings();
                }));
    }

}
