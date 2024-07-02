import { Converter } from './core/Converter';
import { ObsidianRegex } from './core/ObsidianRegex';

export class EmbedsConverter implements Converter {
  convert(input: string): string {
    return input.replace(ObsidianRegex.EMBEDDED_LINK, '$1');
  }
}
