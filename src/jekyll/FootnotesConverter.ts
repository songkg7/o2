import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../core/Converter';

export class FootnotesConverter implements Converter {

  convert(input: string): string {
    return input.replace(ObsidianRegex.SIMPLE_FOOTNOTE, (match, key) => {
      return `[^fn-nth-${key}]`;
    });
  }

}
