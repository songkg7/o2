import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../Converter';

export class FootnotesConverter implements Converter {
  convert(input: string): string {
    return input.replace(ObsidianRegex.SIMPLE_FOOTNOTE, (match, key) => {
      return `[^fn-nth-${key}]`;
    });
  }
}

export const convertFootnotes = (input: string) =>
  input.replace(
    ObsidianRegex.SIMPLE_FOOTNOTE,
    (match, key) => `[^fn-nth-${key}]`,
  );
