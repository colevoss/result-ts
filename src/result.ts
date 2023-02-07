import * as Option from './option';

export enum ResultType {
  Ok = 'OK',
  Err = 'ERR',
}

export interface IResult<T, E> {
  type: ResultType;
  isOk(): this is Ok<T>;
  isErr(): this is Err<T, E>;

  isOkAnd(cb: (v: T) => boolean): boolean;

  isErrAnd(cb: (v: E) => boolean): boolean;

  unwrap(): T;

  unwrapOr(orValue: T): T;

  match<A, B>(okCb: (value: T) => A, errCb: (e: Err<T, E>) => B): A | B;

  expect(reason: string): T;

  map<U>(cb: (value: T) => U): Ok<U> | Err<T, E>;

  mapOr<U>(cb: (v: T) => U, orValue: U): U;

  mapOrElse<U>(okCb: (v: T) => U, errCb: (e: Err<T, E>) => U): U;

  inspect(cb: (v: T) => void): this;
  inspectErr(cb: (e: E) => void): this;

  ok(): Option.Option<T>;
  err(): Option.Option<E>;

  // and<U, F>(andValue: Result<U, F>): Ok<T, E>;
  // and<U, F>(andValue: Result<U, F>): Err<T, E>;
  // and<U, F>(andValue: Result<U, F>): Ok<U, E>;
  // and<U, F>(andValue: Result<U, F>): Err<T, E>;
  // and<U, F>(andValue: Result<U, F>): Err<U, F>;
  and<U>(andValue: Result<U, E>): Result<U, E>;

  or<U, F>(orValue: Result<U, F>): Ok<T, E>;
  or<U, F>(orValue: Result<U, F>): Ok<U, F>;
  or<U, F>(orValue: Result<U, F>): Err<U, F>;
}

export type Result<T, E> = Ok<T> | Err<T, E>;

export type LazyResult<T> = IResult<T, unknown>;
export type PromiseRes<T, E> = Promise<IResult<T, E>>;

export class Err<T, E> extends Error implements IResult<T, E> {
  public type = ResultType.Err;
  public error: E;
  public value?: T;

  constructor(err: E);
  constructor(err: E, value: T);
  constructor(err: E, value?: T) {
    const message = typeof err === 'string' ? err : 'Result Error';
    super(message);

    this.error = err;
    this.value = value;

    this.name = 'ResultError';
  }

  public isOk(): this is Ok<T, never> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }

  public isOkAnd(_cb: (v: T) => boolean): boolean {
    return false;
  }

  public isErrAnd(cb: (v: E) => boolean): boolean {
    return cb(this.error);
  }

  public unwrap(): never {
    throw this;
  }

  public unwrapOr(orValue: T): T {
    return orValue;
  }

  public match<A, B>(_okCb: (value: T) => A, errCb: (e: Err<T, E>) => B): B {
    return errCb(this);
  }

  public expect(reason: string): T {
    // TODO: Use ResultError
    throw new Error(reason, { cause: this });
  }

  public map<U>(_cb: (value: T) => U): Err<T, E> | Ok<U> {
    return this;
  }

  public mapOr<U>(_cb: (v: T) => U, orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(_okCb: (v: T) => U, errCb: (e: Err<T, E>) => U): U {
    return errCb(this);
  }

  public inspect(_cb: (v: T) => void): this {
    return this;
  }

  public inspectErr(cb: (e: E) => void): this {
    cb(this.error);

    return this;
  }

  public ok(): Option.Option<T> {
    return Option.none();
  }

  public err(): Option.Option<E> {
    return Option.some(this.error);
  }

  public and<U, F>(andValue: Result<U, F>): Err<T, E>;
  public and<U, F>(andValue: Result<U, F>): Err<U, F>;
  public and(_andValue: unknown): Err<T, E> {
    return this;
  }

  public or<U, F>(orValue: Result<U, F>): Ok<T, E>;
  public or<U, F>(orValue: Result<U, F>): Ok<U, F>;
  public or<U, F>(orValue: Result<U, F>): Err<U, F>;
  public or<U, F>(orValue: Result<U, F>): Ok<T, E> | Ok<U, F> | Err<U, F> {
    return orValue;
  }
}

export class Ok<T, E = never> implements IResult<T, E> {
  public type = ResultType.Ok;
  private value: T;

  constructor(value: T = null) {
    this.value = value;
  }

  public isOk(): this is Ok<T, never> {
    return true;
  }

  public isErr(): this is Err<T, E> {
    return false;
  }

  public isOkAnd(cb: (v: T) => boolean): boolean {
    return cb(this.value);
  }

  public isErrAnd(_cb: (v: E) => boolean): boolean {
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
    _errCb: (e: Err<T, E>) => B,
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

  public mapOrElse<U>(okCb: (v: T) => U, _errCb: (e: Err<T, E>) => U): U {
    return okCb(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);
    return this;
  }

  public inspectErr(_cb: (e: E) => void): this {
    return this;
  }

  public ok(): Option.Option<T> {
    return Option.some(this.value);
  }

  public err(): Option.Option<E> {
    return Option.none();
  }

  public and<U, F>(andValue: Result<U, F>): Ok<U>;
  // public and<U, F>(andValue: Result<U, F>): Err<T, E>;
  public and<U, F>(andValue: Result<U, F>): Err<U, F>;
  public and<U, F>(andValue: Result<U, F>): Ok<U> | Err<U, F> {
    return andValue;
  }

  public or<U, F>(orValue: Result<U, F>): Ok<T, E>;
  public or<U, F>(orValue: Result<U, F>): Ok<U, F>;
  public or<U, F>(orValue: Result<U, F>): Err<U, F>;
  public or<U, F>(_orValue: Result<U, F>): Ok<T, E> | Ok<U, F> | Err<U, F> {
    return this;
  }
}

export function ok<T>(v: T = null): Ok<T> {
  return new Ok(v);
}

export function err<T, E>(err: E): Err<T, E>;
export function err<T, E>(err: E, v: T): Err<T, E>;
export function err<T, E>(err: E, v?: T): Err<T, E> {
  return new Err(err, v);
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
