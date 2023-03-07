import { AbstractConverter } from "../core/Converter";
import { ObsidianRegex } from "../ObsidianRegex";

export class BracketConverter extends AbstractConverter {
    convert(input: string): string {
        const result = input.replace(ObsidianRegex.DOCUMENT_LINK, '$1');
        return super.convert(result);
    }
}
