import { convertCalloutSyntaxToJekyll, extractImageName, removeSquareBrackets } from "../jekyll"

jest.mock('obsidian', () => ({}), { virtual: true })

describe("jekyll", () => {
    test('1 + 1 = 2', () => {
        expect(1 + 1).toBe(2)
    })

    it.todo("should read a file in ready directory only")

    it.todo("![NOTE] title & contents should be converted to content {: .prompt-info}")
})

describe("remove square brackets", () => {

    it('should replace match string to blank', () => {
        let content = '[[tests]]'
        const result = removeSquareBrackets(content)
        expect(result).toBe('tests')
    })

    it('should not match if string starts with !', () => {
        let content = '![[tests]]'
        const result = removeSquareBrackets(content)
        expect(result).toBe('![[tests]]')
    })

    it('long context', () => {
        let content = `# test
        ![NOTE] test
        [[test]]
        
        ![[test]]
        `
        const result = removeSquareBrackets(content)
        expect(result).toBe(`# test
        ![NOTE] test
        test
        
        ![[test]]
        `)
    })
})

describe("extract image name", () => {

    it('should return image name array', () => {
        const context = `![[test.png]]
        
        test
        ![[image.png]]
        `
        const result = extractImageName(context)
        expect(result).toEqual(['test.png', 'image.png'])
    })

})

describe("convert callout syntax", () => {

    it('note => info', () => {
        const context = `> [!NOTE] note title\n> note content`

        const result = convertCalloutSyntaxToJekyll(context)
        expect(result).toBe(`> note content\n{: .prompt-info}`)
    })

    it('tip => tip', () => {
        const context = `> [!TIP] tip title\n> tip content`

        const result = convertCalloutSyntaxToJekyll(context)
        expect(result).toBe(`> tip content\n{: .prompt-tip}`)
    })

    it('warning => warning', () => {
        const context = `> [!WARNING] warning title\n> warning content`

        const result = convertCalloutSyntaxToJekyll(context)
        expect(result).toBe(`> warning content\n{: .prompt-warning}`)
    })

    it('error => danger', () => {
        const context = `> [!ERROR] error title\n> error content`

        const result = convertCalloutSyntaxToJekyll(context)
        expect(result).toBe(`> error content\n{: .prompt-danger}`)
    })

    it('danger => danger', () => {
        const context = `> [!DANGER] danger title\n> danger content`

        const result = convertCalloutSyntaxToJekyll(context)
        expect(result).toBe(`> danger content\n{: .prompt-danger}`)
    })

})
