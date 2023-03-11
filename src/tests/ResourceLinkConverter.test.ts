import { extractResourceNames, ResourceLinkConverter } from "../jekyll/ResourceLinkConverter";

jest.mock('obsidian', () => ({}), { virtual: true });
jest.mock('fs', () => ({
    mkdirSync: jest.fn(),
    copyFile: jest.fn()
}));

describe("extract image name", () => {

    it('should return image name array', () => {
        const context = `![[test.png]]
        
        test
        ![[image.png]]
        `;
        const result = extractResourceNames(context);
        expect(result).toEqual(['test.png', 'image.png']);
    });

});

describe("convert called", () => {
    const converter = new ResourceLinkConverter(
        '2023-01-01-post-mock',
        'assets',
        'test',
        'attachments',
        'assets'
    );

    it('should return converted post', () => {
        expect(converter.convert(`![[test.png]]`)).toEqual(`![image](/assets/2023-01-01-post-mock/test.png)`);
    });
});
