import { ResultError } from './error';
import { Err, Ok, Result } from './result';

export interface ResultOption<T> {
  unwrap(): T;
  unwrapOr(orValue: T): T;
  expect(reason: string): T;
}

export enum ResultType {
  Ok,
  Err,
}

export abstract class IResult<T, E> {
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

  public isOk(): this is Ok<T, E> {
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
    errCb: (e: IErr<T, E>) => B,
  ): A | B;

  public abstract expect(reason: string): T;

  public abstract map<U>(cb: (value: T) => U): IOk<U> | IErr<T, E>;

  // Update this with cb as first argument
  public abstract mapOr<U>(orValue: U, cb: (v: T) => U): U;

  public abstract mapOrElse<U>(
    okCb: (v: T) => U,
    errCb: (e: IErr<T, E>) => U,
  ): U;

  // public abstract ok(): IOption<U>;
  // public abstract err(): IOption<E>;

  public abstract inspect(cb: (v: T) => void): this;

  public abstract inspectErr(cb: (e: E) => void): this;

  public static ok<T>(value: T = null): IOk<T> {
    return new IOk(value);
  }

  public static err<T, E>(err: E): IErr<T, E>;
  public static err<T, E>(err: E, value: T): IErr<T, E>;
  public static err<T, E>(err: E, value?: T): IErr<T, E> {
    return new IErr(err, value);
  }

  public static wrap<T>(fn: (...args: unknown[]) => T) {
    return (...args: unknown[]) => {
      try {
        const value = fn(...args);
        return IResult.ok(value);
      } catch (e) {
        return Result.err(e.message);
      }
    };
  }

  public static wrapAync<T>(fn: (...args: unknown[]) => T) {
    return async (...args: unknown[]) => {
      try {
        const value = await fn(...args);
        return IResult.ok(value);
      } catch (e) {
        return IResult.err(e);
      }
    };
  }
}

export class IErr<T, E> extends IResult<T, E> {
  public error: E;
  public value?: T;

  constructor(err: E);
  constructor(err: E, value: T);
  constructor(err: E, value?: T) {
    super(false);
    this.error = err;
    this.value = value;
  }

  public isOkAnd(): boolean {
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

  public match<A, B>(_okCb: (value: T) => A, errCb: (e: IErr<T, E>) => B): B {
    return errCb(this);
  }

  public expect(reason: string): T {
    // TODO: Use ResultError
    throw new Error(reason);
  }

  public map(): IErr<T, E> {
    return this;
  }

  public mapOr<U>(orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(_okCb: (v: T) => U, errCb: (e: IErr<T, E>) => U): U {
    return errCb(this);
  }

  public inspect(): this {
    return this;
  }

  public inspectErr(cb: (e: E) => void): this {
    cb(this.error);

    return this;
  }
}

export class IOk<T> extends IResult<T, undefined> {
  public value: T;

  constructor(value: T = null) {
    super(true);
    this.value = value;
  }

  public isOkAnd(cb: (v: T) => boolean): boolean {
    return cb(this.value);
  }

  public isErrAnd(): boolean {
    return false;
  }

  public unwrap(): T {
    return this.value;
  }

  public unwrapOr(): T {
    return this.value;
  }

  public match<A>(okCb: (value: T) => A): A {
    return okCb(this.value);
  }

  public expect(): T {
    return this.value;
  }

  public map<U>(cb: (value: T) => U): IOk<U> {
    return new IOk(cb(this.value));
  }

  public mapOr<U>(_orValue: U, cb: (v: T) => U): U {
    return cb(this.value);
  }

  public mapOrElse<U>(okCb: (v: T) => U): U {
    return okCb(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);
    return this;
  }

  public inspectErr(): this {
    return this;
  }
}
