import { Converter } from './core/Converter';
import { ObsidianRegex } from './core/ObsidianRegex';

export class CurlyBraceConverter implements Converter {
  private readonly isEnable: boolean;

  constructor(isEnable = false) {
    this.isEnable = isEnable;
  }

  public convert(input: string): string {
    if (!this.isEnable) {
      return input;
    }
    return input.replace(
      ObsidianRegex.DOUBLE_CURLY_BRACES,
      (match, content) => `{% raw %}${match}{% endraw %}`,
    );
  }
}

export const convertCurlyBrace = (isEnable: boolean, input: string) => {
  if (!isEnable) {
    return input;
  }
  return input.replace(
    ObsidianRegex.DOUBLE_CURLY_BRACES,
    (match, content) => `{% raw %}${match}{% endraw %}`,
  );
};
