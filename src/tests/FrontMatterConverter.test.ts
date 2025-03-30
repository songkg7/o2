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
        expect(result.value).toContain(
          'image: /assets/img/2023-01-01-test/test.png',
        );
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

    it('should format Date object correctly', () => {
      const date = new Date('2023-01-01');
      const input = `---
title: test
updated: ${date.toISOString()}
---`;
      const result = convertFrontMatter(input, {
        isEnableUpdateFrontmatterTimeOnEdit: true,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('date: 2023-01-01');
      }
    });

    it('should handle non-string and non-Date values', () => {
      const input = `---
title: test
updated: 42
---`;
      const result = convertFrontMatter(input, {
        isEnableUpdateFrontmatterTimeOnEdit: true,
      });
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('date: 42');
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
        authors: 'John Doe',
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
        authors: 'John Doe, Jane Smith',
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

    it('should handle malformed YAML with incorrect indentation', () => {
      const input = `---
title: test
  incorrect:
 indentation:
   - item
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect((result.value as ConversionError).type).toBe('PARSE_ERROR');
        expect((result.value as ConversionError).message).toContain(
          'Failed to parse front matter',
        );
      }
    });

    it('should handle malformed YAML with duplicate keys', () => {
      const input = `---
title: first
title: second
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect((result.value as ConversionError).type).toBe('PARSE_ERROR');
      }
    });

    it('should handle malformed YAML with invalid structure', () => {
      const input = `---
[invalid structure
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Left');
      if (result._tag === 'Left') {
        expect((result.value as ConversionError).type).toBe('PARSE_ERROR');
      }
    });

    it('should handle front matter without end marker', () => {
      const input = `---
title: test
content without end marker`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toBe(input);
      }
    });
  });

  describe('Tags handling', () => {
    it('should handle single tag as string', () => {
      const input = `---
title: test
tags: javascript
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('tags: [javascript]');
      }
    });

    it('should handle multiple tags as array', () => {
      const input = `---
title: test
tags: [javascript, typescript]
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('tags: [javascript, typescript]');
      }
    });

    it('should handle comma-separated tags string', () => {
      const input = `---
title: test
tags: javascript, typescript
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('tags: [javascript, typescript]');
      }
    });

    it('should handle missing tags field', () => {
      const input = `---
title: test
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).not.toContain('tags:');
      }
    });

    it('should handle empty tags', () => {
      const input = `---
title: test
tags:
---`;
      const result = convertFrontMatter(input);
      expect(result._tag).toBe('Right');
      if (result._tag === 'Right') {
        expect(result.value).toContain('tags: null');
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
