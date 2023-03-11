import { WikiLinkConverter } from "../jekyll/WikiLinkConverter";

const bracketConverter = new WikiLinkConverter();

describe("remove square brackets", () => {


    it('should replace match string to blank', () => {
        const content = '[[tests]]';
        const result = bracketConverter.convert(content);
        expect(result).toBe('tests');
    });

    it('should not match if string starts with !', () => {
        const content = '![[tests]]';
        const result = bracketConverter.convert(content);
        expect(result).toBe('![[tests]]');
    });

    it('long context', () => {
        const content = `# test
        ![NOTE] test
        [[test]]
        
        ![[test]]
        `;
        const result = bracketConverter.convert(content);
        expect(result).toBe(`# test
        ![NOTE] test
        test
        
        ![[test]]
        `);
    });
});
