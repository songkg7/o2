import { App, PluginSettingTab, Setting } from "obsidian";
import O2Plugin from "./main";

export interface O2PluginSettings {
    attachmentsFolder: string;
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
    private _jekyllPath: string;
    private _jekyllRelativeResourcePath: string;

    constructor() {
        this.attachmentsFolder = 'attachments';
        this.readyFolder = 'ready';
        this.backupFolder = 'backup';
        this._jekyllPath = '';
        this._jekyllRelativeResourcePath = 'assets/img';
    }

    get jekyllPath(): string {
        return this._jekyllPath;
    }

    set jekyllPath(value: string) {
        this._jekyllPath = value;
    }

    get jekyllRelativeResourcePath(): string {
        return this._jekyllRelativeResourcePath;
    }

    set jekyllRelativeResourcePath(value: string) {
        this._jekyllRelativeResourcePath = value;
    }

    targetPath(): string {
        return `${this._jekyllPath}/_posts`;
    }

    resourcePath(): string {
        return `${this._jekyllPath}/${this._jekyllRelativeResourcePath}`;
    }

    afterPropertiesSet(): boolean {
        return this._jekyllPath != '';
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
        const jekyllSetting = this.plugin.settings.jekyllSetting();
        new Setting(this.containerEl)
            .setName('Jekyll path')
            .setDesc('The absolute path where Jekyll is installed.')
            .addText(text => text
                .setPlaceholder('Enter path')
                .setValue(jekyllSetting.jekyllPath)
                .onChange(async (value) => {
                    jekyllSetting.jekyllPath = value;
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
