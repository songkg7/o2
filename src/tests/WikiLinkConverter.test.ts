import { WikiLinkConverter } from '../WikiLinkConverter';

const converter = new WikiLinkConverter();

describe('WikiLinkConverter', () => {
  it('should remove wiki links', () => {
    const input = '[[Link]]';
    const expected = 'Link';
    const result = converter.convert(input);
    expect(result).toEqual(expected);
  });

  it.each([
    ['[[develop obsidian plugin|O2]]', 'O2'],
    ['[[Link|Alias]]', 'Alias'],
  ])('should remove wiki links but remain alias only', (input, expected) => {
    const result = converter.convert(input);
    expect(result).toEqual(expected);
  });

  it('long context', () => {
    const input = `# test
        ![NOTE] test
        [[test]]
        
        ![[test]]
        `;
    const result = converter.convert(input);
    expect(result).toBe(`# test
        ![NOTE] test
        test
        
        ![[test]]
        `);
  });

  it('long context 2', () => {
    const input = `# test
        ![NOTE] test
        [[test]]
        [[develop obsidian plugin|O2]] and [[Jekyll]]
        
        ![[test]]
        `;
    const result = converter.convert(input);
    expect(result).toBe(`# test
        ![NOTE] test
        test
        O2 and Jekyll
        
        ![[test]]
        `);
  });


  it('should not match if string starts with !', () => {
    const input = '![[tests]]';
    const result = converter.convert(input);
    expect(result).toBe('![[tests]]');
  });
});
