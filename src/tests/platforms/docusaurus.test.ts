import {
  convertContent,
  getCurrentDate,
} from '../../platforms/docusaurus/docusaurus';

describe('Docusaurus Conversion', () => {
  describe('getCurrentDate', () => {
    it('should return date in YYYY-MM-DD format', () => {
      const date = getCurrentDate();
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('convertContent', () => {
    it('should convert wiki links', () => {
      const input = '[[Some Page]]';
      const result = convertContent(input);
      expect(result).toBe('Some Page');
    });

    it('should convert footnotes', () => {
      const input = 'Text[^1]\n\n[^1]: Footnote';
      const result = convertContent(input);
      expect(result).toContain('[^fn-nth-1]');
      expect(result).toContain('[^fn-nth-1]: Footnote');
    });

    it('should convert callouts', () => {
      const input = '> [!note] Title\n> Content';
      const result = convertContent(input);
      expect(result).toContain(':::note');
      expect(result).toContain(':::');
    });

    it('should handle multiple conversions together', () => {
      const input =
        '[[Page]] with [^1]\n\n[^1]: Note\n\n> [!info] Info\n> Text';
      const result = convertContent(input);
      expect(result).toBe(
        'Page with [^fn-nth-1]\n\n[^fn-nth-1]: Note\n\n:::info[Info]\n\nText\n\n:::',
      );
    });
  });
});
