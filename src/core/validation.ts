import O2Plugin from '../main';
import JekyllSetting from '../jekyll/settings/JekyllSettings';
import { Notice } from 'obsidian';

export default async function validateSettings(plugin: O2Plugin) {
  const adapter = plugin.app.vault.adapter;
  const jekyll = plugin.jekyll as JekyllSetting;
  if (!await adapter.exists(jekyll.attachmentsFolder)) {
    if (jekyll.isAutoCreateFolder) {
      new Notice(`Auto create attachments folder: ${jekyll.attachmentsFolder}.`, 5000);
      await adapter.mkdir(jekyll.attachmentsFolder);
    } else {
      new Notice(`Attachments folder ${jekyll.attachmentsFolder} does not exist.`, 5000);
      throw new Error(`Attachments folder ${jekyll.attachmentsFolder} does not exist.`);
    }
  }
  if (!await adapter.exists(jekyll.readyFolder)) {
    if (jekyll.isAutoCreateFolder) {
      new Notice(`Auto create ready folder: ${jekyll.readyFolder}.`, 5000);
      await adapter.mkdir(jekyll.readyFolder);
    } else {
      new Notice(`Ready folder ${jekyll.readyFolder} does not exist.`, 5000);
      throw new Error(`Ready folder ${jekyll.readyFolder} does not exist.`);
    }
  }
  if (!await adapter.exists(jekyll.backupFolder)) {
    if (jekyll.isAutoCreateFolder) {
      new Notice(`Auto create backup folder: ${jekyll.backupFolder}.`, 5000);
      await adapter.mkdir(jekyll.backupFolder);
    } else {
      new Notice(`Backup folder ${jekyll.backupFolder} does not exist.`, 5000);
      throw new Error(`Backup folder ${jekyll.backupFolder} does not exist.`);
    }
  }
}

