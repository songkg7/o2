import O2Plugin from './main';
import { FileSystemAdapter, Notice, TFile } from 'obsidian';
import { Temporal } from '@js-temporal/polyfill';
import fs from 'fs';
import path from 'path';
import { O2PluginSettings } from './settings';
import { DateExtractionPattern } from './docusaurus/DateExtractionPattern';

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

    await plugin.app.vault.copy(file, newPath)
      .catch((error) => {
        console.error(error);
        new Notice('Failed to copy file, see console for more information.');
      });
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
  // if directory not exist create it
  const targetDirectory = path.dirname(targetFilePath);
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  }
  fs.renameSync(sourceFilePath, targetFilePath);
};

export const rename = (
  sourceFolderPath: string,
  targetFolderPath: string,
  replacer: (year: string, month: string, day: string, title: string) => string,
) => {
  fs.readdirSync(sourceFolderPath)
    .filter(f => f.startsWith(TEMP_PREFIX))
    .forEach((filename) => {
      const transformedFileName = transformPath(filename, replacer);
      console.log(`Renaming ${filename} to ${transformedFileName}`);

      const sourceFilePath = path.join(sourceFolderPath, filename);
      const targetFilePath = path.join(targetFolderPath, transformedFileName.replace(TEMP_PREFIX, '').replace(/\s/g, '-'));

      renameFile(sourceFilePath, targetFilePath);
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

export const moveFiles = async (
  plugin: O2Plugin,
  settings: O2PluginSettings,
) => {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${settings.readyFolder}`;
  const targetFolderPath = settings.targetPath();
  rename(
    sourceFolderPath,
    targetFolderPath,
    (year, month, day, title) => {
      return settings.pathReplacer(year, month, day, title);
    },
  );
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

// prepare path related to docusaurus date extraction type
// e.g. directory candidates that should be created have to refer to date extraction type.
// return path to be created, and this path is target path
const transformPath = (
  input: string,
  replacer: (year: string, month: string, day: string, title: string) => string,
): string => {
  const match = input.match(DateExtractionPattern['SINGLE'].regexp);
  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];
    const title = match[4];
    return replacer(year, month, day, title);
  }
  return input;
};
