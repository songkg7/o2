import O2Plugin from '../main';
import { WikiLinkConverter } from '../WikiLinkConverter';
import { ResourceLinkConverter } from '../ResourceLinkConverter';
import { Notice } from 'obsidian';
import { CalloutConverter } from '../CalloutConverter';
import { FrontMatterConverter } from '../FrontMatterConverter';
import { copyMarkdownFile, moveFiles, vaultAbsolutePath } from '../utils';
import { FootnotesConverter } from '../FootnotesConverter';
import { ConverterChain } from '../core/ConverterChain';
import { CommentsConverter } from '../CommentsConverter';
import { EmbedsConverter } from '../EmbedsConverter';
import { CurlyBraceConverter } from '../CurlyBraceConverter';
import JekyllSettings from './settings/JekyllSettings';
import { convertFileName } from '../FilenameConverter';

interface LiquidFilterOptions {
  useRelativeUrl: boolean;
}

export async function convertToChirpy(plugin: O2Plugin) {
  const settings = plugin.jekyll as JekyllSettings;
  try {
    const markdownFiles = await copyMarkdownFile(plugin);
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
        plugin.obsidianPathSettings.attachmentsFolder,
        settings.jekyllRelativeResourcePath,
        { useRelativeUrl: settings.isEnableRelativeUrl } as LiquidFilterOptions,
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

      const path: string = file.path;
      const directory = path.substring(0, path.lastIndexOf('/'));
      const folder = directory.substring(directory.lastIndexOf('/') + 1);

      if (folder !== plugin.obsidianPathSettings.readyFolder) {
        await moveFiles(
          `${vaultAbsolutePath(plugin)}/${plugin.obsidianPathSettings.readyFolder}/${folder}`,
          settings.targetSubPath(folder),
          settings.pathReplacer,
        ).then(() => new Notice('Moved files to Chirpy successfully.', 5000));
      } else {
        await moveFiles(
          `${vaultAbsolutePath(plugin)}/${plugin.obsidianPathSettings.readyFolder}`,
          settings.targetPath(),
          settings.pathReplacer,
        ).then(() => new Notice('Moved files to Chirpy successfully.', 5000));
      }
    }
  } catch (e) {
    console.error(e);
    new Notice('Chirpy conversion failed.');
  }
}
