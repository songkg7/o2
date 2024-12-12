import fs from 'fs';
import { ObsidianRegex } from './core/ObsidianRegex';
import { Notice } from 'obsidian';
import { Converter } from './core/Converter';
import { removeTempPrefix } from './FilenameConverter';

export class ResourceLinkConverter implements Converter {
  private readonly fileName: string;
  private readonly resourcePath: string;
  private readonly absolutePath: string;
  private readonly attachmentsFolder: string;
  private readonly relativeResourcePath: string;
  private readonly liquidFilterOptions: { useRelativeUrl: boolean };

  constructor(
    fileName: string,
    resourcePath: string,
    absolutePath: string,
    attachmentsFolder: string,
    relativeResourcePath: string,
    liquidFilterOptions?: { useRelativeUrl: boolean },
  ) {
    this.fileName = fileName;
    this.resourcePath = resourcePath;
    this.absolutePath = absolutePath;
    this.attachmentsFolder = attachmentsFolder;
    this.relativeResourcePath = relativeResourcePath;
    this.liquidFilterOptions = liquidFilterOptions ?? { useRelativeUrl: false };
  }

  convert(input: string): string {
    const sanitizedFileName = removeTempPrefix(this.fileName);
    const resourcePath = `${this.resourcePath}/${sanitizedFileName}`;
    const resourceNames = extractResourceNames(input);
    if (!(resourceNames === undefined || resourceNames.length === 0)) {
      fs.mkdirSync(resourcePath, { recursive: true });
    }
    resourceNames?.forEach((resourceName) => {
      fs.copyFile(
        `${this.absolutePath}/${this.attachmentsFolder}/${resourceName}`,
        `${resourcePath}/${(resourceName.replace(/\s/g, '-'))}`,
        (err) => {
          if (err) {
            // ignore error
            console.error(err);
            new Notice(err.message);
          }
        },
      );
    });

    const replacer = (match: string,
                      contents: string,
                      suffix: string,
                      width: string | undefined,
                      height: string | undefined,
                      space: string | undefined,
                      caption: string | undefined) =>
      `![image](/${this.relativeResourcePath}/${sanitizedFileName}/${contents.replace(/\s/g, '-')}.${suffix})`
      + `${convertImageSize(width, height)}`
      + `${convertImageCaption(caption)}`;

    return input.replace(ObsidianRegex.ATTACHMENT_LINK, replacer);
  }
}

export function extractResourceNames(content: string) {
  const result = content.match(ObsidianRegex.ATTACHMENT_LINK);
  if (result === null) {
    return undefined;
  }
  return result.map((imageLink) => imageLink.replace(ObsidianRegex.ATTACHMENT_LINK, '$1.$2'));
}

function convertImageSize(width: string | undefined, height: string | undefined) {
  if (width === undefined || width.length === 0) {
    return '';
  }
  if (height === undefined || height.length === 0) {
    return `{: width="${width}" }`;
  }
  return `{: width="${width}" height="${height}" }`;
}

function convertImageCaption(caption: string | undefined) {
  if (caption === undefined || caption.length === 0) {
    return '';
  }
  return `\n${caption}`;
}
