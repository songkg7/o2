export type Contents = string;

export interface Converter {
  convert(input: Contents): Contents;
}
