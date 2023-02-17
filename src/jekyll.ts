import {Notice, TFile} from "obsidian"
import {O2PluginSettings} from "./settings";
import {Temporal} from "@js-temporal/polyfill";
import O2Plugin from "./main";

export async function convertToJekyll(plugin: O2Plugin) {
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

        new Notice('Jekyll conversion complete.')
        return result
    } catch (e) {
        console.error(e)
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
        .filter((file: TFile) => file.path.startsWith(plugin.settings.draftDir))
    markdownFiles.forEach((file: TFile) => {
        return this.app.vault.copy(file, file.path.replace(plugin.settings.draftDir, plugin.settings.publishedDir))
    })
}

async function renameMarkdownFile(plugin: O2Plugin) {
    let dateString = Temporal.Now.plainDateISO().toString();
    let markdownFiles = this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.draftDir))
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

// import * as fs from 'fs';
// import * as path from 'path';
//
// const sourceFolderPath = 'path/to/source/folder';
// const targetFolderPath = 'path/to/target/folder';
//
// // Read all files in the source folder
// fs.readdir(sourceFolderPath, (err, files) => {
//     if (err) throw err;
//
//     // Move each file to the target folder
//     files.forEach((filename) => {
//         const sourceFilePath = path.join(sourceFolderPath, filename);
//         const targetFilePath = path.join(targetFolderPath, filename);
//
//         // Use fs.rename to move the file
//         fs.rename(sourceFilePath, targetFilePath, (err) => {
//             if (err) throw err;
//             console.log(`Moved ${filename} to ${targetFolderPath}`);
//         });
//     });
// });

