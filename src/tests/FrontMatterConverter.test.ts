import { convertFrontMatter } from '../FrontMatterConverter';
import { ConversionError } from '../types';

describe('Functional FrontMatter Converter', () => {
  describe('Basic front matter conversion', () => {
    it('should handle basic front matter correctly', () => {
      const input = `---
title: test
date: 2021-01-01 12:00:00 +0900
categories: [test]
---

# test
`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toEqual(`---
title: "test"
date: 2021-01-01 12:00:00 +0900
categories: [test]
---

# test
`);
      }
    });
  });

  describe('Image handling', () => {
    it('should process image paths when enabled', () => {
      const input = `---
title: test
image: test.png
---`;
      const result = convertFrontMatter(input, {
        fileName: '2023-01-01-test',
        resourcePath: 'assets/img',
        isEnableBanner: true,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('image: /assets/img/2023-01-01-test/test.png');
      }
    });

    it('should not process image paths when disabled', () => {
      const input = `---
title: test
image: test.png
---`;
      const result = convertFrontMatter(input, {
        fileName: '2023-01-01-test',
        resourcePath: 'assets/img',
        isEnableBanner: false,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('image: test.png');
      }
    });
  });

  describe('Mermaid handling', () => {
    it('should add mermaid flag when mermaid code block is present', () => {
      const input = `---
title: test
---

\`\`\`mermaid
graph TD
    A-->B
\`\`\``;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('mermaid: true');
      }
    });

    it('should not add mermaid flag when no mermaid code block', () => {
      const input = `---
title: test
---

\`\`\`javascript
console.log('test');
\`\`\``;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).not.toContain('mermaid: true');
      }
    });
  });

  describe('Date handling', () => {
    it('should update date from updated field when enabled', () => {
      const input = `---
title: test
updated: 2023-01-01
---`;
      const result = convertFrontMatter(input, {
        isEnableUpdateFrontmatterTimeOnEdit: true,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('date: 2023-01-01');
        expect(result.value).not.toContain('updated:');
      }
    });

    it('should not update date when disabled', () => {
      const input = `---
title: test
updated: 2023-01-01
---`;
      const result = convertFrontMatter(input, {
        isEnableUpdateFrontmatterTimeOnEdit: false,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('updated: 2023-01-01');
      }
    });
  });

  describe('Author handling', () => {
    it('should format single author correctly', () => {
      const input = `---
title: test
authors: John Doe
---`;
      const result = convertFrontMatter(input, {
        authors: 'John Doe'
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('authors: John Doe');
      }
    });

    it('should format multiple authors correctly', () => {
      const input = `---
title: test
authors: John Doe, Jane Smith
---`;
      const result = convertFrontMatter(input, {
        authors: 'John Doe, Jane Smith'
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('authors: [John Doe, Jane Smith]');
      }
    });
  });

  describe('Error handling', () => {
    it('should handle invalid front matter', () => {
      const input = `---
invalid: yaml: :
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left' && (result.value as ConversionError).type) {
        expect((result.value as ConversionError).type).toBe('PARSE_ERROR');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle missing front matter', () => {
      const input = '# Just content\nNo front matter';
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toBe(input);
      }
    });

    it('should handle empty front matter', () => {
      const input = `---
---
Content`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('Content');
      }
    });

    it('should handle front matter with only dividers', () => {
      const input = `---
title: test
---
# Content
---
More content`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('More content');
        expect(result.value).toContain('# Content');
      }
    });
  });
});
