import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import O2Plugin from './main';

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

export interface O2PluginSettings {
  attachmentsFolder: string;
  sourceFolder: string;
  outputFolder: string;

  // Rest of the code remains the same...
}

export class JekyllSetting implements O2PluginSettings {
  attachmentsFolder: string;
  sourceFolder: string;
  outputFolder: string;

  // Rest of the code remains the same...

  constructor() {
    this.attachmentsFolder = 'attachments';
    this.sourceFolder = 'source';
    this.outputFolder = 'output';
    // Rest of the code remains the same...
  }

  // Rest of the code remains the same...
}

export class O2SettingTab extends PluginSettingTab {
  // Rest of the code remains the same...

  private addSourceFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to source notes from')
      .setDesc('Where the notes will be sourced from.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.settings.sourceFolder)
        .onChange(async (value) => {
          this.plugin.settings.sourceFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addOutputFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to output converted notes to')
      .setDesc('Where the notes will be output after converting.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.settings.outputFolder)
        .onChange(async (value) => {
          this.plugin.settings.outputFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  // Rest of the code remains the same...
}
