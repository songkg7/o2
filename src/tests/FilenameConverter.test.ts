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

  it.each([
    ['This is Obsidian.md', 'This-is-Obsidian'],
    ['This is Obsidian!!.md', 'This-is-Obsidian'],
    ['Obsidian, awesome note-taking tool.md', 'Obsidian-awesome-note-taking-tool'],
    ['Obsidian(Markdown Editor).md', 'ObsidianMarkdown-Editor'],
  ])('should remove special characters', (filename, expected) => {
    const result = filenameConverter.convert(filename);
    expect(result).toEqual(expected);
  });

});
