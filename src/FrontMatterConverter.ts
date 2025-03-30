import { ObsidianRegex } from './core/ObsidianRegex';
import { pipe } from './core/fp';
import yaml from 'js-yaml';
import {
  ConversionError,
  ConversionResult,
  Either,
  FrontMatter,
  left,
  right,
  map,
} from './types';

// Helper functions
const isNullOrEmpty = (str: string | undefined | null): boolean =>
  !str || (typeof str === 'string' && str.trim().length === 0);

const formatDate = (date: unknown): string => {
  if (typeof date === 'string') return date;
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return String(date);
};

const formatAuthorList = (authors: string): string => {
  const authorList = authors.split(',').map(author => author.trim());
  return authorList.length > 1 ? `[${authorList.join(', ')}]` : authorList[0];
};

// Pure functions for front matter operations
const extractFrontMatter = (
  content: string,
): Either<ConversionError, ConversionResult> => {
  if (!content.startsWith('---\n')) {
    return right({ frontMatter: {}, body: content });
  }

  const endOfFrontMatter = content.indexOf('\n---', 3);
  if (endOfFrontMatter === -1) {
    return right({ frontMatter: {}, body: content });
  }

  const frontMatterLines = content.substring(4, endOfFrontMatter);
  const body = content.substring(endOfFrontMatter + 4).trimStart();

  try {
    const frontMatter = yaml.load(frontMatterLines, {
      schema: yaml.JSON_SCHEMA,
    }) as FrontMatter;
    return right({ frontMatter: frontMatter || {}, body });
  } catch (e) {
    return left({
      type: 'PARSE_ERROR',
      message: `Failed to parse front matter: ${
        e instanceof Error ? e.message : 'Unknown error'
      }`,
    });
  }
};

const formatTitle = (frontMatter: FrontMatter): FrontMatter => {
  if (!frontMatter.title) return frontMatter;
  return {
    ...frontMatter,
    title: frontMatter.title.startsWith('"')
      ? frontMatter.title
      : `"${frontMatter.title}"`,
  };
};

const formatCategories = (frontMatter: FrontMatter): FrontMatter => {
  if (!frontMatter.categories) return frontMatter;

  const categories = JSON.stringify(frontMatter.categories).startsWith('[')
    ? JSON.stringify(frontMatter.categories)
        .replace(/,/g, ', ')
        .replace(/"/g, '')
    : frontMatter.categories;

  return { ...frontMatter, categories };
};

const formatAuthors = (frontMatter: FrontMatter): FrontMatter => {
  if (!frontMatter.authors) return frontMatter;

  const authors = frontMatter.authors;
  if (authors.startsWith('[') && authors.endsWith(']')) return frontMatter;

  return {
    ...frontMatter,
    authors: formatAuthorList(authors),
  };
};

const formatTags = (frontMatter: FrontMatter): FrontMatter => {
  if (!frontMatter.tags) return frontMatter;

  const tags = Array.isArray(frontMatter.tags)
    ? `[${frontMatter.tags.join(', ')}]`
    : frontMatter.tags
      ? `[${frontMatter.tags}]`
      : '[]';

  return { ...frontMatter, tags };
};

const handleMermaid = (result: ConversionResult): ConversionResult => ({
  ...result,
  frontMatter: result.body.match(/```mermaid/)
    ? { ...result.frontMatter, mermaid: 'true' }
    : result.frontMatter,
});

const convertImagePath =
  (postTitle: string, resourcePath: string) =>
  (imagePath: string): string =>
    `/${resourcePath}/${postTitle}/${imagePath}`;

const handleImageFrontMatter =
  (isEnable: boolean, fileName: string, resourcePath: string) =>
  (frontMatter: FrontMatter): FrontMatter => {
    if (!isEnable || !frontMatter.image) return frontMatter;

    const match = ObsidianRegex.ATTACHMENT_LINK.exec(frontMatter.image);
    const processedImage = match
      ? `${match[1]}.${match[2]}`
      : frontMatter.image;
    const finalImage = convertImagePath(fileName, resourcePath)(processedImage);

    return { ...frontMatter, image: finalImage };
  };

const handleDateFrontMatter =
  (isEnable: boolean) =>
  (frontMatter: FrontMatter): FrontMatter => {
    if (!isEnable || isNullOrEmpty(frontMatter.updated)) return frontMatter;

    const { updated, ...rest } = frontMatter;
    return { ...rest, date: formatDate(updated) };
  };

const serializeFrontMatter = (result: ConversionResult): string => {
  if (Object.keys(result.frontMatter).length === 0) {
    return result.body;
  }

  return `---
${Object.entries(result.frontMatter)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
---

${result.body}`;
};

// Main conversion function
export const convertFrontMatter = (
  input: string,
  options: Readonly<{
    fileName?: string;
    resourcePath?: string;
    isEnableBanner?: boolean;
    isEnableUpdateFrontmatterTimeOnEdit?: boolean;
    authors?: string;
  }> = {},
): Either<ConversionError, string> => {
  const {
    fileName = '',
    resourcePath = '',
    isEnableBanner = false,
    isEnableUpdateFrontmatterTimeOnEdit = false,
    authors,
  } = options;

  const processFrontMatter = (frontMatter: FrontMatter): FrontMatter => {
    const withTitle = formatTitle(frontMatter);
    const withCategories = formatCategories(withTitle);
    const withAuthors = formatAuthors(withCategories);
    const withTags = formatTags(withAuthors);
    const withImage = handleImageFrontMatter(
      isEnableBanner,
      fileName,
      resourcePath,
    )(withTags);
    const withDate = handleDateFrontMatter(isEnableUpdateFrontmatterTimeOnEdit)(
      withImage,
    );
    return authors
      ? { ...withDate, authors: formatAuthorList(authors) }
      : withDate;
  };

  return pipe(
    extractFrontMatter(input),
    map(result => ({
      ...result,
      frontMatter: processFrontMatter(result.frontMatter),
    })),
    map(handleMermaid),
    map(serializeFrontMatter),
  );
};
