import { convertCalloutSyntaxToChirpy, extractImageName, removeSquareBrackets } from "../jekyll/chirpy";

jest.mock('obsidian', () => ({}), { virtual: true });

describe("jekyll", () => {
    test('1 + 1 = 2', () => {
        expect(1 + 1).toBe(2);
    });

    it.todo("should read a file in ready directory only");
});

describe("remove square brackets", () => {

    it('should replace match string to blank', () => {
        const content = '[[tests]]';
        const result = removeSquareBrackets(content);
        expect(result).toBe('tests');
    });

    it('should not match if string starts with !', () => {
        const content = '![[tests]]';
        const result = removeSquareBrackets(content);
        expect(result).toBe('![[tests]]');
    });

    it('long context', () => {
        const content = `# test
        ![NOTE] test
        [[test]]
        
        ![[test]]
        `;
        const result = removeSquareBrackets(content);
        expect(result).toBe(`# test
        ![NOTE] test
        test
        
        ![[test]]
        `);
    });
});

describe("extract image name", () => {

    it('should return image name array', () => {
        const context = `![[test.png]]
        
        test
        ![[image.png]]
        `;
        const result = extractImageName(context);
        expect(result).toEqual(['test.png', 'image.png']);
    });

});

describe("convert callout syntax", () => {

    it.each([
        ['note'], ['todo'], ['example'], ['quote'], ['cite'], ['success'], ['done'], ['check'],
        ['NOTE'], ['TODO'], ['EXAMPLE'], ['QUOTE'], ['CITE'], ['SUCCESS'], ['DONE'], ['CHECK']
    ])('%s => info', callout => {
        const context = `> [!${callout}] title\n> content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> content\n{: .prompt-info}`);
    });

    it.each([
        ['tip'], ['hint'], ['important'], ['question'], ['help'], ['faq'],
        ['TIP'], ['HINT'], ['IMPORTANT'], ['QUESTION'], ['HELP'], ['FAQ']
    ])('%s => tip', callout => {
        const context = `> [!${callout}] title\n> content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> content\n{: .prompt-tip}`);
    });

    it.each([
        ['warning'], ['caution'], ['attention'],
        ['WARNING'], ['CAUTION'], ['ATTENTION']
    ])('%s => warning', callout => {
        const context = `> [!${callout}] title\n> content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> content\n{: .prompt-warning}`);
    });

    it.each([
        ['error'], ['danger'], ['bug'], ['failure'], ['fail'], ['missing'],
        ['ERROR'], ['DANGER'], ['BUG'], ['FAILURE'], ['FAIL'], ['MISSING']
    ])('%s => danger', callout => {
        const context = `> [!${callout}] title\n> content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> content\n{: .prompt-danger}`);
    });

    it.each([
        ['unknown']
    ])('Unregistered keywords should be converted to info keyword', callout => {
        const context = `> [!${callout}] title\n> content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> content\n{: .prompt-info}`);
    });

    it('info => info, not exist custom title', () => {
        const context = `> [!INFO]\n> info content`;

        const result = convertCalloutSyntaxToChirpy(context);
        expect(result).toBe(`> info content\n{: .prompt-info}`);
    });

});
