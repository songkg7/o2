// FIXME: This is a temporary way to mimic Java's enum.
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ObsidianRegex {
    export const IMAGE_LINK = /!\[\[(.*?)]]/g;
    export const DOCUMENT_LINK = /(?<!!)\[\[(.*?)]]/g;
    export const CALLOUT =
        /> \[!(NOTE|WARNING|ERROR|TIP|INFO|DANGER|TODO|EXAMPLE|QUOTE|CITE|SUCCESS|DONE|CHECK|MISSING|FAIL|FAILURE|BUG|ATTENTION|CAUTION|FAQ|HELP|QUESTION|IMPORTANT|HINT)] .*?\n(>.*)/ig;
}
