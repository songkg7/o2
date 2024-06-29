import O2Plugin from '../main';
import { copyMarkdownFile, getFilesInReady, moveFiles } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { Notice } from 'obsidian';
import { addFrontMatter, convertFrontMatter } from '../jekyll/FrontMatterConverter';

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
  await moveFiles(
    plugin,
    plugin.docusaurus,
  )
    .then(async () => {
      console.log('Moved files to Docusaurus successfully. 1/2');
      // TODO: add published front matter to original file
      // 1. get ready files
      // 2. add published front matter
      const filesInReady = getFilesInReady(plugin);
      for (const file of filesInReady) {
        const contents: Contents = await plugin.app.vault.read(file);
        const newBody = addFrontMatter(contents, { published: new Date().toISOString().split('T')[0] });
        await plugin.app.vault.modify(file, newBody);
      }
    })
    .then(() => {
      console.log('Moved files to Docusaurus successfully. 2/2');
      new Notice('Moved files to Docusaurus successfully.', 5000);
    });
};
