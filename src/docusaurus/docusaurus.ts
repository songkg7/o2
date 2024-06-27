import O2Plugin from '../main';
import { copyMarkdownFile, vaultAbsolutePath } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { convertDateFrontMatter } from '../jekyll/FrontMatterConverter';
import fs from 'fs';
import path from 'path';
import { Notice } from 'obsidian';
import { O2PluginSettings } from '../settings';

export const convertToDocusaurus = async (plugin: O2Plugin) => {
  // get file name in ready folder
  const markdownFiles = await copyMarkdownFile(plugin);
  for (const file of markdownFiles) {
    const contents: Contents = await plugin.app.vault.read(file);
    const result = convertDateFrontMatter(true,
      convertComments(
        convertDocusaurusCallout(
          convertFootnotes(
            convertWikiLink(
              contents,
            ),
          ),
        ),
      ),
    );

    await plugin.app.vault.modify(file, result);
  }

  // move files to docusaurus folder
  await moveFiles(plugin, plugin.docusaurus)
    .then(() => {
      new Notice('Docusaurus conversion completed.');
    })
    .finally(() => {
      cleanUp(plugin);
    });
};

const cleanUp = (plugin: O2Plugin) => {
  // remove temp files
  const prefix = 'o2-temp.';
  const markdownFiles = plugin.app.vault.getMarkdownFiles()
    .filter((file) => file.path.includes(prefix));

  markdownFiles.forEach((file) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
        new Notice(err.message);
        throw err;
      }
    });
  });
};

const moveFiles = async (plugin: O2Plugin, settings: O2PluginSettings) => {
  const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${settings.readyFolder}`;
  const targetFolderPath = settings.targetPath();

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
};
