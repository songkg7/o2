import O2Plugin from '../main';
import { copyMarkdownFile, moveFiles } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { Notice } from 'obsidian';
import { convertFrontMatter } from '../jekyll/FrontMatterConverter';
import DocusaurusSettings from './settings/DocusaurusSettings';

export const convertToDocusaurus = async (plugin: O2Plugin) => {
  // get file name in ready folder
  const markdownFiles = await copyMarkdownFile(plugin);

  for (const file of markdownFiles) {
    const contents: Contents = await plugin.app.vault.read(file);
    const result =
      convertComments(
        convertDocusaurusCallout(
          convertFootnotes(
            convertWikiLink(
              convertFrontMatter(
                contents,
              ),
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
    });
};
