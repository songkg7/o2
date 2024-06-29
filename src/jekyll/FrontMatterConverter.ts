import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../core/Converter';
import yaml from 'js-yaml';

interface FrontMatter {
  [key: string]: string | undefined;
}

const parseFrontMatter = (content: string): [FrontMatter, string] => {
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

  try {
    const frontMatter = yaml.load(frontMatterLines) as FrontMatter;
    return [frontMatter, body];
  } catch (e) {
    console.error(e);
    return [{}, content];
  }
};

const join = (result: FrontMatter, body: string) => `---
${Object.entries(result)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
---

${body}`;

const convert = (frontMatter: FrontMatter) => {
  const fm = { ...frontMatter };
  // if not around front matter title using double quote, add double quote
  fm.title = fm.title?.startsWith('"') ? fm.title : `"${fm.title}"`;

  // if not around front matter categories using an array, add an array
  if (fm.categories && JSON.stringify(fm.categories).startsWith('[')) {
    fm.categories = `${JSON.stringify(fm.categories)
      .replace(/,/g, ', ')
      .replace(/"/g, '')
    }`;
  }

  // if fm.tags is array
  if (fm.tags) {
    fm.tags = Array.isArray(fm.tags) ? `[${fm.tags.join(', ')}]` : `[${fm.tags}]`;
  }

  return fm;
};

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
    return parseFrontMatter(content);
  }

  convert(input: string): string {
    const [frontMatter, body] = this.parseFrontMatter(input);

    if (Object.keys(frontMatter).length === 0) {
      return input;
    }

    if (body.match(/```mermaid/)) {
      frontMatter.mermaid = true.toString();
    }

    const result = convert(
      convertImageFrontMatter(
        this.isEnableBanner,
        this.fileName,
        this.resourcePath,
        replaceDateFrontMatter(
          { ...frontMatter },
          this.isEnableUpdateFrontmatterTimeOnEdit,
        ),
      ),
    );

    return join(result, body);
  }

}

function convertImageFrontMatter(
  isEnable: boolean,
  fileName: string,
  resourcePath: string,
  frontMatter: FrontMatter,
) {
  if (!isEnable) {
    return frontMatter;
  }

  if (!frontMatter.image) {
    return frontMatter;
  }

  const match = ObsidianRegex.ATTACHMENT_LINK.exec(frontMatter.image);
  if (match) {
    frontMatter.image = `${match[1]}.${match[2]}`;
  }
  frontMatter.image = convertImagePath(fileName, frontMatter.image, resourcePath);
  return frontMatter;
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

export const convertFrontMatter = (input: string) => {
  const [frontMatter, body] = parseFrontMatter(input);
  if (Object.keys(frontMatter).length === 0) {
    return input;
  }

  delete frontMatter['aliases'];
  delete frontMatter['updated'];
  delete frontMatter['published'];

  return join(
    convert({ ...frontMatter }),
    body,
  );
};
