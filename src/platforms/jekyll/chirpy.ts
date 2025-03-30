import O2Plugin from '../../main';
import { Notice, TFile } from 'obsidian';
import { WikiLinkConverter } from '../../core/converters/WikiLinkConverter';
import { ResourceLinkConverter } from '../../core/converters/ResourceLinkConverter';
import JekyllSettings from './settings/JekyllSettings';
import { CalloutConverter } from '../../core/converters/CalloutConverter';
import { convertFrontMatter } from '../../core/converters/FrontMatterConverter';
import { copyMarkdownFile, moveFiles, vaultAbsolutePath } from '../../core/utils/utils';
import { FootnotesConverter } from '../../core/converters/FootnotesConverter';
import { ConverterChain } from '../../core/ConverterChain';
import { CommentsConverter } from '../../core/converters/CommentsConverter';
import { EmbedsConverter } from '../../core/converters/EmbedsConverter';
import { CurlyBraceConverter } from '../../core/converters/CurlyBraceConverter';
import { convertFileName } from '../../core/converters/FilenameConverter';
import { isLeft, isRight } from '../../core/types/types';

interface LiquidFilterOptions {
  useRelativeUrl: boolean;
}

export async function convertToChirpy(plugin: O2Plugin) {
  const settings = plugin.jekyll as JekyllSettings;
  try {
    const markdownFiles = await copyMarkdownFile(plugin);
    for (const file of markdownFiles) {
      const fileName = convertFileName(file.name);
      const fileContent = await plugin.app.vault.read(file);
      
      const frontMatterResult = await convertFrontMatter(fileContent);
      
      if (isLeft(frontMatterResult)) {
        console.error('Front matter conversion failed:', frontMatterResult.value);
        continue;
      }
      
      if (!isRight(frontMatterResult)) {
        console.error('Unexpected front matter conversion result');
        continue;
      }

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
        .chaining(resourceLinkConverter)
        .chaining(curlyBraceConverter)
        .chaining(new WikiLinkConverter())
        .chaining(new CalloutConverter())
        .chaining(new FootnotesConverter())
        .chaining(new CommentsConverter())
        .chaining(new EmbedsConverter())
        .converting(frontMatterResult.value);

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
