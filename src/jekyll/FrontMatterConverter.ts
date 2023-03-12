import { parseFrontMatter } from "./parseFrontMatter";
import { ObsidianRegex } from "../ObsidianRegex";
import { Converter } from "../core/Converter";

export class FrontMatterConverter implements Converter {

    private readonly fileName: string;
    private readonly resourcePath: string;
    private readonly isEnable: boolean;

    constructor(fileName: string, resourcePath: string, isEnable = false) {
        this.fileName = fileName;
        this.resourcePath = resourcePath;
        this.isEnable = isEnable;
    }

    convert(input: string): string {
        if (!this.isEnable) {
            return input;
        }

        const [frontMatter, body] = parseFrontMatter(input);

        if (!frontMatter.image) {
            return input;
        }

        if (ObsidianRegex.IMAGE_LINK.test(frontMatter.image)) {
            const match = frontMatter.image.match(ObsidianRegex.IMAGE_LINK);
            if (match) {
                frontMatter.image = frontMatter.image.replace(ObsidianRegex.IMAGE_LINK, '$1');
            }
        }

        frontMatter.image = convertImagePath(this.fileName, frontMatter.image, this.resourcePath);

        return `---
${Object.entries(frontMatter)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}
---

${body}`;
    }
}

function convertImagePath(postTitle: string, imagePath: string, resourcePath: string): string {
    return `/${resourcePath}/${postTitle}/${imagePath}`;
}
