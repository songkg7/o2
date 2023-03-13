import { Contents, Converter } from "../core/Converter";
import { ConverterChain } from "../core/ConverterChain";

class TestRepeatConverter implements Converter {
    convert(input: Contents): Contents {
        return input + input;
    }
}

class TestUpperConverter implements Converter {
    convert(input: Contents): Contents {
        return input.toUpperCase();
    }
}

describe('ConverterChain', () => {
    it('should created', () => {
        const chain = ConverterChain.create();
        expect(chain).toBeDefined();
    });

    it('should chaining', () => {
        const chain = ConverterChain.create();
        expect(chain.chaining(new TestRepeatConverter())).toBeDefined();
    });

    it('should converting', () => {
        const chain = ConverterChain.create().chaining(new TestRepeatConverter());
        expect(chain.converting("test")).toEqual("testtest");
    });

    it('should chaining multiple converters', () => {
        const chain = ConverterChain.create()
            .chaining(new TestRepeatConverter())
            .chaining(new TestUpperConverter());
        expect(chain.converting("test")).toEqual("TESTTEST");
    });

    it('should chaining multiple converters in reverse order', () => {
        const chain = ConverterChain.create()
            .chaining(new TestUpperConverter())
            .chaining(new TestRepeatConverter());
        expect(chain.converting("test")).toEqual("TESTTEST");
    });

});
