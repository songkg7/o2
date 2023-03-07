interface FrontMatter {
    [key: string]: string;
}

export function parseFrontMatter(content: string): [FrontMatter, string] {
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


