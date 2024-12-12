import { ObsidianRegex } from './core/ObsidianRegex';
import { Converter } from './core/Converter';

export class CalloutConverter implements Converter {
  convert(input: string): string {
    return convertCalloutSyntaxToChirpy(input);
  }
}

const jekyllReplacer = (match: string, p1: string, p2: string, p3: string) =>
  `${p3}\n{: .prompt-${replaceKeyword(p1)}}`;

const convertCalloutSyntaxToChirpy = (content: string) =>
  content.replace(ObsidianRegex.CALLOUT, jekyllReplacer);

const jekyllCalloutMap = new Map<string, string>();
jekyllCalloutMap.set('note', 'info');
jekyllCalloutMap.set('info', 'info');
jekyllCalloutMap.set('todo', 'info');
jekyllCalloutMap.set('example', 'info');
jekyllCalloutMap.set('quote', 'info');
jekyllCalloutMap.set('cite', 'info');
jekyllCalloutMap.set('success', 'info');
jekyllCalloutMap.set('done', 'info');
jekyllCalloutMap.set('check', 'info');
jekyllCalloutMap.set('tip', 'tip');
jekyllCalloutMap.set('hint', 'tip');
jekyllCalloutMap.set('important', 'tip');
jekyllCalloutMap.set('question', 'tip');
jekyllCalloutMap.set('help', 'tip');
jekyllCalloutMap.set('faq', 'tip');
jekyllCalloutMap.set('failure', 'danger');
jekyllCalloutMap.set('fail', 'danger');
jekyllCalloutMap.set('missing', 'danger');
jekyllCalloutMap.set('error', 'danger');
jekyllCalloutMap.set('danger', 'danger');
jekyllCalloutMap.set('bug', 'danger');
jekyllCalloutMap.set('warning', 'warning');
jekyllCalloutMap.set('caution', 'warning');
jekyllCalloutMap.set('attention', 'warning');

function replaceKeyword(target: string) {
  return jekyllCalloutMap.get(target.toLowerCase()) || 'info';
}

const docusaurusReplacer = (
  match: string,
  p1: string,
  p2: string,
  p3: string,
) => {
  const title = p2 ? `[${p2.trim()}]` : '';
  return `:::${replaceDocusaurusKeyword(p1)}${title}\n\n${replaceDocusaurusContents(p3)}\n\n:::`;
};

export const convertDocusaurusCallout = (input: string) =>
  input.replace(ObsidianRegex.CALLOUT, docusaurusReplacer);

const replaceDocusaurusKeyword = (target: string) =>
  docusaurusCalloutMap[target.toLowerCase()] || 'note';

const docusaurusCalloutMap: { [key: string]: string } = {
  note: 'note',
  info: 'info',
  todo: 'note',
  example: 'note',
  quote: 'note',
  cite: 'note',
  success: 'note',
  done: 'note',
  check: 'note',
  tip: 'tip',
  hint: 'tip',
  important: 'tip',
  question: 'tip',
  help: 'tip',
  faq: 'tip',
  failure: 'danger',
  fail: 'danger',
  missing: 'danger',
  error: 'danger',
  danger: 'danger',
  bug: 'danger',
  warning: 'warning',
  caution: 'warning',
  attention: 'warning',
};

const replaceDocusaurusContents = (contents: string) =>
  contents.replace(/^> /, '');
