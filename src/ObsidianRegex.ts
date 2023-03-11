export const ObsidianRegex = {
    IMAGE_LINK: /!\[\[([^|\]]+)\|?(\d*)]]/g,
    WIKI_LINK: /(?<!!)\[\[([^|\]]+)\|?(.*)]]/g,
    CALLOUT: /> \[!(.*)].*?\n(>.*)/ig,
} as const;
