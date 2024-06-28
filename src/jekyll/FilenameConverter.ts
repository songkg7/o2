import { TEMP_PREFIX } from '../docusaurus/docusaurus';

export const convertFileName = (filename: string): string =>
  filename
    .replace('.md', '')
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9-\uAC00-\uD7A3]/g, '');

export const removeTempPrefix = (filename: string): string =>
  filename.replace(TEMP_PREFIX, '');
