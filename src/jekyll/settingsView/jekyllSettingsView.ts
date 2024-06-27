import { Setting } from 'obsidian';

export function jekyllSettingsView() {
  addJekyllPathSetting();
  addJekyllRelativeResourcePathSetting();
}

function addJekyllPathSetting() {
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

function addJekyllRelativeResourcePathSetting() {
  const jekyllSetting = this.plugin.settings.jekyllSetting();
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
