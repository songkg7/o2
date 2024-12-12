import {
  convertFrontMatter,
  FrontMatterConverter,
} from '../FrontMatterConverter';

const frontMatterConverter = new FrontMatterConverter(
  '2023-01-01-test-title',
  'assets/img',
  true,
);
const disableImageConverter = new FrontMatterConverter(
  '2023-01-01-test-title',
  'assets/img',
  false,
);
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
`);
  });

  describe('when isEnable option is false', () => {
    const frontMatterConverter = new FrontMatterConverter(
      '2023-01-01-test-title',
      'assets/img',
      false,
    );
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

`);
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

`);
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
`);
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
`);
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
  const updatedConverter = new FrontMatterConverter(
    '2023-01-01-test-title',
    'assets/img',
    true,
    true,
  );
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
`);
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
`);
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
  });

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

describe('convertFrontMatter with author settings', () => {
  it('should add single author to front matter', () => {
    const input = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
---

Content here
`;
    const expected = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
authors: jmarcey
---

Content here
`;
    const result = convertFrontMatter(input, 'jmarcey');
    expect(result).toBe(expected);
  });

  it('should add multiple authors to front matter', () => {
    const input = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
---

Content here
`;
    const expected = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
authors: [jmarcey, slorber]
---

Content here
`;
    const result = convertFrontMatter(input, 'jmarcey, slorber');
    expect(result).toBe(expected);
  });

  it('should replace existing authors in front matter', () => {
    const input = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
authors: oldauthor
---

Content here
`;
    const expected = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
authors: [jmarcey, slorber]
---

Content here
`;
    const result = convertFrontMatter(input, 'jmarcey, slorber');
    expect(result).toBe(expected);
  });

  it('should not add authors if not provided', () => {
    const input = `---
title: "Test Post"
date: 2021-01-01 12:00:00 +0900
---

Content here
`;
    const result = convertFrontMatter(input);
    expect(result).toBe(input);
  });
});
