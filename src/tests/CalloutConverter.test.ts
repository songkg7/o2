import {
  CalloutConverter,
  convertDocusaurusCallout,
} from '../CalloutConverter';

const calloutConverter = new CalloutConverter();

describe('Jekyll: convert callout syntax', () => {
  it.each([
    ['note'],
    ['todo'],
    ['example'],
    ['quote'],
    ['cite'],
    ['success'],
    ['done'],
    ['check'],
    ['NOTE'],
    ['TODO'],
    ['EXAMPLE'],
    ['QUOTE'],
    ['CITE'],
    ['SUCCESS'],
    ['DONE'],
    ['CHECK'],
  ])('%s => info', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-info}`);
  });

  it.each([
    ['tip'],
    ['hint'],
    ['important'],
    ['question'],
    ['help'],
    ['faq'],
    ['TIP'],
    ['HINT'],
    ['IMPORTANT'],
    ['QUESTION'],
    ['HELP'],
    ['FAQ'],
  ])('%s => tip', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-tip}`);
  });

  it.each([
    ['warning'],
    ['caution'],
    ['attention'],
    ['WARNING'],
    ['CAUTION'],
    ['ATTENTION'],
  ])('%s => warning', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-warning}`);
  });

  it.each([['unknown']])(
    'Unregistered keywords should be converted to info keyword',
    callout => {
      const context = `> [!${callout}] title\n> content`;

      const result = calloutConverter.convert(context);
      expect(result).toBe(`> content\n{: .prompt-info}`);
    },
  );

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

describe('Docusaurus: convert callout syntax', () => {
  it.each([
    ['todo'],
    ['example'],
    ['quote'],
    ['cite'],
    ['success'],
    ['done'],
    ['check'],
    ['TODO'],
    ['EXAMPLE'],
    ['QUOTE'],
    ['CITE'],
    ['SUCCESS'],
    ['DONE'],
    ['CHECK'],
  ])('%s => info', callout => {
    const context = `> [!${callout}] This is Title!\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::note[This is Title!]\n\ncontent\n\n:::`);
  });

  it.each([['note'], ['NOTE']])('%s => note', callout => {
    const context = `> [!${callout}] This is Title!\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::note[This is Title!]\n\ncontent\n\n:::`);
  });

  it.each([
    ['tip'],
    ['hint'],
    ['important'],
    ['question'],
    ['help'],
    ['TIP'],
    ['HINT'],
    ['IMPORTANT'],
    ['QUESTION'],
    ['HELP'],
  ])('%s => tip', callout => {
    const context = `> [!${callout}] This is Title!\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::tip[This is Title!]\n\ncontent\n\n:::`);
  });

  it.each([
    ['warning'],
    ['caution'],
    ['attention'],
    ['WARNING'],
    ['CAUTION'],
    ['ATTENTION'],
  ])('%s => warning', callout => {
    const context = `> [!${callout}] This is Title!\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::warning[This is Title!]\n\ncontent\n\n:::`);
  });

  it('unknown => note', () => {
    const context = `> [!unknown] This is Title!\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::note[This is Title!]\n\ncontent\n\n:::`);
  });

  it('not exist custom title', () => {
    const context = `> [!INFO]\n> content`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::info\n\ncontent\n\n:::`);
  });
});

describe('danger callout', () => {
  const dangerKeyword = [
    ['error'],
    ['danger'],
    ['bug'],
    ['failure'],
    ['fail'],
    ['missing'],
    ['ERROR'],
    ['DANGER'],
    ['BUG'],
    ['FAILURE'],
    ['FAIL'],
    ['MISSING'],
  ];

  it.each(dangerKeyword)('%s => danger', callout => {
    const context = `> [!${callout}] This is Title!\n> lorem it sum`;

    const result = convertDocusaurusCallout(context);
    expect(result).toBe(`:::danger[This is Title!]\n\nlorem it sum\n\n:::`);
  });

  it.each(dangerKeyword)('%s => danger', callout => {
    const context = `> [!${callout}] title\n> content`;

    const result = calloutConverter.convert(context);
    expect(result).toBe(`> content\n{: .prompt-danger}`);
  });
});
