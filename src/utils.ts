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

export const getFilesInReady = (plugin: O2Plugin): TFile[] =>
  plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(plugin.jekyll.readyFolder));

export async function backupOriginalNotes(plugin: O2Plugin) {
  const readyFiles = getFilesInReady(plugin);
  const backupFolder = plugin.jekyll.achieveFolder;
  const readyFolder = plugin.jekyll.readyFolder;
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(readyFolder, backupFolder));
  });
}

const copyFile = (sourceFilePath: string, targetFilePath: string) => {
  // if directory not exist create it
  const targetDirectory = path.dirname(targetFilePath);
  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory, { recursive: true });
  }
  fs.copyFileSync(sourceFilePath, targetFilePath);
};

export const copy = (
  sourceFolderPath: string,
  targetFolderPath: string,
  replacer: (year: string, month: string, day: string, title: string) => string,
  publishedDate?: LocalDate,
) => {
  fs.readdirSync(sourceFolderPath)
    .filter(filename => filename.startsWith(TEMP_PREFIX))
    .forEach((filename) => {
      const transformedFileName = transformPath(
        filename,
        replacer,
        publishedDate,
      );

      const sourceFilePath = path.join(sourceFolderPath, filename);
      const targetFilePath = path.join(targetFolderPath, transformedFileName.replace(TEMP_PREFIX, '').replace(/\s/g, '-'));

      copyFile(sourceFilePath, targetFilePath);
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
  sourceFolderPath: string,
  targetFolderPath: string,
  pathReplacer: (year: string, month: string, day: string, title: string) => string,
  publishedDate?: LocalDate,
) => {

  copy(
    sourceFolderPath,
    targetFolderPath,
    pathReplacer,
    publishedDate,
  );
};


export const cleanUp = async (plugin: O2Plugin) => {
  // remove temp files
  const markdownFiles = plugin.app.vault.getMarkdownFiles()
    .filter((file) => file.path.includes(TEMP_PREFIX));

  for (const file of markdownFiles) {
    await plugin.app.vault.delete(file)
      .then(() => {
        console.log(`Deleted temp file: ${file.path}`);
      });
  }
};

// prepare path related to docusaurus date extraction type
// e.g. directory candidates that should be created have to refer to date extraction type.
// return path to be created, and this path is target path
const transformPath = (
  input: string,
  replacer: (year: string | number, month: string | number, day: string | number, title: string) => string,
  date?: LocalDate,
): string => {
  const match = input.match(DateExtractionPattern['SINGLE'].regexp);
  if (match) {
    const year = date ? date.year : match[1];
    const month = date ? date.month : match[2];
    const day = date ? date.day : match[3];
    const title = match[4];
    return replacer(year, month, day, title);
  }
  return input;
};

interface LocalDate {
  year: string;
  month: string;
  day: string;
}

export const parseLocalDate = (date: string): LocalDate => {
  const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) {
    throw new Error('Invalid date format');
  }
  return {
    year: match[1],
    month: match[2],
    day: match[3],
  };
};
