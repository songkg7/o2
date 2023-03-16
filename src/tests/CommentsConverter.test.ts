import { CommentsConverter } from "../jekyll/CommentsConverter";

const converter = new CommentsConverter();

describe("CommentConverter", () => {
    it("should convert a comment", () => {
        const input = "%%This is a comment%%";
        const expected = "<!--This is a comment-->";
        const actual = converter.convert(input);
        expect(actual).toEqual(expected);
    });
});
