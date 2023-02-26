import { FileSystemAdapter, Notice, TFile } from "obsidian";
import { Temporal } from "@js-temporal/polyfill";
import O2Plugin from "../main";
import * as fs from "fs";
import * as path from "path";
import { ObsidianRegex } from "../ObsidianRegex";
import { replaceKeyword } from "../ObsidianCallout";

function convertResourceLink(plugin: O2Plugin, title: string, contents: string) {
    const resourcePath = `${plugin.settings.jekyllSetting().resourcePath()}/${title}`;
    fs.mkdirSync(resourcePath, { recursive: true });

    const relativeResourcePath = plugin.settings.jekyllSetting().jekyllRelativeResourcePath;

    extractImageName(contents)?.forEach((resourceName) => {
        fs.copyFile(
            `${(vaultAbsolutePath(plugin))}/${plugin.settings.jekyllSetting().attachmentsFolder}/${resourceName}`,
            `${resourcePath}/${(resourceName.replace(/\s/g, '-'))}`,
            (err) => {
                if (err) {
                    console.error(err);
                    new Notice(err.message);
                    // ignore error
                }
            }
        );
    });

    function replacer(match: string, p1: string) {
        return `![image](/${relativeResourcePath}/${title}/${p1.replace(/\s/g, '-')})`;
    }

    return contents.replace(ObsidianRegex.IMAGE_LINK, replacer);
}

export async function convertToChirpy(plugin: O2Plugin) {
    new Notice('Chirpy conversion started.');
    try {
        await backupOriginalNotes(plugin);
        const markdownFiles = await renameMarkdownFile(plugin);
        for (const file of markdownFiles) {
            // remove double square brackets
            const title = file.name.replace('.md', '').replace(/\s/g, '-');
            const contents = removeSquareBrackets(await plugin.app.vault.read(file));
            // change resource link to jekyll link
            const resourceConvertedContents = convertResourceLink(plugin, title, contents);

            // callout
            const result = convertCalloutSyntaxToChirpy(resourceConvertedContents);

            await plugin.app.vault.modify(file, result);
        }

        await moveFilesToChirpy(plugin);
        new Notice('Chirpy conversion complete.');
    } catch (e) {
        // TODO: error 가 발생한 파일을 backlog 로 이동
        console.error(e);
        new Notice('Chirpy conversion failed.');
    }
}

export function convertCalloutSyntaxToChirpy(content: string) {
    function replacer(match: string, p1: string, p2: string) {
        return `${p2}\n{: .prompt-${replaceKeyword(p1)}}`;
    }

    return content.replace(ObsidianRegex.CALLOUT, replacer);
}

export function extractImageName(content: string) {
    const regExpMatchArray = content.match(ObsidianRegex.IMAGE_LINK);
    return regExpMatchArray?.map(
        (value) => {
            return value.replace(ObsidianRegex.IMAGE_LINK, '$1');
        }
    );
}

export function removeSquareBrackets(content: string) {
    return content.replace(ObsidianRegex.DOCUMENT_LINK, '$1');
}

function getFilesInReady(plugin: O2Plugin): TFile[] {
    return plugin.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyFolder));
}

async function backupOriginalNotes(plugin: O2Plugin) {
    const readyFiles = getFilesInReady.call(this, plugin);
    readyFiles.forEach((file: TFile) => {
        return plugin.app.vault.copy(file, file.path.replace(plugin.settings.readyFolder, plugin.settings.backupFolder));
    });
}

async function renameMarkdownFile(plugin: O2Plugin): Promise<TFile[]> {
    const dateString = Temporal.Now.plainDateISO().toString();
    const markdownFiles = getFilesInReady.call(this, plugin);
    for (const file of markdownFiles) {
        const newFileName = dateString + "-" + file.name;
        const newFilePath = file.path
            .replace(file.name, newFileName)
            .replace(" ", "-");
        await plugin.app.vault.rename(file, newFilePath);
    }
    return markdownFiles;
}

async function moveFilesToChirpy(plugin: O2Plugin) {
    const sourceFolderPath = `${(vaultAbsolutePath(plugin))}/${plugin.settings.readyFolder}`;
    const targetFolderPath = plugin.settings.targetPath();

    fs.readdir(sourceFolderPath, (err, files) => {
        if (err) throw err;

        files.forEach((filename) => {
            const sourceFilePath = path.join(sourceFolderPath, filename);
            const targetFilePath = path.join(targetFolderPath, filename.replace(/\s/g, '-'));

            fs.rename(sourceFilePath, targetFilePath, (err) => {
                if (err) {
                    console.error(err);
                    new Notice(err.message);
                    throw err;
                }
            });
        });
    });
}

function vaultAbsolutePath(plugin: O2Plugin): string {
    const adapter = plugin.app.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
        return adapter.getBasePath();
    }
    new Notice('Vault is not a file system adapter');
    throw new Error('Vault is not a file system adapter');
}
