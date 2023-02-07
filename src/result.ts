import * as Option from './option';

export enum ResultType {
  Ok = 'OK',
  Err = 'ERR',
}

export interface Result<T, E> {
  type: ResultType;
  isOk(): this is Ok<T>;
  isErr(): this is Err<E>;

  isOkAnd(cb: (v: T) => boolean): boolean;

  isErrAnd(cb: (v: E) => boolean): boolean;

  unwrap(): T;

  unwrapOr(orValue: T): T;

  match<A, B>(okCb: (value: T) => A, errCb: (e: Err<E>) => B): A | B;

  expect(reason: string): T;

  map<U>(cb: (value: T) => U): Result<U, E>;
  mapOr<U>(cb: (v: T) => U, orValue: U): U;

  mapOrElse<U>(okCb: (v: T) => U, errCb: (e: Err<E>) => U): U;

  inspect(cb: (v: T) => void): this;
  inspectErr(cb: (e: E) => void): this;

  ok(): Option.Option<T>;
  err(): Option.Option<E>;

  and<U>(andValue: Result<U, E>): Result<U, E>;
  andThen<U>(cb: (v: T) => Result<U, E>): Result<U, E>;

  or<F>(orValue: Result<T, F>): Result<T, F>;
  orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F>;
}

export type LazyResult<T> = Result<T, unknown>;
export type PromiseRes<T, E> = Promise<Result<T, E>>;

export class Err<E> extends Error implements Result<never, E> {
  public type = ResultType.Err;
  public error: E;

  constructor(err: E) {
    const message = typeof err === 'string' ? err : 'Result Error';
    super(message);

    this.error = err;
    this.name = 'ResultError';
  }

  public isOk(): this is Ok<never> {
    return false;
  }

  public isErr(): this is Err<E> {
    return true;
  }

  public isOkAnd(_cb: (v: never) => boolean): boolean {
    return false;
  }

  public isErrAnd(cb: (v: E) => boolean): boolean {
    return cb(this.error);
  }

  public unwrap(): never {
    throw this;
  }

  public unwrapOr<T>(orValue: T): T {
    return orValue;
  }

  public match<A, B>(_okCb: (value: never) => A, errCb: (e: Err<E>) => B): B {
    return errCb(this);
  }

  public expect(reason: string): never {
    // TODO: Use ResultError
    throw new Error(reason, { cause: this });
  }

  public map<U>(_cb: (value: never) => U): Err<E> | Ok<U> {
    return this;
  }

  public mapOr<U>(_cb: (v: never) => U, orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(_okCb: (v: never) => U, errCb: (e: Err<E>) => U): U {
    return errCb(this);
  }

  public inspect(_cb: (v: never) => void): this {
    return this;
  }

  public inspectErr(cb: (e: E) => void): this {
    cb(this.error);

    return this;
  }

  public ok<T>(): Option.Option<T> {
    return Option.none();
  }

  public err(): Option.Option<E> {
    return Option.some(this.error);
  }

  public and<U>(_andValue: Result<U, E>): Result<U, E> {
    return this;
  }

  public andThen<U>(_cb: (v: never) => Result<U, E>): Err<E> {
    return this;
  }

  // public or<T>(orValue: Ok<T>): Ok<T>;
  // public or<F>(orValue: Err<F>): Err<F>;
  public or<T, F>(orValue: Result<T, F>): Result<T, F> {
    return orValue;
  }

  public orElse<T, F>(cb: (e: E) => Result<T, F>): Result<T, F> {
    return cb(this.error);
  }
}

export class Ok<T> implements Result<T, never> {
  public type = ResultType.Ok;
  private value: T;

  constructor(value: T = null) {
    this.value = value;
  }

  public isOk(): this is Ok<T> {
    return true;
  }

  public isErr(): this is Err<never> {
    return false;
  }

  public isOkAnd(cb: (v: T) => boolean): boolean {
    return cb(this.value);
  }

  public isErrAnd(_cb: (v: never) => boolean): boolean {
    return false;
  }

  public unwrap(): T {
    return this.value;
  }

  public unwrapOr(_orValue: T): T {
    return this.value;
  }

  public match<A, B>(
    okCb: (value: T) => A,
    _errCb: (e: Err<never>) => B,
  ): A | B {
    return okCb(this.value);
  }

  public expect(_reason: string): T {
    return this.value;
  }

  public map<U>(cb: (value: T) => U): Ok<U> {
    return new Ok(cb(this.value));
  }

  public mapOr<U>(cb: (v: T) => U, _orValue: U): U {
    return cb(this.value);
  }

  public mapOrElse<U>(okCb: (v: T) => U, _errCb: (e: Err<never>) => U): U {
    return okCb(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);
    return this;
  }

  public inspectErr(_cb: (e: never) => void): this {
    return this;
  }

  public ok(): Option.Option<T> {
    return Option.some(this.value);
  }

  public err(): Option.Option<never> {
    return Option.none();
  }

  public and<U>(andValue: Ok<U>): Ok<U>;
  public and<E>(andValue: Err<E>): Err<E>;
  public and<U, E>(andValue: Result<U, E>): Result<U, E> {
    return andValue;
  }

  public andThen<U>(cb: (v: T) => Result<U, never>): Result<U, never> {
    return cb(this.value);
  }

  public or<F>(_orValue: Result<T, F>): Result<T, F> {
    return this;
  }

  public orElse<F>(_cb: (e: never) => Result<T, F>): Result<T, F> {
    return this;
  }
}

export function ok<T>(v: T = null): Ok<T> {
  return new Ok(v);
}

export function err<E>(err: E): Err<E> {
  return new Err(err);
}

export function wrap<F extends (...args: any[]) => any>(fn: F) {
  return (...args: Parameters<typeof fn>): Result<ReturnType<F>, unknown> => {
    try {
      const value = fn(...args);
      return ok(value);
    } catch (e) {
      return err(e.message);
    }
  };
}

export function wrapAsync<F extends (...args: any[]) => Promise<any>>(
  fn: F,
): (
  ...args: Parameters<typeof fn>
) => Promise<Result<Awaited<ReturnType<F>>, unknown>> {
  return async (
    ...args: Parameters<typeof fn>
  ): Promise<Result<Awaited<ReturnType<F>>, unknown>> => {
    try {
      const value = await fn(...args);
      return ok(value);
    } catch (e) {
      return err(e.message);
    }
  };
}
