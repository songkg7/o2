import { Converter } from '../Converter';
import { ObsidianRegex } from '../ObsidianRegex';

export class CommentsConverter implements Converter {
  public convert(input: string): string {
    return input.replace(
      ObsidianRegex.COMMENT,
      (match, comments) => `<!--${comments}-->`,
    );
  }
}

export const convertComments = (input: string) =>
  input.replace(
    ObsidianRegex.COMMENT,
    (match, comments) => `<!--${comments}-->`,
  );
