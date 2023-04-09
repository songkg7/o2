import { CurlyBraceConverter } from '../jekyll/CurlyBraceConverter';

const activatedConverter = new CurlyBraceConverter(true);
const deactivatedConverter = new CurlyBraceConverter(false);

describe('CurlyBraceConverter', () => {
  it('should convert double curly braces to raw tag', () => {
    const input = 'This is a {{test}}.';
    const expected = 'This is a {% raw %}{{test}}{% endraw %}.';
    expect(activatedConverter.convert(input)).toEqual(expected);
  });

  it('should not convert double curly braces to raw tag', () => {
    const input = 'This is a {{test}}.';
    const expected = 'This is a {{test}}.';
    expect(deactivatedConverter.convert(input)).toEqual(expected);
  });
});
