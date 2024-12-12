import O2Plugin from '../main';
import { Notice } from 'obsidian';

export default async (plugin: O2Plugin) => {
  const adapter = plugin.app.vault.adapter;
  if (!(await adapter.exists(plugin.obsidianPathSettings.attachmentsFolder))) {
    if (plugin.obsidianPathSettings.isAutoCreateFolder) {
      new Notice(
        `Auto create attachments folder: ${plugin.obsidianPathSettings.attachmentsFolder}.`,
        5000,
      );
      await adapter.mkdir(plugin.obsidianPathSettings.attachmentsFolder);
    } else {
      new Notice(
        `Attachments folder ${plugin.obsidianPathSettings.attachmentsFolder} does not exist.`,
        5000,
      );
      throw new Error(
        `Attachments folder ${plugin.obsidianPathSettings.attachmentsFolder} does not exist.`,
      );
    }
  }
  if (!(await adapter.exists(plugin.obsidianPathSettings.readyFolder))) {
    if (plugin.obsidianPathSettings.isAutoCreateFolder) {
      new Notice(
        `Auto create ready folder: ${plugin.obsidianPathSettings.readyFolder}.`,
        5000,
      );
      await adapter.mkdir(plugin.obsidianPathSettings.readyFolder);
    } else {
      new Notice(
        `Ready folder ${plugin.obsidianPathSettings.readyFolder} does not exist.`,
        5000,
      );
      throw new Error(
        `Ready folder ${plugin.obsidianPathSettings.readyFolder} does not exist.`,
      );
    }
  }
  if (!(await adapter.exists(plugin.obsidianPathSettings.archiveFolder))) {
    if (plugin.obsidianPathSettings.isAutoCreateFolder) {
      new Notice(
        `Auto create backup folder: ${plugin.obsidianPathSettings.archiveFolder}.`,
        5000,
      );
      await adapter.mkdir(plugin.obsidianPathSettings.archiveFolder);
    } else {
      new Notice(
        `Backup folder ${plugin.obsidianPathSettings.archiveFolder} does not exist.`,
        5000,
      );
      throw new Error(
        `Backup folder ${plugin.obsidianPathSettings.archiveFolder} does not exist.`,
      );
    }
  }
};
