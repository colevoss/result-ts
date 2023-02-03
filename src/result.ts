import { Option } from './option';

export interface ResultOption<T> {
  unwrap(): T;
  unwrapOr(orValue: T): T;
  expect(reason: string): T;
}

export enum ResultType {
  Ok,
  Err,
}

export abstract class Result<T, E> {
  public _type: ResultType;
  protected _ok: boolean;

  static Ok = ResultType.Ok;
  static Err = ResultType.Err;

  constructor(ok: boolean) {
    this._ok = ok;
    this._type = ok ? ResultType.Ok : ResultType.Err;
  }

  public get type(): ResultType {
    return this._type;
  }

  public isOk(): this is Ok<T> {
    return this._ok;
  }

  public isErr(): this is Err<T, E> {
    return !this._ok;
  }

  public abstract isOkAnd(cb: (v: T) => boolean): boolean;

  public abstract isErrAnd(cb: (v: E) => boolean): boolean;

  public abstract unwrap(): T;

  public abstract unwrapOr(orValue: T): T;

  public abstract match<A, B>(
    okCb: (value: T) => A,
    errCb: (e: Err<T, E>) => B,
  ): A | B;

  public abstract expect(reason: string): T;

  public abstract map<U>(cb: (value: T) => U): Ok<U> | Err<T, E>;

  // Update this with cb as first argument
  public abstract mapOr<U>(orValue: U, cb: (v: T) => U): U;

  public abstract mapOrElse<U>(
    okCb: (v: T) => U,
    errCb: (e: Err<T, E>) => U,
  ): U;

  public abstract ok(): Option<T>;
  public abstract err(): Option<E>;

  public abstract inspect(cb: (v: T) => void): this;

  public abstract inspectErr(cb: (e: E) => void): this;

  public static ok<T>(value: T = null): Ok<T> {
    return new Ok(value);
  }

  public static err<T, E>(err: E): Err<T, E>;
  public static err<T, E>(err: E, value: T): Err<T, E>;
  public static err<T, E>(err: E, value?: T): Err<T, E> {
    return new Err(err, value);
  }

  public static wrap<T>(fn: (...args: unknown[]) => T) {
    return (...args: unknown[]) => {
      try {
        const value = fn(...args);
        return Result.ok(value);
      } catch (e) {
        return Result.err(e.message);
      }
    };
  }

  public static wrapAsync<T>(fn: (...args: unknown[]) => T) {
    return async (...args: unknown[]) => {
      try {
        const value = await fn(...args);
        return Result.ok(value);
      } catch (e) {
        return Result.err(e);
      }
    };
  }
}

export class Ok<T, E = undefined> extends Result<T, E> {
  public value: T;

  constructor(value: T = null) {
    super(true);
    this.value = value;
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

  public mapOr<U>(_orValue: U, cb: (v: T) => U): U {
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

  public ok(): Option<T> {
    return Option.some(this.value);
  }

  public err(): Option<E> {
    return Option.none();
  }
}

export class Err<T, E> extends Result<T, E> {
  public error: E;
  public value?: T;

  constructor(err: E);
  constructor(err: E, value: T);
  constructor(err: E, value?: T) {
    super(false);
    this.error = err;
    this.value = value;
  }

  public isOkAnd(_cb: (v: T) => boolean): boolean {
    return false;
  }

  public isErrAnd(cb: (v: E) => boolean): boolean {
    return cb(this.error);
  }

  public unwrap(): T {
    const message =
      typeof this.error === 'string' ? this.error : 'Unwrapping Error Result';

    // TODO: Fix ResultError
    // throw new ResultError(message, this);
    throw new Error(message);
  }

  public unwrapOr(orValue: T): T {
    return orValue;
  }

  public match<A, B>(_okCb: (value: T) => A, errCb: (e: Err<T, E>) => B): B {
    return errCb(this);
  }

  public expect(reason: string): T {
    // TODO: Use ResultError
    throw new Error(reason);
  }

  public map<U>(_cb: (value: T) => U): Err<T, E> | Ok<U> {
    return this;
  }

  public mapOr<U>(orValue: U, _cb: (v: T) => U): U {
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

  public ok(): Option<T> {
    return Option.none();
  }

  public err(): Option<E> {
    return Option.some(this.error);
  }
}

export function ok<T>(v: T = null): Ok<T> {
  return Result.ok(v);
}

export function err<T, E>(err: E): Err<T, E>;
export function err<T, E>(err: E, v: T): Err<T, E>;
export function err<T, E>(err: E, v?: T): Err<T, E> {
  return Result.err(err, v);
}

export type LazyResult<T> = Result<T, unknown>;
export type PromiseRes<T, E> = Promise<Result<T, E>>;
