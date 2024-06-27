import O2Plugin from '../main';
import convertFileName from '../jekyll/FilenameConverter';

export async function convertToDocusaurus(plugin: O2Plugin) {
  // my blog post.md -> my-blog-post.md
  convertFileName();
}
