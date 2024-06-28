import O2Plugin from '../main';
import { copyMarkdownFile, vaultAbsolutePath } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import fs from 'fs';
import path from 'path';
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

    await plugin.app.vault.modify(file, result);
  }

  // move files to docusaurus folder
  await moveFiles(plugin, plugin.docusaurus)
    .then(() => {
      new Notice('Converted to Docusaurus successfully.', 5000);
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
  fs.readdir(sourceFolderPath, (err, files) => {
    if (err) throw err;

    files
      .filter((filename) => filename.startsWith(PREFIX))
      .forEach((filename) => {
        const sourceFilePath = path.join(sourceFolderPath, filename);
        const targetFilePath = path.join(targetFolderPath, filename.replace(PREFIX, '').replace(/\s/g, '-'));

        fs.rename(sourceFilePath, targetFilePath, (err) => {
          if (err) {
            console.error(err);
            new Notice(err.message);
            throw err;
          }
        });
      });
  });
};
