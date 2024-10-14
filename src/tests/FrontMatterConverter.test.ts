import { convertFrontMatter, FrontMatterConverter } from '../FrontMatterConverter';
import { PlatformType } from '../enums/PlatformType';

const frontMatterConverter = new FrontMatterConverter('2023-01-01-test-title', 'assets/img', true);
const disableImageConverter = new FrontMatterConverter('2023-01-01-test-title', 'assets/img', false);
describe('convert front matter', () => {
  const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
categories: [test]
image: test.png
---

# test
`;
  it('should passthroughs', () => {
    const mockContents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
categories: [test]
---

# test
`;
    const result = frontMatterConverter.convert(mockContents);
    expect(result).toEqual(mockContents);
  });

  it('should image path changed', () => {
    const result = frontMatterConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
date: 2021-01-01 12:00:00 +0900
categories: [test]
image: /assets/img/2023-01-01-test-title/test.png
---

# test
`,
    );
  });

  describe('when isEnable option is false', () => {
    const frontMatterConverter = new FrontMatterConverter('2023-01-01-test-title', 'assets/img', false);
    it('should Nothing', () => {
      const result = frontMatterConverter.convert(contents);
      expect(result).toEqual(contents);
    });
  });

});

describe('mermaid front matter', () => {

  it('should create mermaid key value if body contains mermaid block', () => {
    const contents = `---
title: "test"
---

# test

\`\`\`mermaid
graph TD
    A-->B
\`\`\`

`;
    const result = disableImageConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
mermaid: true
---

# test

\`\`\`mermaid
graph TD
    A-->B
\`\`\`

`,
    );
  });

  it('should not create mermaid key value if body does not contain mermaid block', () => {
    const contents = `---
title: "test"
---

# test

`;
    const result = disableImageConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
---

# test

`,
    );
  });

  it('should not create mermaid key value if body contains mermaid block but front matter already has mermaid key', () => {
    const contents = `---
title: "test"
mermaid: true
---

# test

\`\`\`mermaid
graph TD
    A-->B
\`\`\`
`;
    const result = disableImageConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
mermaid: true
---

# test

\`\`\`mermaid
graph TD
    A-->B
\`\`\`
`,
    );
  });
});


describe('if does not exist front matter', () => {
  const contents = `# test
image: test.png
`;
  it('should Nothing', () => {
    const result = frontMatterConverter.convert(contents);
    expect(result).toEqual(contents);
  });
});

describe('Divider and front matter', () => {
  const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
image: test.png
---

# test
---
`;
  it('should be distinct', () => {
    const result = frontMatterConverter.convert(contents);

    expect(result).toEqual(`---
title: "test"
date: 2021-01-01 12:00:00 +0900
image: /assets/img/2023-01-01-test-title/test.png
---

# test
---
`,
    );
  });

  describe('when end of front matter is not exist', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
image: test.png
# test
`;
    it('should Nothing', () => {
      const result = frontMatterConverter.convert(contents);
      expect(result).toEqual(contents);
    });
  });
});

describe('updated front matter', () => {
  const updatedConverter = new FrontMatterConverter('2023-01-01-test-title', 'assets/img', true, true);
  it('should be converted', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
updated: 2022-01-02 12:00:00 +0900
---

# test
`;
    const result = updatedConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
date: 2022-01-02 12:00:00 +0900
---

# test
`,
    );
  });

  it('should be not converted', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
---

# test
`;
    const result = updatedConverter.convert(contents);
    expect(result).toEqual(`---
title: "test"
date: 2021-01-01 12:00:00 +0900
---

# test
`,
    );
  });

});

describe('tags', () => {

  const expected = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
tags: [test1, test2]
---

# test
`;

  it('comma separated tags array should nothing', () => {
    const result = frontMatterConverter.convert(expected);
    expect(result).toEqual(expected);
  });

  it('bullet point', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
tags:
  - test1
  - test2
---

# test
`;
    const result = frontMatterConverter.convert(contents);
    expect(result).toEqual(expected);
  });

  it('comma separated', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
tags: test1, test2
---

# test
`;
    const result = frontMatterConverter.convert(contents);
    expect(result).toEqual(expected);
  });
});

