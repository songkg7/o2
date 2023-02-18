import { Notice, TFile } from "obsidian"
import { Temporal } from "@js-temporal/polyfill"
import O2Plugin from "./main"
import * as fs from "fs"
import * as path from "path"
import { ObsidianRegex } from "./ObsidianRegex"

export async function convertToJekyll(plugin: O2Plugin) {
    new Notice('Jekyll conversion started.')
    try {
        await copyToPublishedDirectory(plugin)
        const markdownFiles = await renameMarkdownFile(plugin)
        const result = await removeDoubleSquareBracketsInFiles(markdownFiles)
        await convertResourceToJekyll(plugin, result)

        // TODO: callout
        // '> ![NOTE] title' 를 정규표현식을 통해 검색후 parsing 시작 지점으로 설정
        // > 가 없어지는 시점까지 가져오기
        // title 은 제거하고 content 부분만 남김
        // > 가 없어지는 부분에는 {: .prompt-info} 를 append
        // '> ![NOTE|WARN|ERROR|INFO]`
        await convertCalloutSyntax(plugin, result)

        await moveFilesToJekyll(plugin)

        new Notice('Jekyll conversion complete.')
        return result
    } catch (e) {
        console.error(e)
        // TODO: error 가 발생한 파일을 backlog 로 이동
        new Notice('Jekyll conversion failed.')
    }
}

async function convertCalloutSyntax(plugin: O2Plugin, markdownFiles: TFile[]) {
    for (const file of markdownFiles) {
        const content = convertCalloutSyntaxToJekyll(await this.app.vault.read(file))
        await this.app.vault.modify(file, content)
    }
}

export function convertCalloutSyntaxToJekyll(content: string) {
    function replacer(match: string, p1: string, p2: string) {
        if (p1.toLowerCase() === 'note') {
            p1 = 'info'
        }
        if (p1.toLowerCase() === 'error') {
            p1 = 'danger'
        }
        return `${p2}\n{: .prompt-${p1.toLowerCase()}}`
    }
    return content.replace(ObsidianRegex.CALLOUT, replacer)
}

async function convertResourceToJekyll(plugin: O2Plugin, markdownFiles: TFile[]) {
    const absolutePath = this.app.vault.adapter.getBasePath()
    const titles = markdownFiles.map((file: TFile) => file.name.replace('.md', ''))
    for (const title of titles) {
        const resourcePath = `${plugin.settings.jekyllResourcePath}/${title}`
        fs.mkdirSync(resourcePath, { recursive: true })
        console.log(`mkdir ${resourcePath}`)
    }

    // 1. markdown 파일 내에 있는 이미지 경로를 ./assets/img/폴더명/파일명 으로 변경
    for (const file of markdownFiles) {
        const content = await this.app.vault.read(file)
        const title = file.name.replace('.md', '')
        const resourcePath = `${plugin.settings.jekyllResourcePath}/${title}`
        const relativeResourcePath = plugin.settings.jekyllRelativeResourcePath

        // 2. 변경하기 전 resourceDir/image.png 를 assets/img/<title>/image.png 로 복사
        extractImageName(content)?.forEach((imageName) => {
            fs.copyFile(
                `${absolutePath}/${plugin.settings.resourceDir}/${imageName}`,
                `${resourcePath}/${imageName}`,
                (err) => {
                    if (err) {
                        console.error(err)
                    }
                })
        })

        // ![[image.png]] -> ![image](/assets/img/<title>/image.png)
        const result = content.replace(ObsidianRegex.IMAGE_LINK, `![image](/${relativeResourcePath}/${title}/$1)`)
        await this.app.vault.modify(file, result)
    }
}

export function extractImageName(content: string) {
    let regExpMatchArray = content.match(ObsidianRegex.IMAGE_LINK)
    return regExpMatchArray?.map(
        (value) => {
            return value.replace(ObsidianRegex.IMAGE_LINK, '$1')
        }
    )
}

async function removeDoubleSquareBracketsInFiles(markdownFiles: TFile[]) {
    for (const file of markdownFiles) {
        const result = removeSquareBrackets(await this.app.vault.read(file))
        await this.app.vault.modify(file, result)
    }
    return markdownFiles
}

export function removeSquareBrackets(content: string) {
    return content.replace(ObsidianRegex.DOCUMENT_LINK, '$1')
}

async function copyToPublishedDirectory(plugin: O2Plugin) {
    let markdownFiles = this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyDir))
    markdownFiles.forEach((file: TFile) => {
        return this.app.vault.copy(file, file.path.replace(plugin.settings.readyDir, plugin.settings.publishedDir))
    })
}

async function renameMarkdownFile(plugin: O2Plugin) {
    let dateString = Temporal.Now.plainDateISO().toString()
    let markdownFiles = this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyDir))
    for (const file of markdownFiles) {
        let newFileName = dateString + "-" + file.name
        let newFilePath = file.path
            .replace(file.name, newFileName)
            .replace(" ", "-")
        console.log('new File path: ' + newFilePath)
        await this.app.vault.rename(file, newFilePath)
    }
    return markdownFiles
}

export async function moveFilesToJekyll(plugin: O2Plugin) {
    const absolutePath = this.app.vault.adapter.getBasePath()
    const sourceFolderPath = `${absolutePath}/${plugin.settings.readyDir}`
    const targetFolderPath = plugin.settings.jekyllTargetPath

    fs.readdir(sourceFolderPath, (err, files) => {
        if (err) throw err

        files.forEach((filename) => {
            const sourceFilePath = path.join(sourceFolderPath, filename)
            const targetFilePath = path.join(targetFolderPath, filename)

            fs.rename(sourceFilePath, targetFilePath, (err) => {
                if (err) throw err
                console.log(`Moved ${filename} to ${targetFolderPath}`)
            })
        })
    })
}
