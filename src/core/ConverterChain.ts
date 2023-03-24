import { Contents, Converter } from './Converter';

export class ConverterChain {
  private converters: Converter[] = [];

  private constructor() {
  }

  public static create(): ConverterChain {
    return new ConverterChain();
  }

  public chaining(converter: Converter): ConverterChain {
    this.converters.push(converter);
    return this;
  }

  public converting(input: Contents): Contents {
    let result = input;
    for (const converter of this.converters) {
      result = converter.convert(result);
    }
    return result;
  }
}
