import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../core/Converter';

interface FrontMatter {
  [key: string]: string;
}

export class FrontMatterConverter implements Converter {

  private readonly fileName: string;
  private readonly resourcePath: string;
  private readonly isEnableBanner: boolean;
  private readonly isEnableUpdateFrontmatterTimeOnEdit: boolean;

  constructor(
    fileName: string,
    resourcePath: string,
    isEnableBanner = false,
    isEnableUpdateFrontmatterTimeOnEdit = false,
  ) {
    this.fileName = fileName;
    this.resourcePath = resourcePath;
    this.isEnableBanner = isEnableBanner;
    this.isEnableUpdateFrontmatterTimeOnEdit = isEnableUpdateFrontmatterTimeOnEdit;
  }

  parseFrontMatter(content: string): [FrontMatter, string] {
    const frontMatter: FrontMatter = {};
    let body = content;

    if (!content.startsWith('---')) {
      return [frontMatter, body];
    }

    const endOfFrontMatter = content.indexOf('---', 3);
    if (endOfFrontMatter === -1) {
      return [frontMatter, body];
    }

    const frontMatterLines = content.substring(3, endOfFrontMatter).split('\n');
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

  convert(input: string): string {
    const [frontMatter, body] = this.parseFrontMatter(input);

    if (Object.keys(frontMatter).length === 0) {
      return input;
    }

    if (body.match(/```mermaid/)) {
      frontMatter.mermaid = true.toString();
    }

    // FIXME: abstraction, like chain of responsibility
    const convertedFrontMatter = this.convertImageFrontMatter({ ...frontMatter });
    const result = replaceDateFrontMatter({ ...convertedFrontMatter }, this.isEnableUpdateFrontmatterTimeOnEdit);

    return `---
${Object.entries(result)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
---

${body}`;
  }

  convertImageFrontMatter(frontMatter: FrontMatter) {
    if (!this.isEnableBanner) {
      return frontMatter;
    }

    if (!frontMatter.image) {
      return frontMatter;
    }

    if (ObsidianRegex.ATTACHMENT_LINK.test(frontMatter.image)) {
      const match = frontMatter.image.match(ObsidianRegex.ATTACHMENT_LINK);
      if (match) {
        frontMatter.image = frontMatter.image.replace(ObsidianRegex.ATTACHMENT_LINK, '$1.$2');
      }
    }
    frontMatter.image = convertImagePath(this.fileName, frontMatter.image, this.resourcePath);
    return frontMatter;
  }

}

function convertImagePath(postTitle: string, imagePath: string, resourcePath: string): string {
  return `/${resourcePath}/${postTitle}/${imagePath}`;
}

function replaceDateFrontMatter(frontMatter: FrontMatter, isEnable: boolean): FrontMatter {
  if (!isEnable) {
    return frontMatter;
  }
  if (frontMatter.updated.length > 0) {
    frontMatter.date = frontMatter.updated;
    delete frontMatter.updated;
  }
  return frontMatter;
}
