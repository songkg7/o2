import O2Plugin from '../main';
import { WikiLinkConverter } from './WikiLinkConverter';
import { ResourceLinkConverter } from './ResourceLinkConverter';
import { Notice } from 'obsidian';
import { CalloutConverter } from './CalloutConverter';
import { FrontMatterConverter } from './FrontMatterConverter';
import { backupOriginalNotes, rename, renameMarkdownFile, vaultAbsolutePath } from '../utils';
import { FootnotesConverter } from './FootnotesConverter';
import { ConverterChain } from '../core/ConverterChain';
import { CommentsConverter } from './CommentsConverter';
import { EmbedsConverter } from './EmbedsConverter';
import { CurlyBraceConverter } from './CurlyBraceConverter';
import JekyllSetting from './settings/JekyllSettings';
import validateSettings from '../core/validation';
import { convertFileName } from './FilenameConverter';

export async function convertToChirpy(plugin: O2Plugin) {
  // validation
  await validateSettings(plugin, plugin.jekyll);
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

async function moveFilesToChirpy(plugin: O2Plugin) {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${plugin.jekyll.readyFolder}`;
  const targetFolderPath = plugin.jekyll.targetPath();

  // only temp files
  // FIXME
  rename(sourceFolderPath, targetFolderPath);
}
