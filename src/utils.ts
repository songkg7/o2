import O2Plugin from './main';
import { FileSystemAdapter, Notice, TFile } from 'obsidian';
import { Temporal } from '@js-temporal/polyfill';
import fs from 'fs';
import path from 'path';
import { O2PluginSettings } from './settings';

export const TEMP_PREFIX = 'o2-temp.' as const;

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
    const newFileName = TEMP_PREFIX + dateString + '-' + file.name;
    const newPath = file.path
      .replace(file.name, newFileName)
      .replace(/,+/g, '')
      .replace(/\s/g, '-');

    await plugin.app.vault.copy(file, newPath).catch((error) => console.error(error));
  }

  // collect copied files
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.includes(TEMP_PREFIX));
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
  fs.renameSync(sourceFilePath, targetFilePath);
};

export const rename = (sourceFolderPath: string, targetFolderPath: string) => {
  const dirent = fs.readdirSync(sourceFolderPath, { withFileTypes: true });
  dirent.forEach((file) => {
    if (file.name.startsWith(TEMP_PREFIX)) {
      const sourceFilePath = path.join(sourceFolderPath, file.name);
      const targetFilePath = path.join(targetFolderPath, file.name.replace(TEMP_PREFIX, '').replace(/\s/g, '-'));
      renameFile(sourceFilePath, targetFilePath);
    }
  });
};

export const achieve = async (plugin: O2Plugin, settings: O2PluginSettings) => {
  if (!settings.isAutoAchieve) {
    return;
  }

  // move files to achieve folder
  const readyFiles = getFilesInReady(plugin);
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(settings.readyFolder, settings.achieveFolder));
  });
};

export const moveFiles = async (plugin: O2Plugin, settings: O2PluginSettings) => {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${settings.readyFolder}`;
  const targetFolderPath = settings.targetPath();

  // only temp files
  await rename(sourceFolderPath, targetFolderPath);
};

export const cleanUp = (plugin: O2Plugin) => {
  // remove temp files
  const markdownFiles = plugin.app.vault.getMarkdownFiles()
    .filter((file) => file.path.includes(TEMP_PREFIX));

  markdownFiles.forEach((file) => {
    plugin.app.vault.delete(file)
      .then(() => {
        console.log(`Deleted temp file: ${file.path}`);
      });
  });
};
