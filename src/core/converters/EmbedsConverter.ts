import { Converter } from '../Converter';
import { ObsidianRegex } from '../ObsidianRegex';

export class EmbedsConverter implements Converter {
  convert(input: string): string {
    return input.replace(ObsidianRegex.EMBEDDED_LINK, '$1');
  }
}
