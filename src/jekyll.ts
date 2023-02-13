import {Notice, TFile} from "obsidian"

export async function convertToJekyll() {
    try {
        copyMarkdownFile()
        removeDoubleSquareBracketsInFiles()
        // copy image to jeykll image folder

        // FIXME: deleteCopiedMarkdownFile() is not working
        // 삭제하지 않고 복사해서 처리, 처리 중에 파일이 삭제되지 않고 delete 상태만 false 에서 true 로 바뀌는 것을 확인
        deleteCopiedMarkdownFile()

        // 원본 파일을 published 폴더로 이동


        new Notice('Jekyll conversion complete.')
    } catch (e) {
        new Notice('Jekyll conversion failed.')
    }
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
