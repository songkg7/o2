import {TFile} from "obsidian"

export function convertToJekyll() {
    copyMarkdownFile()
    removeDoubleSquareBracketsInFiles()
    // copy image to jeykll image folder

    // delete copy file

    // 원본 파일을 published 폴더로 이동
}

function removeDoubleSquareBracketsInFiles() {
    let markdownFiles = this.app.vault.getMarkdownFiles()
    markdownFiles.forEach(async (file: TFile) => {
        let content = await this.app.vault.read(file)
        content = content.replace(/\[\[([^\]]+)]]/g, '$1')
        await this.app.vault.modify(file, content)
    })
}

function copyMarkdownFile() {
    let markdownFiles = this.app.vault.getMarkdownFiles()
    markdownFiles.forEach(async (file: TFile) => {
        console.log(file)
        // .md to _copy.md
        await this.app.vault.copy(file, file.path.replace(/.md$/, '_copy.md'))
    })
}
