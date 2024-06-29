import O2Plugin from '../main';
import { copyMarkdownFile, getFilesInReady, moveFiles, vaultAbsolutePath } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { Notice } from 'obsidian';
import { convertFrontMatter } from '../jekyll/FrontMatterConverter';

const markPublished = async (plugin: O2Plugin) => {
  const filesInReady = getFilesInReady(plugin);
  for (const file of filesInReady) {
    await plugin.app.fileManager.processFrontMatter(
      file,
      fm => {
        if (fm.published) {
          return fm;
        }
        fm.published = new Date().toISOString().split('T')[0];
        return fm;
      },
    );
  }
};

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

    // move files to docusaurus folder
    await moveFiles(
      file,
      `${vaultAbsolutePath(plugin)}/${plugin.docusaurus.readyFolder}`,
      plugin.docusaurus.targetPath(),
      plugin.docusaurus.pathReplacer,
    )
      .then(async () => await markPublished(plugin));
  }

  new Notice('Moved files to Docusaurus successfully.', 5000);
};
