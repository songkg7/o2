import { replaceKeyword } from "../ObsidianCallout";
import { ObsidianRegex } from "../ObsidianRegex";
import { Converter } from "../core/Converter";

export class CalloutConverter implements Converter {
    convert(input: string): string {
        return convertCalloutSyntaxToChirpy(input);
    }
}

function convertCalloutSyntaxToChirpy(content: string) {
    function replacer(match: string, p1: string, p2: string) {
        return `${p2}\n{: .prompt-${replaceKeyword(p1)}}`;
    }

    return content.replace(ObsidianRegex.CALLOUT, replacer);
}
