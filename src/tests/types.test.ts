import {
  Either,
  left,
  right,
  chain,
  isLeft,
  isRight,
} from '../core/types/types';

describe('Either type utilities', () => {
  describe('chain', () => {
    const addOne = (n: number): Either<string, number> => right(n + 1);
    const failOnZero = (n: number): Either<string, number> =>
      n === 0 ? left('Cannot process zero') : right(n);

    it('should return the passed Left value without invoking the function', () => {
      const error = left<string, number>('error');
      const result = chain(addOne)(error);
      expect(isLeft(result)).toBe(true);
      expect(result).toEqual(error);
    });

    it('should apply the function to the Right value', () => {
      const value = right<string, number>(1);
      const result = chain(addOne)(value);
      expect(isRight(result)).toBe(true);
      expect(result).toEqual(right(2));
    });

    it('should handle chaining multiple operations', () => {
      const value = right<string, number>(1);
      const result = chain(addOne)(chain(addOne)(value));
      expect(isRight(result)).toBe(true);
      expect(result).toEqual(right(3));
    });

    it('should handle operations that may fail', () => {
      // Test successful case
      const value = right<string, number>(1);
      const result = chain(failOnZero)(value);
      expect(isRight(result)).toBe(true);
      expect(result).toEqual(right(1));

      // Test failure case
      const zeroValue = right<string, number>(0);
      const failedResult = chain(failOnZero)(zeroValue);
      expect(isLeft(failedResult)).toBe(true);
      expect(failedResult).toEqual(left('Cannot process zero'));
    });
  });
});
