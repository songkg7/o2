import { CalloutConverter } from '../jekyll/CalloutConverter';

const calloutConverter = new CalloutConverter();

describe('convert callout syntax', () => {

  it.each([
    ['note'], ['todo'], ['example'], ['quote'], ['cite'], ['success'], ['done'], ['check'],
    ['NOTE'], ['TODO'], ['EXAMPLE'], ['QUOTE'], ['CITE'], ['SUCCESS'], ['DONE'], ['CHECK'],
  ])('%s => info', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-info}`);
  });

  it.each([
    ['tip'], ['hint'], ['important'], ['question'], ['help'], ['faq'],
    ['TIP'], ['HINT'], ['IMPORTANT'], ['QUESTION'], ['HELP'], ['FAQ'],
  ])('%s => tip', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-tip}`);
  });

  it.each([
    ['warning'], ['caution'], ['attention'],
    ['WARNING'], ['CAUTION'], ['ATTENTION'],
  ])('%s => warning', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-warning}`);
  });

  it.each([
    ['error'], ['danger'], ['bug'], ['failure'], ['fail'], ['missing'],
    ['ERROR'], ['DANGER'], ['BUG'], ['FAILURE'], ['FAIL'], ['MISSING'],
  ])('%s => danger', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-danger}`);
  });

  it.each([
    ['unknown'],
  ])('Unregistered keywords should be converted to info keyword', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-info}`);
  });

  it('info => info, not exist custom title', () => {
    const context = `> [!INFO]\n> info content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> info content\n{: .prompt-info}`);
  });

  it('remove foldable callouts', () => {
    const context = `> [!faq]- Are callouts foldable?\n> content`;
    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-tip}`);
  });

});
