export const ObsidianRegex = {
    IMAGE_LINK: /!\[\[(.*?)]]/g,
    DOCUMENT_LINK: /(?<!!)\[\[(.*?)]]/g,
    CALLOUT: /> \[!(.*)].*?\n(>.*)/ig,
} as const;
