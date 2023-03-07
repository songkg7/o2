import { FrontMatterConverter } from "../jekyll/FrontMatterConverter";

const frontMatterConverter = new FrontMatterConverter("2023-01-01-test-title", "assets/img");

describe("convert front matter", () => {
    const contents = `---
title: "test"
date: 2021-01-01
tags: [test]
categories: [test]
image: test.png
---

# test
`;
    it('should passthroughs', () => {
        const mockContents = `---
title: "test"
date: 2021-01-01
tags: [test]
categories: [test]
---

# test
`;
        const result = frontMatterConverter.convert(mockContents);
        expect(result).toBe(mockContents);
    });

    it('should image path changed', () => {
        const result = frontMatterConverter.convert(contents);
        expect(result).toBe(`---
title: "test"
date: 2021-01-01
tags: [test]
categories: [test]
image: /assets/img/2023-01-01-test-title/test.png
---

# test
`
        );
    });

});

describe("if does not exist front matter", () => {
    const contents = `# test
image: test.png
`;
    it('should Nothing', () => {
        const result = frontMatterConverter.convert(contents);
        expect(result).toBe(contents);
    });
});

describe("Divider and front matter", () => {
    const contents = `---
title: "test"
date: 2021-01-01
image: test.png
---

# test
---
`;
    it('should be distinct', () => {
        const result = frontMatterConverter.convert(contents);

        expect(result).toBe(`---
title: "test"
date: 2021-01-01
image: /assets/img/2023-01-01-test-title/test.png
---

# test
---
`
        );
    });

    describe('when end of front matter is not exist', () => {
        const contents = `---
title: "test"
date: 2021-01-01
image: test.png
# test
`;
        it('should Nothing', () => {
            const result = frontMatterConverter.convert(contents);
            expect(result).toBe(contents);
        });
    });
});

describe('obsidian image link', () => {
    const contents = `---
title: "test"
date: 2021-01-01
image: ![[test.png]]
---

# test
`;
    it('should be converted', () => {
        const result = frontMatterConverter.convert(contents);
        expect(result).toBe(`---
title: "test"
date: 2021-01-01
image: /assets/img/2023-01-01-test-title/test.png
---

# test
`
        );
    });

});
