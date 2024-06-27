import O2Plugin from '../main';
import { copyMarkdownFile } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';
import { convertDateFrontMatter } from '../jekyll/FrontMatterConverter';

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

  // finally, temp file clean up

};
