export const ObsidianRegex = {
    IMAGE_LINK: /!\[\[([^|\]]+)\|?(\d*)]]/g,
    DOCUMENT_LINK: /(?<!!)\[\[(.*?)]]/g,
    CALLOUT: /> \[!(.*)].*?\n(>.*)/ig,
} as const;
