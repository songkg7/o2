import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../core/Converter';
import yaml from 'js-yaml';

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
    if (!content.startsWith('---')) {
      return [{}, content];
    }

    // for define front matter boundary
    const endOfFrontMatter = content.indexOf('---', 3);
    if (endOfFrontMatter === -1) {
      return [{}, content];
    }

    const frontMatterLines = content.substring(3, endOfFrontMatter);
    const body = content.substring(endOfFrontMatter + 3).trimStart();

    const frontMatter = yaml.load(frontMatterLines) as FrontMatter;
    return [frontMatter, body];
  }

  convert(input: string): string {
    const [frontMatter, body] = this.parseFrontMatter(input);

    if (Object.keys(frontMatter).length === 0) {
      return input;
    }

    // if not around front matter title using double quote, add double quote
    if (frontMatter.title && !frontMatter.title.startsWith('"')) {
      frontMatter.title = `"${frontMatter.title}"`;
    }

    // if not around front matter categories using an array, add an array
    if (frontMatter.categories && JSON.stringify(frontMatter.categories).startsWith('[')) {
      frontMatter.categories = `${JSON.stringify(frontMatter.categories)
        .replace(/,/g, ', ')
        .replace(/"/g, '')
      }`;
    }

    // if frontMatter.tags is array
    if (frontMatter.tags && Array.isArray(frontMatter.tags)) {
      frontMatter.tags = `[${frontMatter.tags}]`.replace(/,/g, ', ');
    } else if (frontMatter.tags && !JSON.stringify(frontMatter.tags).startsWith('[')) {
      frontMatter.tags = `[${frontMatter.tags}]`;
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
  if (!isEnable || frontMatter.updated === undefined) {
    return frontMatter;
  }
  if (frontMatter.updated.length > 0) {
    frontMatter.date = frontMatter.updated;
    delete frontMatter.updated;
  }
  return frontMatter;
}
