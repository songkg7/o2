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
import { CurlyBraceConverter } from './CurlyBraceConverter';
import JekyllSetting from './settings/JekyllSettings';
import validateSettings from '../core/validation';
import convertFileName from './FilenameConverter';

export async function convertToChirpy(plugin: O2Plugin) {
  // validation
  await validateSettings(plugin);
  await backupOriginalNotes(plugin);

  try {
    const markdownFiles = await renameMarkdownFile(plugin);
    for (const file of markdownFiles) {
      const fileName = convertFileName(file.name);

      const jekyll = plugin.jekyll as JekyllSetting;
      const frontMatterConverter = new FrontMatterConverter(
        fileName,
        jekyll.jekyllRelativeResourcePath,
        jekyll.isEnableBanner,
        jekyll.isEnableUpdateFrontmatterTimeOnEdit,
      );
      const resourceLinkConverter = new ResourceLinkConverter(
        fileName,
        jekyll.resourcePath(),
        vaultAbsolutePath(plugin),
        jekyll.attachmentsFolder,
        jekyll.jekyllRelativeResourcePath,
      );
      const curlyBraceConverter = new CurlyBraceConverter(
        jekyll.isEnableCurlyBraceConvertMode,
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

function getFilesInReady(plugin: O2Plugin): TFile[] {
  return plugin.app.vault.getMarkdownFiles()
    .filter((file: TFile) => file.path.startsWith(plugin.jekyll.readyFolder));
}

async function backupOriginalNotes(plugin: O2Plugin) {
  const readyFiles = getFilesInReady.call(this, plugin);
  const backupFolder = plugin.jekyll.backupFolder;
  const readyFolder = plugin.jekyll.readyFolder;
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
      .replace(/\s/g, '-');
    await plugin.app.vault.rename(file, newFilePath);
  }
  return markdownFiles;
}

async function moveFilesToChirpy(plugin: O2Plugin) {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${plugin.jekyll.readyFolder}`;
  const targetFolderPath = plugin.jekyll.targetPath();

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
