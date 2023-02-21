import { Notice, TFile } from "obsidian"
import { Temporal } from "@js-temporal/polyfill"
import O2Plugin from "../main"
import * as fs from "fs"
import * as path from "path"
import { ObsidianRegex } from "../ObsidianRegex"

function convertResourceLink(plugin: O2Plugin, title: string, contents: string) {
    const absolutePath = this.app.vault.adapter.getBasePath()
    const resourcePath = `${plugin.settings.jekyllSetting().resourcePath()}/${title}`
    fs.mkdirSync(resourcePath, { recursive: true })

    const relativeResourcePath = plugin.settings.jekyllSetting().jekyllRelativeResourcePath

    // 변경하기 전 resourceDir/image.png 를 assets/img/<title>/image.png 로 복사
    extractImageName(contents)?.forEach((resourceName) => {
        fs.copyFile(
            `${absolutePath}/${plugin.settings.jekyllSetting().attachmentDir}/${resourceName}`,
            `${resourcePath}/${resourceName}`,
            (err) => {
                if (err) {
                    console.error(err)
                    new Notice(err.message)
                    // ignore error
                }
            }
        )
    })
    return contents.replace(ObsidianRegex.IMAGE_LINK, `![image](/${relativeResourcePath}/${title}/$1)`)
}

export async function convertToChirpy(plugin: O2Plugin) {
    new Notice('Chirpy conversion started.')
    try {
        await copyToPublishedDirectory(plugin)
        const markdownFiles = await renameMarkdownFile(plugin)
        for (const file of markdownFiles) {
            // remove double square brackets
            const title = file.name.replace('.md', '')
            const contents = removeSquareBrackets(await this.app.vault.read(file))
            // change resource link to jekyll link
            const resourceConvertedContents = convertResourceLink(plugin, title, contents)

            // callout
            const result = convertCalloutSyntaxToChirpy(resourceConvertedContents)

            await this.app.vault.modify(file, result)
        }

        await moveFilesToChirpy(plugin)
        new Notice('Chirpy conversion complete.')
    } catch (e) {
        // TODO: error 가 발생한 파일을 backlog 로 이동
        console.error(e)
        new Notice('Chirpy conversion failed.')
    }
}

export function convertCalloutSyntaxToChirpy(content: string) {
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
    const regExpMatchArray = content.match(ObsidianRegex.IMAGE_LINK)
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
    const readyFiles = getFilesInReady.call(this, plugin)
    readyFiles.forEach((file: TFile) => {
        return this.app.vault.copy(file, file.path.replace(plugin.settings.readyDir, plugin.settings.publishedDir))
    })
}

async function renameMarkdownFile(plugin: O2Plugin): Promise<TFile[]> {
    const dateString = Temporal.Now.plainDateISO().toString()
    const markdownFiles = getFilesInReady.call(this, plugin)
    for (const file of markdownFiles) {
        const newFileName = dateString + "-" + file.name
        const newFilePath = file.path
            .replace(file.name, newFileName)
            .replace(" ", "-")
        await this.app.vault.rename(file, newFilePath)
    }
    return markdownFiles
}

async function moveFilesToChirpy(plugin: O2Plugin) {
    const absolutePath = this.app.vault.adapter.getBasePath()
    const sourceFolderPath = `${absolutePath}/${plugin.settings.readyDir}`
    const targetFolderPath = plugin.settings.targetPath()

    fs.readdir(sourceFolderPath, (err, files) => {
        if (err) throw err

        files.forEach((filename) => {
            const sourceFilePath = path.join(sourceFolderPath, filename)
            const targetFilePath = path.join(targetFolderPath, filename)

            fs.rename(sourceFilePath, targetFilePath, (err) => {
                if (err) {
                    console.error(err)
                    new Notice(err.message)
                    throw err
                }
            })
        })
    })
}
