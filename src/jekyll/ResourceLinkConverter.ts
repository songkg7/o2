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
        fs.mkdirSync(resourcePath, { recursive: true });

        const relativeResourcePath = jekyllSetting.jekyllRelativeResourcePath;

        extractImageName(input)?.forEach((resourceName) => {
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

        const replacer = (match: string, p1: string) =>
            `![image](/${relativeResourcePath}/${this.title}/${p1.replace(/\s/g, '-')})`;

        const result = input.replace(ObsidianRegex.IMAGE_LINK, replacer);

        return super.convert(result);
    }
}

export function extractImageName(content: string) {
    const regExpMatchArray = content.match(ObsidianRegex.IMAGE_LINK);
    return regExpMatchArray?.map(
        (value) => {
            return value.replace(ObsidianRegex.IMAGE_LINK, '$1');
        }
    );
}

