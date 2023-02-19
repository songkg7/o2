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
        const absolutePath = this.app.vault.adapter.getBasePath()
        const markdownFiles = await renameMarkdownFile(plugin)
        for (const file of markdownFiles) {
            // remove double square brackets
            const contents = removeSquareBrackets(await this.app.vault.read(file))
            // change resource link to jekyll link
            const title = file.name.replace('.md', '')
            const resourcePath = `${plugin.settings.jekyllResourcePath}/${title}`
            fs.mkdirSync(resourcePath, { recursive: true })
            console.log(`mkdir ${resourcePath}`)

            const relativeResourcePath = plugin.settings.jekyllRelativeResourcePath

            // 2. 변경하기 전 resourceDir/image.png 를 assets/img/<title>/image.png 로 복사
            extractImageName(contents)?.forEach((imageName) => {
                fs.copyFile(
                    `${absolutePath}/${plugin.settings.resourceDir}/${imageName}`,
                    `${resourcePath}/${imageName}`,
                    (err) => {
                        if (err) {
                            console.error(err)
                        }
                    }
                )
            })
            const resourceConvertedContents = contents.replace(ObsidianRegex.IMAGE_LINK, `![image](/${relativeResourcePath}/${title}/$1)`)

            // callout
            let result = convertCalloutSyntaxToJekyll(resourceConvertedContents)

            await this.app.vault.modify(file, result)
        }

        await moveFilesToJekyll(plugin)
        new Notice('Jekyll conversion complete.')
    } catch (e) {
        console.error(e)
        // TODO: error 가 발생한 파일을 backlog 로 이동
        new Notice('Jekyll conversion failed.')
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

export function extractImageName(content: string) {
    let regExpMatchArray = content.match(ObsidianRegex.IMAGE_LINK)
    return regExpMatchArray?.map(
        (value) => {
            return value.replace(ObsidianRegex.IMAGE_LINK, '$1')
        }
    )
}

export function removeSquareBrackets(content: string) {
    return content.replace(ObsidianRegex.DOCUMENT_LINK, '$1')
}

function getFilesInReady(plugin: O2Plugin): TFile[] {
    return this.app.vault.getMarkdownFiles()
        .filter((file: TFile) => file.path.startsWith(plugin.settings.readyDir))
}

async function copyToPublishedDirectory(plugin: O2Plugin) {
    let readyFiles = getFilesInReady.call(this, plugin)
    readyFiles.forEach((file: TFile) => {
        return this.app.vault.copy(file, file.path.replace(plugin.settings.readyDir, plugin.settings.publishedDir))
    })
}

async function renameMarkdownFile(plugin: O2Plugin): Promise<TFile[]> {
    let dateString = Temporal.Now.plainDateISO().toString()
    let markdownFiles = getFilesInReady.call(this, plugin)
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

async function moveFilesToJekyll(plugin: O2Plugin) {
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
