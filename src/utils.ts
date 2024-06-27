import O2Plugin from './main';
import { FileSystemAdapter, Notice, TFile } from 'obsidian';
import { Temporal } from '@js-temporal/polyfill';

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
      .replace(/\s/g, '-');
    await plugin.app.vault.rename(file, newFilePath);
  }
  return markdownFiles;
}

export const copyMarkdownFile = async (plugin: O2Plugin): Promise<TFile[]> => {
  const dateString = Temporal.Now.plainDateISO().toString();
  const markdownFiles = getFilesInReady(plugin);
  for (const file of markdownFiles) {
    const newFileName = 'o2-temp.' + dateString + '-' + file.name;
    const newFilePath = file.path
      .replace(file.name, newFileName)
      .replace(/\s/g, '-');

    await plugin.app.vault.copy(file, newFilePath)
      .catch((error) => {
        console.error(error);
        new Notice('Failed to copy file');
      });
  }
  return markdownFiles;
};

function getFilesInReady(plugin: O2Plugin): TFile[] {
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(plugin.jekyll.readyFolder));
}

export async function backupOriginalNotes(plugin: O2Plugin) {
  const readyFiles = getFilesInReady(plugin);
  const backupFolder = plugin.jekyll.backupFolder;
  const readyFolder = plugin.jekyll.readyFolder;
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(readyFolder, backupFolder));
  });
}
