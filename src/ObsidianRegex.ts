// FIXME: This is a temporary way to mimic Java's enum.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ObsidianRegex {
    export const IMAGE_LINK = /!\[\[(.*?)]]/g;
    export const DOCUMENT_LINK = /(?<!!)\[\[(.*?)]]/g;
    export const CALLOUT = /> \[!(.*)].*?\n(>.*)/ig;
}
