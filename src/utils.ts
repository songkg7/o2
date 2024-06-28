import O2Plugin from './main';
import { FileSystemAdapter, Notice, TFile } from 'obsidian';
import { Temporal } from '@js-temporal/polyfill';
import { PREFIX } from './docusaurus/docusaurus';
import fs from 'fs';
import path from 'path';
import { O2PluginSettings } from './settings';

export function vaultAbsolutePath(plugin: O2Plugin): string {
  const adapter = plugin.app.vault.adapter;
  if (adapter instanceof FileSystemAdapter) {
    return adapter.getBasePath();
  }
  new Notice('Vault is not a file system adapter');
  throw new Error('Vault is not a file system adapter');
}

export async function renameMarkdownFile(plugin: O2Plugin): Promise<TFile[]> {
  const dateString = Temporal.Now.plainDateISO().toString();
  const markdownFiles = getFilesInReady(plugin);
  for (const file of markdownFiles) {
    const newFileName = dateString + '-' + file.name;
    const newFilePath = file.path
      .replace(file.name, newFileName)
      .replace(/,+/g, '')
      .replace(/\s/g, '-');
    await plugin.app.vault.rename(file, newFilePath);
  }
  return markdownFiles;
}

export const copyMarkdownFile = async (plugin: O2Plugin): Promise<TFile[]> => {
  const dateString = Temporal.Now.plainDateISO().toString();
  const markdownFiles = getFilesInReady(plugin);
  for (const file of markdownFiles) {
    const newFileName = PREFIX + dateString + '-' + file.name;
    const newPath = file.path
      .replace(file.name, newFileName)
      .replace(/,+/g, '')
      .replace(/\s/g, '-');

    await plugin.app.vault.copy(file, newPath)
      .catch((error) => {
        console.error(error);
        new Notice('Failed to copy file, see console for more information.');
      });
  }

  // collect copied files
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.includes(PREFIX));
};

function getFilesInReady(plugin: O2Plugin): TFile[] {
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(plugin.jekyll.readyFolder));
}

export async function backupOriginalNotes(plugin: O2Plugin) {
  const readyFiles = getFilesInReady(plugin);
  const backupFolder = plugin.jekyll.achieveFolder;
  const readyFolder = plugin.jekyll.readyFolder;
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(readyFolder, backupFolder));
  });
}

const renameFile = (sourceFilePath: string, targetFilePath: string) => {
  fs.rename(sourceFilePath, targetFilePath, (err) => {
    if (err) {
      console.error(err);
      new Notice(err.message);
      throw err;
    }
  });
};

export const rename = (sourceFolderPath: string, targetFolderPath: string) => {
  fs.readdir(sourceFolderPath, (err, files) => {
    if (err) throw err;

    files
      .filter((filename) => filename.startsWith(PREFIX))
      .forEach((filename) => {
        const sourceFilePath = path.join(sourceFolderPath, filename);
        const targetFilePath = path.join(targetFolderPath, filename.replace(PREFIX, '').replace(/\s/g, '-'));
        renameFile(sourceFilePath, targetFilePath);
      });
  });
};

export const achieve = async (isEnable: boolean, plugin: O2Plugin, settings: O2PluginSettings) => {
  if (!isEnable) {
    return;
  }

  // move files to achieve folder
  const readyFiles = getFilesInReady(plugin);
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(settings.readyFolder, settings.achieveFolder));
  });
};
