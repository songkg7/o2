import convertFileName from '../jekyll/FilenameConverter';

describe('FilenameConverter', () => {
  it('should remove extension', () => {
    const filename = convertFileName('test.md');
    expect(filename).toEqual('test');
  });

  it('should replace space to -', () => {
    const filename = convertFileName('This is Obsidian.md');
    expect(filename).toEqual('This-is-Obsidian');
  });

  it('should convert Korean characters', () => {
    const filename = convertFileName('이것은 옵시디언입니다.md');
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
    const result = convertFileName(filename);
    expect(result).toEqual(expected);
  });
});
