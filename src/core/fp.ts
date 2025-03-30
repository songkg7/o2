/**
 * Functional programming utilities
 */

/**
 * Pipe function that takes a value and a series of functions,
 * applying each function to the result of the previous function
 */
export function pipe<A>(a: A): A;
export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe<A, B, C, D>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): D;
export function pipe<A, B, C, D, E>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  a: A,
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): F;
export function pipe(
  a: unknown,
  ...fns: Array<(a: unknown) => unknown>
): unknown {
  return fns.reduce((acc, fn) => fn(acc), a);
}

/**
 * Function composition from right to left
 */
export const compose = <A>(...fns: Array<(a: A) => A>): ((a: A) => A) =>
  fns.reduce((f, g) => x => f(g(x)));

/**
 * Creates a curried version of a function
 */
export function curry<A, B, C, R>(
  fn: (a: A, b: B, c: C) => R,
): (a: A) => (b: B) => (c: C) => R;
export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
export function curry<A, R>(fn: (a: A) => R): (a: A) => R;
export function curry(fn: (...args: unknown[]) => unknown) {
  return function curried(...args: unknown[]) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...moreArgs: unknown[]) => curried(...args, ...moreArgs);
  };
}

/**
 * Maps a function over an array
 */
export const map =
  <A, B>(fn: (a: A) => B) =>
  (fa: Array<A>): Array<B> =>
    fa.map(fn);

/**
 * Filters an array based on a predicate
 */
export const filter =
  <A>(predicate: (a: A) => boolean) =>
  (fa: Array<A>): Array<A> =>
    fa.filter(predicate);

/**
 * Reduces an array using an accumulator function and initial value
 */
export const reduce =
  <A, B>(fn: (b: B, a: A) => B, initial: B) =>
  (fa: Array<A>): B =>
    fa.reduce(fn, initial);

/**
 * Identity function
 */
export const identity = <A>(a: A): A => a;

/**
 * Creates a constant function that always returns the same value
 */
export const constant =
  <A>(a: A) =>
  () =>
    a;
