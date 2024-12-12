import { ObsidianRegex } from './core/ObsidianRegex';
import { Converter } from './core/Converter';

export class WikiLinkConverter implements Converter {
  convert(input: string): string {
    return input.replace(ObsidianRegex.WIKI_LINK, (match, p1, p2) =>
      p2 ? p2 : p1,
    );
  }
}

export const convertWikiLink = (input: string) =>
  input.replace(ObsidianRegex.WIKI_LINK, (match, p1, p2) => (p2 ? p2 : p1));
