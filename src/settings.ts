import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import O2Plugin from './main';
import jekyllSettingsView from './jekyll/settingsView/jekyllSettingsView';

export interface O2PluginSettings {
  targetPlatform: string;
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;

  jekyllSetting(): JekyllSetting;

  targetPath(): string;

  resourcePath(): string;

  afterPropertiesSet(): boolean;
}

export class JekyllSetting implements O2PluginSettings {
  targetPlatform: string;
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;
  private _jekyllPath: string;
  private _jekyllRelativeResourcePath: string;
  private _isAutoCreateFolder: boolean;

  // FIXME: abstraction
  private _isEnableBanner: boolean;
  private _isEnableCurlyBraceConvertMode: boolean;
  private _isEnableUpdateFrontmatterTimeOnEdit: boolean;

  constructor() {
    this.attachmentsFolder = 'attachments';
    this.readyFolder = 'ready';
    this.backupFolder = 'backup';
    this._jekyllPath = '';
    this._jekyllRelativeResourcePath = 'assets/img';
    this._isAutoCreateFolder = false;
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

  get isEnableBanner(): boolean {
    return this._isEnableBanner;
  }

  set isEnableBanner(value: boolean) {
    this._isEnableBanner = value;
  }

  get isEnableCurlyBraceConvertMode(): boolean {
    return this._isEnableCurlyBraceConvertMode;
  }

  set isEnableCurlyBraceConvertMode(value: boolean) {
    this._isEnableCurlyBraceConvertMode = value;
  }

  get isEnableUpdateFrontmatterTimeOnEdit(): boolean {
    return this._isEnableUpdateFrontmatterTimeOnEdit;
  }

  set isEnableUpdateFrontmatterTimeOnEdit(value: boolean) {
    this._isEnableUpdateFrontmatterTimeOnEdit = value;
  }

  get isAutoCreateFolder(): boolean {
    return this._isAutoCreateFolder;
  }

  set isAutoCreateFolder(value: boolean) {
    this._isAutoCreateFolder = value;
  }

  targetPath(): string {
    return `${this._jekyllPath}/_posts`;
  }

  resourcePath(): string {
    return `${this._jekyllPath}/${this._jekyllRelativeResourcePath}`;
  }

  afterPropertiesSet(): boolean {
    if (this._jekyllPath === '') {
      new Notice('Jekyll path is not set.', 5000);
      return false;
    }
    return true;
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
    this.containerEl.createEl('h1', {
      text: 'Settings for O2 plugin',
    });
    this.containerEl.createEl('h2', {
      text: 'Path Settings',
    });

    this.platformDropdownSetting();
    this.addReadyFolderSetting();
    this.addBackupFolderSetting();
    this.addAttachmentsFolderSetting();

    jekyllSettingsView();

    this.containerEl.createEl('h2', {
      text: 'Features',
    });
    this.enableCurlyBraceSetting();
    this.enableUpdateFrontmatterTimeOnEditSetting();
    this.enableAutoCreateFolderSetting();
  }

  private platformDropdownSetting() {
    new Setting(this.containerEl)
      .setName('Target Platform')
      .setDesc('Select the platform to convert to.')
      .addDropdown(dropdown => {
        dropdown
          .addOptions({
            jekyll: 'Jekyll',
            docusaurus: 'Docusaurus',
          });
        dropdown.setValue(this.plugin.settings.targetPlatform);
        dropdown.onChange(async (value) => {
          this.plugin.settings.targetPlatform = value;
          await this.plugin.saveSettings();
        });
      });
  }

  private enableUpdateFrontmatterTimeOnEditSetting() {
    const jekyllSetting = this.plugin.settings.jekyllSetting();
    new Setting(this.containerEl)
      .setName('Replace date frontmatter to updated time')
      .setDesc('If \'updated\' frontmatter exists, replace the value of \'date\' frontmatter with the value of \'updated\' frontmatter.')
      .addToggle(toggle => toggle
        .setValue(jekyllSetting.isEnableUpdateFrontmatterTimeOnEdit)
        .onChange(async (value) => {
          jekyllSetting.isEnableUpdateFrontmatterTimeOnEdit = value;
          await this.plugin.saveSettings();
        }));
  }

  private enableAutoCreateFolderSetting() {
    const jekyllSetting = this.plugin.settings.jekyllSetting();
    new Setting(this.containerEl)
      .setName('Auto create folders')
      .setDesc('Automatically create necessary folders if they do not exist.')
      .addToggle(toggle => toggle
        .setValue(jekyllSetting.isAutoCreateFolder)
        .onChange(async (value) => {
          jekyllSetting.isAutoCreateFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private enableCurlyBraceSetting() {
    const jekyllSetting = this.plugin.settings.jekyllSetting();
    new Setting(this.containerEl)
      .setName('Curly Brace Conversion')
      .setDesc('Convert double curly braces to jekyll raw tag.')
      .addToggle(toggle => toggle
        .setValue(jekyllSetting.isEnableCurlyBraceConvertMode)
        .onChange(async (value) => {
          jekyllSetting.isEnableCurlyBraceConvertMode = value;
          await this.plugin.saveSettings();
        }));
  }

  private enableBannerSetting() {
    const jekyllSetting = this.plugin.settings.jekyllSetting();
    new Setting(this.containerEl)
      .setName('Banner Conversion')
      .setDesc('Convert image path of front matter to jekyll banner.')
      .addToggle(toggle => toggle
        .setValue(jekyllSetting.isEnableBanner)
        .onChange(async (value) => {
          jekyllSetting.isEnableBanner = value;
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
