import {
  pipe,
  compose,
  curry,
  map,
  filter,
  reduce,
  identity,
  constant,
} from '../core/fp';

describe('Functional Programming Utilities', () => {
  describe('pipe', () => {
    it('should pipe a single value through multiple functions', () => {
      const add2 = (x: number) => x + 2;
      const multiply3 = (x: number) => x * 3;
      const toString = (x: number) => x.toString();

      const result = pipe(5, add2, multiply3, toString);
      expect(result).toBe('21');
    });

    it('should handle a single function', () => {
      const add2 = (x: number) => x + 2;
      const result = pipe(5, add2);
      expect(result).toBe(7);
    });

    it('should handle no functions', () => {
      const result = pipe(5);
      expect(result).toBe(5);
    });
  });

  describe('compose', () => {
    it('should compose multiple functions from right to left', () => {
      const add2 = (x: number) => x + 2;
      const multiply3 = (x: number) => x * 3;
      const composed = compose(add2, multiply3);
      expect(composed(5)).toBe(17); // (5 * 3) + 2
    });

    it('should handle a single function', () => {
      const add2 = (x: number) => x + 2;
      const composed = compose(add2);
      expect(composed(5)).toBe(7);
    });
  });

  describe('curry', () => {
    it('should curry a function with multiple arguments', () => {
      const add = (a: number, b: number, c: number) => a + b + c;
      const curriedAdd = curry(add);
      expect(curriedAdd(1)(2)(3)).toBe(6);
    });

    it('should handle partial application', () => {
      const add = (a: number, b: number) => a + b;
      const curriedAdd = curry(add);
      const add5 = curriedAdd(5);
      expect(add5(3)).toBe(8);
    });

    it('should handle single argument functions', () => {
      const double = (x: number) => x * 2;
      const curriedDouble = curry(double);
      expect(curriedDouble(5)).toBe(10);
    });
  });

  describe('map', () => {
    it('should map a function over an array', () => {
      const double = (x: number) => x * 2;
      const numbers = [1, 2, 3, 4];
      const result = map(double)(numbers);
      expect(result).toEqual([2, 4, 6, 8]);
    });

    it('should handle empty arrays', () => {
      const double = (x: number) => x * 2;
      const result = map(double)([]);
      expect(result).toEqual([]);
    });
  });

  describe('filter', () => {
    it('should filter array elements based on predicate', () => {
      const isEven = (x: number) => x % 2 === 0;
      const numbers = [1, 2, 3, 4, 5, 6];
      const result = filter(isEven)(numbers);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle empty arrays', () => {
      const isEven = (x: number) => x % 2 === 0;
      const result = filter(isEven)([]);
      expect(result).toEqual([]);
    });
  });

  describe('reduce', () => {
    it('should reduce array using accumulator function', () => {
      const sum = (acc: number, x: number) => acc + x;
      const numbers = [1, 2, 3, 4];
      const result = reduce(sum, 0)(numbers);
      expect(result).toBe(10);
    });

    it('should handle empty arrays', () => {
      const sum = (acc: number, x: number) => acc + x;
      const result = reduce(sum, 0)([]);
      expect(result).toBe(0);
    });
  });

  describe('identity', () => {
    it('should return the input value unchanged', () => {
      expect(identity(5)).toBe(5);
      expect(identity('test')).toBe('test');
      expect(identity(null)).toBe(null);
      const obj = { a: 1 };
      expect(identity(obj)).toBe(obj);
    });
  });

  describe('constant', () => {
    it('should create a function that always returns the same value', () => {
      const always5 = constant(5);
      expect(always5()).toBe(5);
      expect(always5()).toBe(5);
      
      const alwaysNull = constant(null);
      expect(alwaysNull()).toBe(null);
      
      const obj = { a: 1 };
      const alwaysObj = constant(obj);
      expect(alwaysObj()).toBe(obj);
    });
  });
});