describe('convertFrontMatter', () => {
  it('should passthroughs', () => {
      const mockContents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
categories: [test]
---

# test
`;
      const result = convertFrontMatter(mockContents);
      expect(result).toEqual(mockContents);
    },
  );

  it('should converted tags', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
tags: test1, test2
---

# test
`;
    const result = convertFrontMatter(contents);
    expect(result).toEqual(
      `---
title: "test"
date: 2021-01-01 12:00:00 +0900
tags: [test1, test2]
---

# test
`,
    );
  });

  it('should delete aliases', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
aliases: ""
---

# test
`;
    const result = convertFrontMatter(contents);
    expect(result).toEqual(
      `---
title: "test"
date: 2021-01-01 12:00:00 +0900
---

# test
`,
    );
  });

  it('should delete updated and move to date', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
updated: 2024-01-02 12:00:00 +0900
---

# test
`;
    const result = convertFrontMatter(contents);
    expect(result).toEqual(
      `---
title: "test"
date: 2024-01-02 12:00:00 +0900
---

# test
`,
    );
  });

  it.skip('if published is exist, should not change date, delete updated and published', () => {
    const contents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
updated: 2024-01-02 12:00:00 +0900
published: 2024-01-02 12:00:00 +0900
---

# test
`;
    const result = convertFrontMatter(contents);
    expect(result).toEqual(
      `---
title: "test"
date: 2021-01-02 12:00:00 +0900
---

# test
`,
    );
  });
});

describe('FrontMatterConverter Edge Case Tests', () => {
  const malformedFrontMatterContents = `---
title "test"  // Missing colon
date: 2021-01-01 12:00:00 +0900
categories: [test]
---
# test
`;
  it('should handle malformed front matter', () => {
    const result = convertFrontMatter(malformedFrontMatterContents);
    expect(result).toEqual(malformedFrontMatterContents); // Assuming the function passes through malformed front matter as is
  });

  const incompleteFrontMatterContents = `---
title: "test"
date: 2021-01-01 12:00:00 +0900
# test
`;
  it('should handle interrupted parsing', () => {
    const result = convertFrontMatter(incompleteFrontMatterContents);
    expect(result).toEqual(incompleteFrontMatterContents); // Assuming the function passes through incomplete front matter as is
  });
});

describe('Author/Authors conversion', () => {
  describe('Jekyll', () => {
    it('should add single author for Jekyll', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe', PlatformType.Jekyll);
      const input = `---
title: "Test Post"
---
Content`;
      const expected = `---
title: "Test Post"
author: John Doe
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should add multiple authors for Jekyll', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe, Jane Smith', PlatformType.Jekyll);
      const input = `---
title: "Test Post"
---

Content`;
      const expected = `---
title: "Test Post"
authors: [John Doe, Jane Smith]
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should overwrite existing author for Jekyll', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe', PlatformType.Jekyll);
      const input = `---
title: "Test Post"
author: Existing Author
---
Content`;
      const expected = `---
title: "Test Post"
author: John Doe
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should overwrite existing authors with single author for Jekyll', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe', PlatformType.Jekyll);
      const input = `---
title: "Test Post"
authors: [Existing Author 1, Existing Author 2]
---
Content`;
      const expected = `---
title: "Test Post"
author: John Doe
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });
  });

  describe('Docusaurus', () => {
    it('should add single author for Docusaurus', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe', PlatformType.Docusaurus);
      const input = `---
title: "Test Post"
---

Content`;
      const expected = `---
title: "Test Post"
authors: John Doe
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should add multiple authors for Docusaurus', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe, Jane Smith', PlatformType.Docusaurus);
      const input = `---
title: "Test Post"
---
Content`;
      const expected = `---
title: "Test Post"
authors: [John Doe, Jane Smith]
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should overwrite existing authors for Docusaurus', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe, Jane Smith', PlatformType.Docusaurus);
      const input = `---
title: "Test Post"
authors: Existing Author
---
Content`;
      const expected = `---
title: "Test Post"
authors: [John Doe, Jane Smith]
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });

    it('should overwrite existing single author with multiple authors for Docusaurus', () => {
      const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, 'John Doe, Jane Smith', PlatformType.Docusaurus);
      const input = `---
title: "Test Post"
authors: Existing Author
---
Content`;
      const expected = `---
title: "Test Post"
authors: [John Doe, Jane Smith]
---

Content`;
      expect(converter.convert(input)).toEqual(expected);
    });
  });

  it('should not add authors when not provided', () => {
    const converter = new FrontMatterConverter('test-file', 'assets/img', false, false, '', PlatformType.Docusaurus);
    const input = `---
title: "Test Post"
---
Content`;
    const expected = `---
title: "Test Post"
---

Content`;
    expect(converter.convert(input)).toEqual(expected);
  });
});
