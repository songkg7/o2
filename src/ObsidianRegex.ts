export const ObsidianRegex = {
    IMAGE_LINK: /!\[\[([^|\]]+)\|?(\d*)]]/g,
    WIKI_LINK: /(?<!!)\[\[([^|\]]+)\|?(.*)]]/g,
    CALLOUT: /> \[!(.*)].*?\n(>.*)/ig,
    SIMPLE_FOOTNOTE: /\[\^(\d+)]/g,
    COMMENT: /%%(.*?)%%/g,
} as const;
