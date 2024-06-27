export default function convertFileName(filename: string): string {
  return filename
    .replace('.md', '')
    .replace(/\s/g, '-')
    .replace(/[^a-zA-Z0-9-\uAC00-\uD7A3]/g, '');
}
