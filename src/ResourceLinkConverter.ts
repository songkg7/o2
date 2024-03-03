import { IConverter } from './interfaces/IConverter';

export class ResourceLinkConverter implements IConverter {
    private postMock: string;
    private assetsDir: string;
    private testDir: string;
    private attachmentsDir: string;
    private outputDir: string;

    constructor(postMock: string, assetsDir: string, testDir: string, attachmentsDir: string, outputDir: string) {
        this.postMock = postMock;
        this.assetsDir = assetsDir;
        this.testDir = testDir;
        this.attachmentsDir = attachmentsDir;
        this.outputDir = outputDir;
    }

    convert(content: string): string {
        const imageLinkWithItalicsRegex = /!\[\[(.*?)\]\](_.*?_)/g;
        const convertedContent = content.replace(imageLinkWithItalicsRegex, (match, imageName, italicsText) => {
            return `![image](/${this.outputDir}/${this.postMock}/${imageName})${italicsText}`;
        });

        return convertedContent;
    }
}
