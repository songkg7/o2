import { Temporal } from '@js-temporal/polyfill';
import O2Plugin from '../main';
import * as fs from 'fs';
import * as path from 'path';
import { WikiLinkConverter } from './WikiLinkConverter';
import { ResourceLinkConverter } from './ResourceLinkConverter';
import { Notice, TFile } from 'obsidian';
import { CalloutConverter } from './CalloutConverter';
import { FrontMatterConverter } from './FrontMatterConverter';
import { vaultAbsolutePath } from '../utils';
import { FootnotesConverter } from './FootnotesConverter';
import { ConverterChain } from '../core/ConverterChain';
import { CommentsConverter } from './CommentsConverter';
import { EmbedsConverter } from './EmbedsConverter';
import { FilenameConverter } from './FilenameConverter';
import { CurlyBraceConverter } from './CurlyBraceConverter';

// TODO: write test
export async function convertToChirpy(plugin: O2Plugin) {
  // validation
  await validateSettings(plugin);
  await backupOriginalNotes(plugin);

  const filenameConverter = new FilenameConverter();

  try {
    const markdownFiles = await renameMarkdownFile(plugin);
    for (const file of markdownFiles) {
      const fileName = filenameConverter.convert(file.name);

      const frontMatterConverter = new FrontMatterConverter(
        fileName,
        plugin.settings.jekyllSetting().jekyllRelativeResourcePath,
        plugin.settings.jekyllSetting().isEnableBanner,
        plugin.settings.jekyllSetting().isEnableUpdateFrontmatterTimeOnEdit,
      );
      const resourceLinkConverter = new ResourceLinkConverter(
        fileName,
        plugin.settings.jekyllSetting().resourcePath(),
        vaultAbsolutePath(plugin),
        plugin.settings.attachmentsFolder,
        plugin.settings.jekyllSetting().jekyllRelativeResourcePath,
      );
      const curlyBraceConverter = new CurlyBraceConverter(
        plugin.settings.jekyllSetting().isEnableCurlyBraceConvertMode,
      );
      const result = ConverterChain.create()
        .chaining(frontMatterConverter)
        .chaining(resourceLinkConverter)
        .chaining(curlyBraceConverter)
        .chaining(new WikiLinkConverter())
        .chaining(new CalloutConverter())
        .chaining(new FootnotesConverter())
        .chaining(new CommentsConverter())
        .chaining(new EmbedsConverter())
        .converting(await plugin.app.vault.read(file));

      await plugin.app.vault.modify(file, result);
    }

    await moveFilesToChirpy(plugin);
    new Notice('Chirpy conversion complete.');
  } catch (e) {
    // TODO: move file that occurred error to backlog folder
    console.error(e);
    new Notice('Chirpy conversion failed.');
  }
}

async function validateSettings(plugin: O2Plugin) {
  const adapter = plugin.app.vault.adapter;
  if (!await adapter.exists(plugin.settings.attachmentsFolder)) {
    new Notice(`Attachments folder ${plugin.settings.attachmentsFolder} does not exist.`, 5000);
    throw new Error(`Attachments folder ${plugin.settings.attachmentsFolder} does not exist.`);
  }
  if (!await adapter.exists(plugin.settings.readyFolder)) {
    new Notice(`Ready folder ${plugin.settings.readyFolder} does not exist.`, 5000);
    throw new Error(`Ready folder ${plugin.settings.readyFolder} does not exist.`);
    // or mkdir ready folder
  }
  if (!await adapter.exists(plugin.settings.backupFolder)) {
    new Notice(`Backup folder ${plugin.settings.backupFolder} does not exist.`, 5000);
    throw new Error(`Backup folder ${plugin.settings.backupFolder} does not exist.`);
  }
}

function getFilesInReady(plugin: O2Plugin): TFile[] {
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(plugin.settings.readyFolder));
}

async function backupOriginalNotes(plugin: O2Plugin) {
  const readyFiles = getFilesInReady.call(this, plugin);
  const backupFolder = plugin.settings.backupFolder;
  const readyFolder = plugin.settings.readyFolder;
  readyFiles.forEach((file: TFile) => {
    return plugin.app.vault.copy(file, file.path.replace(readyFolder, backupFolder));
  });
}

// FIXME: SRP, renameMarkdownFile(file: TFile): string
async function renameMarkdownFile(plugin: O2Plugin): Promise<TFile[]> {
  const dateString = Temporal.Now.plainDateISO().toString();
  const markdownFiles = getFilesInReady.call(this, plugin);
  for (const file of markdownFiles) {
    const newFileName = dateString + '-' + file.name;
    const newFilePath = file.path
      .replace(file.name, newFileName)
      .replace(' ', '-');
    await plugin.app.vault.rename(file, newFilePath);
  }
  return markdownFiles;
}

async function moveFilesToChirpy(plugin: O2Plugin) {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${plugin.settings.readyFolder}`;
  const targetFolderPath = plugin.settings.targetPath();

  fs.readdir(sourceFolderPath, (err, files) => {
    if (err) throw err;

    files.forEach((filename) => {
      const sourceFilePath = path.join(sourceFolderPath, filename);
      const targetFilePath = path.join(targetFolderPath, filename.replace(/\s/g, '-'));

      fs.rename(sourceFilePath, targetFilePath, (err) => {
        if (err) {
          console.error(err);
          new Notice(err.message);
          throw err;
        }
      });
    });
  });
}
