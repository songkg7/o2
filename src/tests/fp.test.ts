import {
  pipe,
  compose,
  map,
  filter,
  reduce,
  identity,
  constant,
} from '../core/fp';

describe('Functional Programming Utilities', () => {
  describe('compose', () => {
    it('should compose functions from right to left', () => {
      const addOne = (x: number) => x + 1;
      const double = (x: number) => x * 2;
      const composed = compose(addOne, double);

      // (5 * 2) + 1 = 11
      expect(composed(5)).toBe(11);
    });

    it('should handle single function', () => {
      const addOne = (x: number) => x + 1;
      const composed = compose(addOne);
      expect(composed(5)).toBe(6);
    });
  });

  describe('map', () => {
    it('should transform array elements', () => {
      const double = (x: number) => x * 2;
      const numbers = [1, 2, 3];
      const result = map(double)(numbers);
      expect(result).toEqual([2, 4, 6]);
    });

    it('should handle empty array', () => {
      const double = (x: number) => x * 2;
      const result = map(double)([]);
      expect(result).toEqual([]);
    });
  });

  describe('filter', () => {
    it('should filter array elements', () => {
      const isEven = (x: number) => x % 2 === 0;
      const numbers = [1, 2, 3, 4];
      const result = filter(isEven)(numbers);
      expect(result).toEqual([2, 4]);
    });

    it('should handle empty array', () => {
      const isEven = (x: number) => x % 2 === 0;
      const result = filter(isEven)([]);
      expect(result).toEqual([]);
    });

    it('should handle array with no matches', () => {
      const isEven = (x: number) => x % 2 === 0;
      const result = filter(isEven)([1, 3, 5]);
      expect(result).toEqual([]);
    });
  });

  describe('reduce', () => {
    it('should reduce array to single value', () => {
      const sum = (acc: number, x: number) => acc + x;
      const numbers = [1, 2, 3, 4];
      const result = reduce(sum, 0)(numbers);
      expect(result).toBe(10);
    });

    it('should handle empty array', () => {
      const sum = (acc: number, x: number) => acc + x;
      const result = reduce(sum, 0)([]);
      expect(result).toBe(0);
    });

    it('should handle array with single element', () => {
      const sum = (acc: number, x: number) => acc + x;
      const result = reduce(sum, 0)([5]);
      expect(result).toBe(5);
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
    it('should return a function that always returns the same value', () => {
      const always5 = constant(5);
      expect(always5()).toBe(5);
      expect((always5 as unknown as (x: unknown) => number)('anything')).toBe(5);
      expect((always5 as unknown as (x: unknown) => number)(123)).toBe(5);
    });
  });
});
