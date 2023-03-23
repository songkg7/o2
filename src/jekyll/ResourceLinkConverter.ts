import fs from "fs";
import { ObsidianRegex } from "../ObsidianRegex";
import { Notice } from "obsidian";
import { Converter } from "../core/Converter";

export class ResourceLinkConverter implements Converter {
    private readonly fileName: string;
    private readonly resourcePath: string;
    private readonly absolutePath: string;
    private readonly attachmentsFolder: string;
    private readonly relativeResourcePath: string;

    constructor(fileName: string, resourcePath: string, absolutePath: string, attachmentsFolder: string, relativeResourcePath: string) {
        this.fileName = fileName;
        this.resourcePath = resourcePath;
        this.absolutePath = absolutePath;
        this.attachmentsFolder = attachmentsFolder;
        this.relativeResourcePath = relativeResourcePath;
    }

    convert(input: string): string {
        const resourcePath = `${this.resourcePath}/${this.fileName}`;

        const resourceNames = extractResourceNames(input);
        if (!(resourceNames === undefined || resourceNames.length === 0)) {
            fs.mkdirSync(resourcePath, { recursive: true });
        }
        resourceNames?.forEach((resourceName) => {
            fs.copyFile(
                `${this.absolutePath}/${this.attachmentsFolder}/${resourceName}`,
                `${resourcePath}/${(resourceName.replace(/\s/g, '-'))}`,
                (err) => {
                    if (err) {
                        // ignore error
                        console.error(err);
                        new Notice(err.message);
                    }
                }
            );
        });

        const replacer = (match: string,
                          contents: string,
                          suffix: string,
                          imageSize: string | undefined,
                          caption: string | undefined) =>
            `![image](/${this.relativeResourcePath}/${this.fileName}/${contents.replace(/\s/g, '-')}.${suffix})`
            + `${convertImageSize(imageSize)}`
            + `${convertImageCaption(caption)}`;

        return input.replace(ObsidianRegex.ATTACHMENT_LINK, replacer);
    }
}

export function extractResourceNames(content: string) {
    const result = content.match(ObsidianRegex.ATTACHMENT_LINK);
    if (result === null) {
        return undefined;
    }
    return result.map((imageLink) => imageLink.replace(ObsidianRegex.ATTACHMENT_LINK, '$1.$2'));
}

function convertImageSize(imageSize: string | undefined) {
    if (imageSize === undefined || imageSize.length === 0) {
        return '';
    }
    return `{ width="${imageSize}" }`;
}

function convertImageCaption(caption: string | undefined) {
    if (caption === undefined || caption.length === 0) {
        return '';
    }
    return `\n${caption}`;
}
