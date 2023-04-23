export const ObsidianRegex = {
  ATTACHMENT_LINK: /!\[\[([^|\]]+)\.(\w+)\|?(\d*)x?(\d*)]](\n{0,2}(_.*_))?/g,
  EMBEDDED_LINK: /!\[\[([\w\s-]+)[#^]*([\w\s]*)]]/g,
  WIKI_LINK: /(?<!!)\[\[([^|\]]+)\|?([^|\]]*)]]/g,
  CALLOUT: /> \[!(.*)].*?\n(>.*)/ig,
  SIMPLE_FOOTNOTE: /\[\^(\d+)]/g,
  COMMENT: /%%(.*?)%%/g,
  DOUBLE_CURLY_BRACES: /{{(.*?)}}/g,
} as const;
