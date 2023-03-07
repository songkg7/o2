import { convertFrontMatter } from "../jekyll/convertFrontMatter";

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
        const result = convertFrontMatter("2023-01-01-test-title", mockContents, "assets/img");
        expect(result).toBe(mockContents);
    });

    it('should image path changed', () => {
        const result = convertFrontMatter("2023-01-01-test-title", contents, "assets/img");
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
        const result = convertFrontMatter("2023-01-01-test-title", contents, "assets/img");
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
        const result = convertFrontMatter("2023-01-01-test-title", contents, "assets/img");

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
            const result = convertFrontMatter("2023-01-01-test-title", contents, "assets/img");
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
        const result = convertFrontMatter("2023-01-01-test-title", contents, "assets/img");
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
