import O2Plugin from '../main';
import { WikiLinkConverter } from './WikiLinkConverter';
import { ResourceLinkConverter } from './ResourceLinkConverter';
import { editorViewField, Notice } from 'obsidian';
import { CalloutConverter } from './CalloutConverter';
import { convertFrontMatter, FrontMatterConverter } from './FrontMatterConverter';
import {
  achieve,
  backupOriginalNotes, cleanUp,
  copyMarkdownFile, moveFiles,
  rename,
  renameMarkdownFile,
  vaultAbsolutePath,
} from '../utils';
import { FootnotesConverter } from './FootnotesConverter';
import { ConverterChain } from '../core/ConverterChain';
import { CommentsConverter } from './CommentsConverter';
import { EmbedsConverter } from './EmbedsConverter';
import { CurlyBraceConverter } from './CurlyBraceConverter';
import JekyllSettings from './settings/JekyllSettings';
import validateSettings from '../core/validation';
import { convertFileName } from './FilenameConverter';
import { Contents } from '../core/Converter';

export const convertToChirpyV2 = async (plugin: O2Plugin) => {
  const settings = plugin.jekyll as JekyllSettings;
  const markdownFiles = await copyMarkdownFile(plugin);
  for (const file of markdownFiles) {
    const fileName = convertFileName(file.name);
    const contents: Contents = await plugin.app.vault.read(file);

    const result = convertFrontMatter(
      contents,
    );

    await plugin.app.vault.modify(file, result)
      .then(() => {
        new Notice('Converted to Chirpy successfully.', 5000);
      });
  }

  // move files to chirpy folder
  await moveFiles(plugin, settings)
    .then(() => {
      new Notice('Moved files to Chirpy successfully.', 5000);
    })
    .finally(() => {
      cleanUp(plugin);
    });
};

export async function convertToChirpy(plugin: O2Plugin) {
  const settings = plugin.jekyll as JekyllSettings;
  // validation
  await validateSettings(plugin, settings);
  await backupOriginalNotes(plugin);

  await achieve(settings.isAutoAchieve, plugin, settings);

  try {
    const markdownFiles = await renameMarkdownFile(plugin);
    for (const file of markdownFiles) {
      const fileName = convertFileName(file.name);

      const frontMatterConverter = new FrontMatterConverter(
        fileName,
        settings.jekyllRelativeResourcePath,
        settings.isEnableBanner,
        settings.isEnableUpdateFrontmatterTimeOnEdit,
      );
      const resourceLinkConverter = new ResourceLinkConverter(
        fileName,
        settings.resourcePath(),
        vaultAbsolutePath(plugin),
        settings.attachmentsFolder,
        settings.jekyllRelativeResourcePath,
      );
      const curlyBraceConverter = new CurlyBraceConverter(
        settings.isEnableCurlyBraceConvertMode,
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

    await moveFiles(plugin, settings);
    new Notice('Chirpy conversion complete.');
  } catch (e) {
    console.error(e);
    new Notice('Chirpy conversion failed.');
  }
}
