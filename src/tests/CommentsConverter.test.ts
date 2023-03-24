import { CommentsConverter } from '../jekyll/CommentsConverter';

const converter = new CommentsConverter();

describe('CommentConverter', () => {
  it('should convert a comment', () => {
    const input = '%%This is a comment%%';
    const expected = '<!--This is a comment-->';
    const actual = converter.convert(input);
    expect(actual).toEqual(expected);
  });

  it('should convert multiple comments', () => {
    const input = '%%This is a comment%% %%This is another comment%%';
    const expected = '<!--This is a comment--> <!--This is another comment-->';
    const actual = converter.convert(input);
    expect(actual).toEqual(expected);
  });
});
