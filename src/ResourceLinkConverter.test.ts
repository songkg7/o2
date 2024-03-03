import { ResourceLinkConverter } from './ResourceLinkConverter';

describe('image caption', () => {
  const converter = new ResourceLinkConverter(
    '2023-01-01-post-mock',
    'assets',
    'test',
    'attachments',
    'assets',
  );

  it('should remove blank line after attachments', () => {
    const context = `
![[test.png]]

_This is a test image._
`;
    const result = converter.convert(context);
    expect(result).toEqual(`
![image](/assets/2023-01-01-post-mock/test.png)
_This is a test image._
`);
  });

  it('should insert next line if no more space after attachment', () => {
    const context = `
![[test.png]]_This is a test image._
`;
    const result = converter.convert(context);
    expect(result).toEqual(`
![image](/assets/2023-01-01-post-mock/test.png)
_This is a test image._
`);
  });

  it('should convert image link followed by italics without space', () => {
    const context = `![[test.png]]_This is a test image._`;
    const expected = `![image](/assets/2023-01-01-post-mock/test.png)_This is a test image._`;
    const result = converter.convert(context);
    expect(result).toEqual(expected);
  });
});
