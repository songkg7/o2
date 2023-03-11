import { WikiLinkConverter } from "../jekyll/WikiLinkConverter";

const converter = new WikiLinkConverter();

describe('WikiLinkConverter', () => {
    it('should remove wiki links', () => {
        const input = '[[Link]]';
        const expected = 'Link';
        const result = converter.convert(input);
        expect(result).toEqual(expected);
    });

    it('should remove wiki links but remain alias only', () => {
        const input = '[[Link|Alias]]';
        const expected = 'Alias';
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

    it('should not match if string starts with !', () => {
        const input = '![[tests]]';
        const result = converter.convert(input);
        expect(result).toBe('![[tests]]');
    });
});
