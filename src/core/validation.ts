import O2Plugin from '../main';
import { Notice } from 'obsidian';
import { O2PluginSettings } from '../settings';

export default async function validateSettings(plugin: O2Plugin, settings: O2PluginSettings) {
  const adapter = plugin.app.vault.adapter;
  if (!await adapter.exists(settings.attachmentsFolder)) {
    if (settings.isAutoCreateFolder) {
      new Notice(`Auto create attachments folder: ${settings.attachmentsFolder}.`, 5000);
      await adapter.mkdir(settings.attachmentsFolder);
    } else {
      new Notice(`Attachments folder ${settings.attachmentsFolder} does not exist.`, 5000);
      throw new Error(`Attachments folder ${settings.attachmentsFolder} does not exist.`);
    }
  }
  if (!await adapter.exists(settings.readyFolder)) {
    if (settings.isAutoCreateFolder) {
      new Notice(`Auto create ready folder: ${settings.readyFolder}.`, 5000);
      await adapter.mkdir(settings.readyFolder);
    } else {
      new Notice(`Ready folder ${settings.readyFolder} does not exist.`, 5000);
      throw new Error(`Ready folder ${settings.readyFolder} does not exist.`);
    }
  }
  if (!await adapter.exists(settings.backupFolder)) {
    if (settings.isAutoCreateFolder) {
      new Notice(`Auto create backup folder: ${settings.backupFolder}.`, 5000);
      await adapter.mkdir(settings.backupFolder);
    } else {
      new Notice(`Backup folder ${settings.backupFolder} does not exist.`, 5000);
      throw new Error(`Backup folder ${settings.backupFolder} does not exist.`);
    }
  }
}

