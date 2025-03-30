import { EmbedsConverter } from '../../../core/converters/EmbedsConverter';

const converter = new EmbedsConverter();

describe('convert called', () => {
  it.each([
    ['![[test]]', 'test'],
    ['![[Obsidian#What is Obsidian]]', 'Obsidian'],
    ['![[Obsidian#^asdf1234]]', 'Obsidian'],
    ['![[Obsidian#What is Obsidian]]', 'Obsidian'],
  ])(
    'should remove brackets if does not exist extension keyword',
    (input, expected) => {
      expect(converter.convert(input)).toEqual(expected);
    },
  );
});
