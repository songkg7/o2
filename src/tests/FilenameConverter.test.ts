import { FilenameConverter } from '../jekyll/FilenameConverter';

const filenameConverter = new FilenameConverter();

describe('FilenameConverter', () => {
  it('should remove extension', () => {
    const filename = filenameConverter.convert('test.md');
    expect(filename).toEqual('test');
  });

  it('should replace space to -', () => {
    const filename = filenameConverter.convert('This is Obsidian.md');
    expect(filename).toEqual('This-is-Obsidian');
  });

  it('should convert Korean characters', () => {
    const filename = filenameConverter.convert('이것은 옵시디언입니다.md');
    expect(filename).toEqual('이것은-옵시디언입니다');
  });

  it.each([
    ['This is Obsidian.md', 'This-is-Obsidian'],
    ['This is Obsidian!!.md', 'This-is-Obsidian'],
    [
      'Obsidian, awesome note-taking tool.md',
      'Obsidian-awesome-note-taking-tool',
    ],
    ['Obsidian(Markdown Editor).md', 'ObsidianMarkdown-Editor'],
  ])('should remove special characters', (filename, expected) => {
    const result = filenameConverter.convert(filename);
    expect(result).toEqual(expected);
  });
});
