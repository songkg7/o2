import { ObsidianRegex } from '../ObsidianRegex';
import { Converter } from '../core/Converter';

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

const map = new Map<string, string>();
map.set('note', 'info');
map.set('info', 'info');
map.set('todo', 'info');
map.set('example', 'info');
map.set('quote', 'info');
map.set('cite', 'info');
map.set('success', 'info');
map.set('done', 'info');
map.set('check', 'info');
map.set('tip', 'tip');
map.set('hint', 'tip');
map.set('important', 'tip');
map.set('question', 'tip');
map.set('help', 'tip');
map.set('faq', 'tip');
map.set('failure', 'danger');
map.set('fail', 'danger');
map.set('missing', 'danger');
map.set('error', 'danger');
map.set('danger', 'danger');
map.set('bug', 'danger');
map.set('warning', 'warning');
map.set('caution', 'warning');
map.set('attention', 'warning');

function replaceKeyword(target: string) {
  return map.get(target.toLowerCase()) || 'info';
}
