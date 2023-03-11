import { AbstractConverter } from "../core/Converter";
import fs from "fs";
import { ObsidianRegex } from "../ObsidianRegex";
import O2Plugin from "../main";
import { vaultAbsolutePath } from "../utils";
import { Notice } from "obsidian";

export class ResourceLinkConverter extends AbstractConverter {
    private readonly plugin: O2Plugin;
    private readonly title: string;

    constructor(plugin: O2Plugin, title: string) {
        super();
        this.plugin = plugin;
        this.title = title;
    }

    convert(input: string): string {
        const jekyllSetting = this.plugin.settings.jekyllSetting();
        const resourcePath = `${jekyllSetting.resourcePath()}/${this.title}`;

        const resourceNames = extractResourceNames(input);
        if (!(resourceNames === undefined || resourceNames.length === 0)) {
            fs.mkdirSync(resourcePath, { recursive: true });
        }
        resourceNames?.forEach((resourceName) => {
            fs.copyFile(
                `${(vaultAbsolutePath(this.plugin))}/${jekyllSetting.attachmentsFolder}/${resourceName}`,
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

        const relativeResourcePath = jekyllSetting.jekyllRelativeResourcePath;

        const replacer = (match: string, p1: string, imageSize: string | undefined) =>
            `![image](/${relativeResourcePath}/${this.title}/${p1.replace(/\s/g, '-')})${convertImageSize(imageSize)}`;

        const result = input.replace(ObsidianRegex.IMAGE_LINK, replacer);

        return super.convert(result);
    }
}

export function extractResourceNames(content: string) {
    const result = content.match(ObsidianRegex.IMAGE_LINK);
    if (result === null) {
        return undefined;
    }
    return result.map((imageLink) => imageLink.replace(ObsidianRegex.IMAGE_LINK, '$1'));
}

function convertImageSize(imageSize: string | undefined) {
    if (imageSize === undefined || imageSize.length === 0) {
        return '';
    }
    return `{ width="${imageSize}" }`;
}
