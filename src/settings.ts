import { App, PluginSettingTab, Setting } from 'obsidian';
import O2Plugin from './main';
import JekyllSettings from './jekyll/settings/JekyllSettings';
import DocusaurusSettings from './docusaurus/settings/DocusaurusSettings';
import { DateExtractionPattern } from './docusaurus/DateExtractionPattern';

export class ObsidianPathSettings {
  readyFolder: string = 'ready';
  archiveFolder: string = 'archive';
  attachmentsFolder: string = 'attachments';
  isAutoArchive: boolean = false;
  isAutoCreateFolder: boolean = false;
}

export interface O2PluginSettings {
  targetPath(): string;

  resourcePath(): string;

  afterPropertiesSet(): boolean;

  pathReplacer(year: string, month: string, day: string, title: string): string;
}

export class O2SettingTab extends PluginSettingTab {
  plugin: O2Plugin;

  constructor(app: App, plugin: O2Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty(); // Clear the container. prevent duplicate settings
    this.containerEl.createEl('h1', {
      text: 'Settings for O2 plugin',
    });

    this.containerEl.createEl('h3', {
      text: 'Path Settings',
    });
    this.addReadyFolderSetting();
    this.addArchiveFolderSetting();
    this.addAttachmentsFolderSetting();

    this.containerEl.createEl('h3', {
      text: 'Features',
    });
    this.enableCurlyBraceSetting();
    this.enableUpdateFrontmatterTimeOnEditSetting();
    this.enableAutoCreateFolderSetting();
    this.enableAutoArchiveSetting();

    // jekyll settings
    this.containerEl.createEl('h3', {
      text: 'Jekyll',
    });
    this.addJekyllPathSetting();
    this.addJekyllRelativeResourcePathSetting();
    //// liquidFilter;
    this.containerEl.createEl('h5', {
      text: 'Liquid Filter',
    });

    // docusaurus settings
    this.containerEl.createEl('h3', {
      text: 'Docusaurus',
    });
    this.addDocusaurusPathSetting();
    this.dateExtractionPatternSetting();
    this.addDocusaurusAuthorsSetting();
  }

  private addDocusaurusAuthorsSetting() {
    const docusaurus = this.plugin.docusaurus as DocusaurusSettings;
    new Setting(this.containerEl)
      .setName('Docusaurus authors')
      .setDesc('Author(s) for Docusaurus front matter. For multiple authors, separate with commas.')
      .addText(text => text
        .setPlaceholder('jmarcey, slorber')
        .setValue(docusaurus.authors)
        .onChange(async (value) => {
          docusaurus.authors = value;
          await this.plugin.saveSettings();
        }));
  }

  private enableUpdateFrontmatterTimeOnEditSetting() {
    const jekyllSetting = this.plugin.jekyll as JekyllSettings;
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
    new Setting(this.containerEl)
      .setName('Auto create folders')
      .setDesc('Automatically create necessary folders if they do not exist.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.obsidianPathSettings.isAutoCreateFolder)
        .onChange(async (value) => {
          this.plugin.obsidianPathSettings.isAutoCreateFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private enableCurlyBraceSetting() {
    const jekyllSetting = this.plugin.jekyll as JekyllSettings;
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
    const jekyllSetting = this.plugin.jekyll as JekyllSettings;
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
    const jekyllSetting = this.plugin.jekyll as JekyllSettings;
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
        .setValue(this.plugin.obsidianPathSettings.attachmentsFolder)
        .onChange(async (value) => {
          this.plugin.obsidianPathSettings.attachmentsFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addReadyFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to convert notes to another syntax in')
      .setDesc('Where the notes will be converted to another syntax.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.obsidianPathSettings.readyFolder)
        .onChange(async (value) => {
          this.plugin.obsidianPathSettings.readyFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addArchiveFolderSetting() {
    new Setting(this.containerEl)
      .setName('Folder to Archive notes in')
      .setDesc('Where the notes will be archived after conversion.')
      .addText(text => text
        .setPlaceholder('Enter folder name')
        .setValue(this.plugin.obsidianPathSettings.archiveFolder)
        .onChange(async (value) => {
          this.plugin.obsidianPathSettings.archiveFolder = value;
          await this.plugin.saveSettings();
        }));
  }

  private addDocusaurusPathSetting() {
    const docusaurus = this.plugin.docusaurus as DocusaurusSettings;
    new Setting(this.containerEl)
      .setName('Docusaurus path')
      .setDesc('The absolute path where Docusaurus workspace is located.')
      .addText(text => text
        .setPlaceholder('Enter path')
        .setValue(docusaurus.docusaurusPath)
        .onChange(async (value) => {
          docusaurus.docusaurusPath = value;
          await this.plugin.saveSettings();
        }));
  }

  private dateExtractionPatternSetting() {
    const docusaurus = this.plugin.docusaurus as DocusaurusSettings;
    new Setting(this.containerEl)
      .setName('Date extraction pattern')
      .setDesc('The pattern to extract date from note title.')
      .addDropdown(dropdown => {
        for (const key in DateExtractionPattern) {
          dropdown.addOption(key, DateExtractionPattern[key].pattern);
        }
        dropdown.setValue(docusaurus.dateExtractionPattern);
        dropdown.onChange(async (value) => {
          docusaurus.dateExtractionPattern = value;
          await this.plugin.saveSettings();
        });
      });
  }

  private enableAutoArchiveSetting() {
    new Setting(this.containerEl)
      .setName('Auto archive')
      .setDesc('Automatically move files to archive folder after converting.')
      .addToggle(toggle => toggle
        .setValue(this.plugin.obsidianPathSettings.isAutoArchive)
        .onChange(async (value) => {
          this.plugin.obsidianPathSettings.isAutoArchive = value;
          await this.plugin.saveSettings();
        }));
  }
}
