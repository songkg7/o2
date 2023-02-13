import {Notice, TFile} from "obsidian"
import {O2PluginSettings} from "./settings";

export async function convertToJekyll(markdownFiles: TFile[]) {
    console.log(markdownFiles)
    try {
        let result = await removeDoubleSquareBracketsInFiles(markdownFiles);
        // copy image to jekyll image folder



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

function copyMarkdownFile() {
    let markdownFiles = this.app.vault.getMarkdownFiles()
    markdownFiles.forEach(async (file: TFile) => {
        await this.app.vault.copy(file, file.path.replace(/.md$/, '_copy.md'))
    })
}

export function deleteCopiedMarkdownFile() {
    console.log("deleteCopiedMarkdownFile start")
    let markdownFiles = this.app.vault.getMarkdownFiles()
    markdownFiles.forEach(async (file: TFile) => {
        if (file.path.includes('_copy.md')) {
            await this.app.vault.delete(file)
        }
    })
    console.log("deleteCopiedMarkdownFile end")
}
