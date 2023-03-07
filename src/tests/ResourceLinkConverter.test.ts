import { extractImageName } from "../jekyll/ResourceLinkConverter";

jest.mock('obsidian', () => ({}), { virtual: true });

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

