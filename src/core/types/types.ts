// Front Matter Types
export type FrontMatter = Record<string, string>;

export interface ConversionResult {
  frontMatter: FrontMatter;
  body: string;
}

export interface ConversionError {
  type:
    | 'PARSE_ERROR'
    | 'VALIDATION_ERROR'
    | 'PROCESS_ERROR'
    | 'READ_ERROR'
    | 'WRITE_ERROR'
    | 'MOVE_ERROR';
  message: string;
}

// Either Type and Utilities
export interface Left<E> {
  readonly _tag: 'Left';
  readonly value: E;
}

export interface Right<A> {
  readonly _tag: 'Right';
  readonly value: A;
}

export type Either<E, A> = Left<E> | Right<A>;

export const left = <E, A>(e: E): Either<E, A> => ({
  _tag: 'Left',
  value: e,
});

export const right = <E, A>(a: A): Either<E, A> => ({
  _tag: 'Right',
  value: a,
});

export const isLeft = <E, A>(ma: Either<E, A>): ma is Left<E> =>
  ma._tag === 'Left';

export const isRight = <E, A>(ma: Either<E, A>): ma is Right<A> =>
  ma._tag === 'Right';

export const fold =
  <E, A, B>(onLeft: (e: E) => B, onRight: (a: A) => B) =>
  (ma: Either<E, A>): B =>
    isLeft(ma) ? onLeft(ma.value) : onRight(ma.value);

export const map =
  <E, A, B>(f: (a: A) => B) =>
  (ma: Either<E, A>): Either<E, B> =>
    isLeft(ma) ? ma : right(f(ma.value));

export const chain =
  <E, A, B>(f: (a: A) => Either<E, B>) =>
  (ma: Either<E, A>): Either<E, B> =>
    ma._tag === 'Left' ? ma : f(ma.value);
