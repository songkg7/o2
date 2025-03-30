import { Notice, TFile } from 'obsidian';
import { convertDocusaurusCallout } from '../../core/converters/CalloutConverter';
import { convertComments } from '../../core/converters/CommentsConverter';
import { convertFootnotes } from '../../core/converters/FootnotesConverter';
import { convertFrontMatter } from '../../core/converters/FrontMatterConverter';
import { convertWikiLink } from '../../core/converters/WikiLinkConverter';
import { pipe } from '../../core/fp';
import {
  chain,
  ConversionError,
  Either,
  fold,
  left,
  map,
  right,
} from '../../core/types/types';
import {
  copyMarkdownFile,
  getFilesInReady,
  moveFiles,
  parseLocalDate,
  vaultAbsolutePath,
} from '../../core/utils/utils';
import O2Plugin from '../../main';

// Pure functions
export const getCurrentDate = (): string =>
  new Date().toISOString().split('T')[0];

export const convertContent = (value: string): string =>
  pipe(
    value,
    convertWikiLink,
    convertFootnotes,
    convertDocusaurusCallout,
    convertComments,
  );

// File operations with Either
const processFrontMatter = async (
  plugin: O2Plugin,
  file: TFile,
  published?: string,
): Promise<Either<ConversionError, string>> => {
  try {
    await plugin.app.fileManager.processFrontMatter(file, fm => {
      if (published) {
        fm.published = published;
      }
      return fm;
    });
    return right(published || getCurrentDate());
  } catch (error) {
    return left({
      type: 'PROCESS_ERROR',
      message: `Failed to process front matter: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};

const readFileContent = async (
  plugin: O2Plugin,
  file: TFile,
): Promise<Either<ConversionError, string>> => {
  try {
    const content = await plugin.app.vault.read(file);
    return right(content);
  } catch (error) {
    return left({
      type: 'READ_ERROR',
      message: `Failed to read file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};

const writeFileContent = async (
  plugin: O2Plugin,
  file: TFile,
  content: string,
): Promise<Either<ConversionError, void>> => {
  try {
    await plugin.app.vault.modify(file, content);
    return right(undefined);
  } catch (error) {
    return left({
      type: 'WRITE_ERROR',
      message: `Failed to write file: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};

const moveToDocusaurus = async (
  plugin: O2Plugin,
  publishedDate: string,
): Promise<Either<ConversionError, void>> => {
  try {
    await moveFiles(
      `${vaultAbsolutePath(plugin)}/${plugin.obsidianPathSettings.readyFolder}`,
      plugin.docusaurus.targetPath(),
      plugin.docusaurus.pathReplacer,
      parseLocalDate(publishedDate),
    );
    return right(undefined);
  } catch (error) {
    return left({
      type: 'MOVE_ERROR',
      message: `Failed to move files: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    });
  }
};

// Side effects
const showNotice = (message: string, duration = 5000): void => {
  new Notice(message, duration);
};

const markPublished = async (plugin: O2Plugin): Promise<void> => {
  const filesInReady = getFilesInReady(plugin);
  const currentDate = getCurrentDate();

  for (const file of filesInReady) {
    const result = await processFrontMatter(plugin, file, currentDate);
    fold<ConversionError, string, void>(
      error => showNotice(`Failed to mark as published: ${error.message}`),
      () => {},
    )(result);
  }
};

// Main conversion function
export const convertToDocusaurus = async (plugin: O2Plugin): Promise<void> => {
  const markdownFiles = await copyMarkdownFile(plugin);

  for (const file of markdownFiles) {
    const publishedDateResult = await processFrontMatter(plugin, file);
    const contentResult = await readFileContent(plugin, file);

    const conversionResult = pipe(
      contentResult,
      chain((content: string) =>
        convertFrontMatter(content, {
          authors: plugin.docusaurus.authors,
        }),
      ),
      map((content: string) => convertContent(content)),
    );

    const writeResult = await pipe(
      conversionResult,
      fold<ConversionError, string, Promise<Either<ConversionError, void>>>(
        error => {
          showNotice(`Conversion failed: ${error.message}`);
          return Promise.resolve(left(error));
        },
        content => writeFileContent(plugin, file, content),
      ),
    );

    fold<ConversionError, void, void>(
      error => showNotice(`Failed to save changes: ${error.message}`),
      () => showNotice('Converted to Docusaurus successfully.'),
    )(writeResult);

    const publishedDate = fold<ConversionError, string, string>(
      () => getCurrentDate(),
      date => date,
    )(publishedDateResult);

    const moveResult = await moveToDocusaurus(plugin, publishedDate);

    fold<ConversionError, void, void>(
      error => showNotice(`Failed to move files: ${error.message}`),
      async () => {
        await markPublished(plugin);
        showNotice('Moved files to Docusaurus successfully.');
      },
    )(moveResult);
  }
};
