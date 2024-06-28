import O2Plugin from '../main';
import { copyMarkdownFile, rename, vaultAbsolutePath } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { Notice } from 'obsidian';
import { O2PluginSettings } from '../settings';

export const PREFIX = 'o2-temp.' as const;

export const convertToDocusaurus = async (plugin: O2Plugin) => {
  // get file name in ready folder
  const markdownFiles = await copyMarkdownFile(plugin);
  // TODO: prepare path related to docusaurus date extraction type
  // e.g. directory candidates that should be created have to refer to date extraction type.

  for (const file of markdownFiles) {
    const contents: Contents = await plugin.app.vault.read(file);
    const result =
      convertComments(
        convertDocusaurusCallout(
          convertFootnotes(
            convertWikiLink(
              contents,
            ),
          ),
        ),
      );

    await plugin.app.vault.modify(file, result)
      .then(() => {
        new Notice('Converted to Docusaurus successfully.', 5000);
      });
  }

  // move files to docusaurus folder
  await moveFiles(plugin, plugin.docusaurus)
    .then(() => {
      new Notice('Moved files to Docusaurus successfully.', 5000);
    })
    .finally(() => {
      cleanUp(plugin);
    });
};

const cleanUp = (plugin: O2Plugin) => {
  // remove temp files
  const markdownFiles = plugin.app.vault.getMarkdownFiles()
    .filter((file) => file.path.includes(PREFIX));

  markdownFiles.forEach((file) => {
    plugin.app.vault.delete(file) // FIXME: print error message
      .then(() => {
        console.log(`Deleted temp file: ${file.path}`);
      });
  });
};

const moveFiles = async (plugin: O2Plugin, settings: O2PluginSettings) => {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${settings.readyFolder}`;
  const targetFolderPath = settings.targetPath();

  // only temp files
  rename(sourceFolderPath, targetFolderPath);
};
