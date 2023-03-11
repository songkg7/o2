import { AbstractConverter } from "../core/Converter";
import { ObsidianRegex } from "../ObsidianRegex";

export class WikiLinkConverter extends AbstractConverter {
    convert(input: string): string {
        const result = input.replace(ObsidianRegex.WIKI_LINK, (match, p1, p2) => (p2 ? p2 : p1));
        return super.convert(result);
    }
}
