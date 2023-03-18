import { ObsidianRegex } from "../ObsidianRegex";

describe('Image link', () => {
    it('should separate image name and size', () => {
        const context = '![[test.png|100]]';
        const result = context.replace(ObsidianRegex.ATTACHMENT_LINK, '$1 $2 $3');

        expect(result).toEqual('test png 100');
    });

    it('extract only image name', () => {
        const context = '![[test.png]]';
        const result = context.replace(ObsidianRegex.ATTACHMENT_LINK, '$1 $2');

        expect(result).toEqual('test png');
    });

    // TODO: not yet implemented
    xit('should not match embedded syntax', () => {
        const context = '![[Obsidian#What is Obsidian?]]';
        const result = context.match(ObsidianRegex.ATTACHMENT_LINK);

        expect(result).toBeNull();
    });
});
