import { App, PluginSettingTab, Setting } from 'obsidian';
import O2Plugin from './main';
import JekyllSetting from './jekyll/settings/JekyllSettings';

export interface O2PluginSettings {
  attachmentsFolder: string;
  readyFolder: string;
  backupFolder: string;

  targetPath(): string;

  resourcePath(): string;

  afterPropertiesSet(): boolean;
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
    this.addReadyFolderSetting();
    this.addBackupFolderSetting();
    this.addAttachmentsFolderSetting();

    // jekyll settings
    this.containerEl.createEl('h2', {
      text: 'Jekyll',
    });
    this.addJekyllPathSetting();
    this.addJekyllRelativeResourcePathSetting();

    // docusaurus settings
    this.containerEl.createEl('h2', {
      text: 'Docusaurus',
    });
    // this.addDocusaurusPathSetting();

    this.containerEl.createEl('h2', {
      text: 'Features',
    });
    this.enableCurlyBraceSetting();
    this.enableUpdateFrontmatterTimeOnEditSetting();
    this.enableAutoCreateFolderSetting();
  }

  private enableUpdateFrontmatterTimeOnEditSetting() {
    const jekyllSetting = this.plugin.jekyll as JekyllSetting;
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
    const jekyllSetting = this.plugin.jekyll as JekyllSetting;
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
    const jekyllSetting = this.plugin.jekyll as JekyllSetting;
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

  private addJekyllPathSetting() {
    const jekyllSetting = this.plugin.jekyll as JekyllSetting;
    new Setting(this.containerEl)
      .setName('Jekyll path')
      .setDesc('The absolute path where Jekyll workspace is located.')
      .addText(text => text
        .setPlaceholder('Enter path')
        .setValue(jekyllSetting.jekyllPath)
        .onChange(async (value) => {
          jekyllSetting.jekyllPath = value;
          await this.plugin.saveSettings();
        }));
  }

  private addJekyllRelativeResourcePathSetting() {
    const jekyllSetting = this.plugin.jekyll as JekyllSetting;
    new Setting(this.containerEl)
      .setName('Relative resource path')
      .setDesc('The relative path where resources are stored. (default: assets/img)')
      .addText(text => text
        .setPlaceholder('Enter path')
        .setValue(jekyllSetting.jekyllRelativeResourcePath)
        .onChange(async (value) => {
          jekyllSetting.jekyllRelativeResourcePath = value;
          await this.plugin.saveSettings();
        }));
  }

  private addAttachmentsFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to store attachments in')
      .setDesc('Where the attachments will be stored.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.jekyll.attachmentsFolder)
        .onChange(async (value) => {
          this.plugin.jekyll.attachmentsFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addReadyFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to convert notes to another syntax in')
      .setDesc('Where the notes will be converted to another syntax.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.jekyll.readyFolder)
        .onChange(async (value) => {
          this.plugin.jekyll.readyFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addBackupFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to backup notes before execute converting process in')
      .setDesc('Where the notes will be backup before converting.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.jekyll.backupFolder)
        .onChange(async (value) => {
          this.plugin.jekyll.backupFolder = value;
          await this.plugin.saveSettings();
        }));
  }

}
