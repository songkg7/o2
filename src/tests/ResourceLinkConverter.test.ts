import { extractResourceNames, ResourceLinkConverter } from '../jekyll/ResourceLinkConverter';

jest.mock('obsidian', () => ({}), { virtual: true });
jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  copyFile: jest.fn(),
}));

describe('extract image name', () => {

  it('should return image name array', () => {
    const context = `![[test.png]]
        
        test
        ![[image.png]]
        `;
    const result = extractResourceNames(context);
    expect(result).toEqual(['test.png', 'image.png']);
  });

  it('should return undefined', () => {
    const context = `test`;
    const result = extractResourceNames(context);
    expect(result).toBeUndefined();
  });

});

describe('convert called', () => {
  const converter = new ResourceLinkConverter(
    '2023-01-01-post-mock',
    'assets',
    'test',
    'attachments',
    'assets',
  );

  it('should return converted post', () => {
    expect(converter.convert(`![[test.png]]`)).toEqual(`![image](/assets/2023-01-01-post-mock/test.png)`);
  });

});

describe('resize image', () => {
  const converter = new ResourceLinkConverter(
    '2023-01-01-post-mock',
    'assets',
    'test',
    'attachments',
    'assets',
  );

  it('should return converted attachments with width', () => {
    expect(converter.convert(`![[test.png|100]]`)).toEqual(`![image](/assets/2023-01-01-post-mock/test.png){ width="100" }`);
  });

  it('should return converted attachments with width and height', () => {
    expect(converter.convert(`![[test.png|100x200]]`))
      .toEqual(`![image](/assets/2023-01-01-post-mock/test.png){: width="100" height="200" }`);
  });

  it('should ignore size when image resize syntax was invalid', () => {
    expect(converter.convert(`![[test.png|x100]]`))
      .toEqual(`![image](/assets/2023-01-01-post-mock/test.png)`);
  });

});

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

  it('should nothing if exist just one blank line', () => {
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

  it('should nothing if does not exist image caption', () => {
    const context = `
![[test.png]]

## Header

`;

    const result = converter.convert(context);
    expect(result).toEqual(`
![image](/assets/2023-01-01-post-mock/test.png)

## Header

`);
  });

});
