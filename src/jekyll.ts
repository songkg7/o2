import {Notice, TFile} from "obsidian"
import {O2PluginSettings} from "./settings";
import {Temporal} from "@js-temporal/polyfill";
import O2Plugin from "./main";
import * as fs from "fs";
import * as path from "path";

export async function convertToJekyll(plugin: O2Plugin) {
    new Notice('Jekyll conversion started.')
    try {
        await copyToPublishedDirectory(plugin)
        let markdownFiles = await renameMarkdownFile(plugin);
        let result = await removeDoubleSquareBracketsInFiles(markdownFiles);
        // copy image to jekyll image folder

        // '> ![NOTE] title' 를 정규표현식을 통해 검색후 parsing 시작 지점으로 설정
        // > 가 없어지는 시점까지 가져오기
        // title 은 제거하고 content 부분만 남김
        // > 가 없어지는 부분에는 {: .prompt-info} 를 append
        // '> ![NOTE|WARN|ERROR|INFO]`

        await moveFilesToJekyll(plugin)

        new Notice('Jekyll conversion complete.')
        return result
    } catch (e) {
        console.error(e)
        // TODO: error 가 발생한 파일을 backlog 로 이동
        new Notice('Jekyll conversion failed.')
    }
}

async function removeDoubleSquareBracketsInFiles(markdownFiles: TFile[]) {
    for (const file of markdownFiles) {
        let content = await this.app.vault.read(file)
        content = content.replace(/\[\[([^\]]+)]]/g, '$1')
        await this.app.vault.modify(file, content);
    }
    return markdownFiles
}

async function copyToPublishedDirectory(plugin: O2Plugin) {
    let markdownFiles = this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyDir))
    markdownFiles.forEach((file: TFile) => {
        return this.app.vault.copy(file, file.path.replace(plugin.settings.readyDir, plugin.settings.publishedDir))
    })
}

async function renameMarkdownFile(plugin: O2Plugin) {
    let dateString = Temporal.Now.plainDateISO().toString();
    let markdownFiles = this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyDir))
    for (const file of markdownFiles) {
        let newFileName = dateString + "-" + file.name
        let newFilePath = file.path
            .replace(file.name, newFileName)
            .replace(" ", "-")
        console.log('new File path: ' + newFilePath)
        await this.app.vault.rename(file, newFilePath);
    }
    return markdownFiles
}

export async function moveFilesToJekyll(plugin: O2Plugin) {
    const absolutePath = this.app.vault.adapter.getBasePath()
    const sourceFolderPath = `${absolutePath}/${plugin.settings.readyDir}`;
    const targetFolderPath = plugin.settings.jekyllTargetDir;

    fs.readdir(sourceFolderPath, (err, files) => {
        if (err) throw err;

        files.forEach((filename) => {
            const sourceFilePath = path.join(sourceFolderPath, filename);
            const targetFilePath = path.join(targetFolderPath, filename);

            fs.rename(sourceFilePath, targetFilePath, (err) => {
                if (err) throw err;
                console.log(`Moved ${filename} to ${targetFolderPath}`);
            });
        });
    });
}
