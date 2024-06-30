import { convertFootnotes, FootnotesConverter } from '../FootnotesConverter';

const converter = new FootnotesConverter();

describe('FootnotesConverter', () => {
  it('should convert simple footnotes', () => {
    const contents = `
# Hello World

This is a simple footnote[^1]. next footnote[^2].

[^1]: meaningful

[^2]: meaningful 2

`;

    const expected = `
# Hello World

This is a simple footnote[^fn-nth-1]. next footnote[^fn-nth-2].

[^fn-nth-1]: meaningful

[^fn-nth-2]: meaningful 2

`;
    const actual = converter.convert(contents);
    expect(actual).toEqual(expected);
  });
});

describe('convertFootnotes', () => {
  it('should convert simple footnotes', () => {
    const contents = `
# Hello World
      
This is a simple footnote[^1]. next footnote[^2].
      
[^1]: meaningful
      
[^2]: meaningful 2
      
`;

    const expected = `
# Hello World
      
This is a simple footnote[^fn-nth-1]. next footnote[^fn-nth-2].
      
[^fn-nth-1]: meaningful
      
[^fn-nth-2]: meaningful 2
      
`;
    const actual = convertFootnotes(contents);
    expect(actual).toEqual(expected);
  });
});
