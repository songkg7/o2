import { AbstractConverter } from "../core/Converter";
import { ObsidianRegex } from "../ObsidianRegex";

export class FootnotesConverter extends AbstractConverter {

    convert(input: string): string {
        const result = input.replace(ObsidianRegex.SIMPLE_FOOTNOTE, (match, key) => {
            return `[^fn-nth-${key}]`;
        });
        return super.convert(result);
    }

}
