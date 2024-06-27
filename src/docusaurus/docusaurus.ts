import O2Plugin from '../main';
import { renameMarkdownFile } from '../utils';
import convertFileName from '../jekyll/FilenameConverter';
import DocusaurusSettings from './settings/DocusaurusSettings';
import { Contents } from '../core/Converter';
import { convertWikiLink } from '../jekyll/WikiLinkConverter';

export async function convertToDocusaurus(plugin: O2Plugin) {
  // get file name in ready folder
  const markdownFiles = await renameMarkdownFile(plugin);
  for (const file of markdownFiles) {
    const fileName = convertFileName(file.name);
    const docusaurus = plugin.docusaurus as DocusaurusSettings;
    const contents: Contents = await plugin.app.vault.read(file);
    convertWikiLink(contents);
  }
}
