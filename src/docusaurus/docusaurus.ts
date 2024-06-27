import O2Plugin from '../main';
import { renameMarkdownFile } from '../utils';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';
import { convertFootnotes } from '../jekyll/FootnotesConverter';
import { convertDocusaurusCallout } from '../jekyll/CalloutConverter';
import { convertComments } from '../jekyll/CommentsConverter';

export const convertToDocusaurus = async (plugin: O2Plugin) => {
  // get file name in ready folder
  const markdownFiles = await renameMarkdownFile(plugin);
  for (const file of markdownFiles) {
    const contents: Contents = await plugin.app.vault.read(file);
    convertComments(
      convertDocusaurusCallout(
        convertFootnotes(
          convertWikiLink(
            contents,
          ),
        ),
      ),
    );
  }
};
