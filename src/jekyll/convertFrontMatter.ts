import { ObsidianRegex } from "../ObsidianRegex";

interface FrontMatter {
    [key: string]: string;
}

export function convertFrontMatter(filename: string, content: string, resourcePath: string): string {
    const [frontMatter, body] = parseFrontMatter(content);

    if (!frontMatter.image) {
        return content;
    }

    // if obsidian image link
    if (ObsidianRegex.IMAGE_LINK.test(frontMatter.image)) {
        const match = frontMatter.image.match(ObsidianRegex.IMAGE_LINK);
        if (match) {
            frontMatter.image = frontMatter.image.replace(ObsidianRegex.IMAGE_LINK, '$1');
        }
    }

    frontMatter.image = convertImagePath(filename, frontMatter.image, resourcePath);

    return `---
${Object.entries(frontMatter)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")}
---

${body}`;
}

function parseFrontMatter(content: string): [FrontMatter, string] {
    const frontMatter: FrontMatter = {};
    let body = content;

    if (!content.startsWith("---")) {
        return [frontMatter, body];
    }

    const endOfFrontMatter = content.indexOf("---", 3);
    if (endOfFrontMatter === -1) {
        return [frontMatter, body];
    }

    const frontMatterLines = content.substring(3, endOfFrontMatter).split("\n");
    for (const line of frontMatterLines) {
        const match = line.match(/^([\w-]+):\s*(.*)$/);
        if (match) {
            const key = match[1];
            frontMatter[key] = match[2];
        }
    }
    body = content.substring(endOfFrontMatter + 3).trimLeft();

    return [frontMatter, body];
}

function convertImagePath(postTitle: string, imagePath: string, resourcePath: string): string {
    return `/${resourcePath}/${postTitle}/${imagePath}`;
}

