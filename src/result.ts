import { ResultOption } from './types';
import { Option } from './option';
import { ResultError } from './error';

export enum ResultType {
  Ok,
  Err,
}

/**
 * Class used for returning and propogating errors. Behaves as an enum with variants
 * `Ok<T>` representing success and containing a value, and `Err<E>` representing
 * an error and containing an error value.
 *
 * This type is inspired by Rust's `Result` type.
 *
 * @see {@link https://doc.rust-lang.org/std/result|Rust Result Docs}
 */
export class Result<T, E> implements ResultOption<T> {
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

  public isOkAnd(cb: (v: T) => boolean): boolean {
    if (this.isOk()) {
      return cb(this.value);
    } else if (this.isErr()) {
      return false;
    }
  }

  public isErr(): this is Err<T, E> {
    return !this._ok;
  }

  public isErrAnd(cb: (v: E) => boolean): boolean {
    if (this.isOk()) {
      return false;
    } else if (this.isErr()) {
      return cb(this.error);
    }
  }

  public unwrap(): T {
    if (this.isOk()) {
      return this.value;
    } else if (this.isErr()) {
      const message =
        typeof this.error === 'string' ? this.error : 'Unwrapping Error Result';

      throw new ResultError(message, this);
    }
  }

  public unwrapOr(orValue: T): T {
    if (this.isOk()) {
      return this.value;
    } else if (this.isErr()) {
      return orValue;
    }
  }

  public match<A, B>(ok: (value: T) => A, err: (e: Err<T, E>) => B): A | B {
    if (this.isOk()) {
      return ok(this.value);
    } else if (this.isErr()) {
      return err(this);
    }
  }

  public expect(reason: string): T {
    if (this.isOk()) {
      return this.value;
    } else if (this.isErr()) {
      throw new ResultError(reason, this);
    }
  }

  public map<U>(cb: (value: T) => U): Result<U, E> {
    if (this.isOk()) {
      return Result.ok(cb(this.value));
    } else if (this.isErr()) {
      return Result.err(this.error);
    }
  }

  public mapOr<U>(orValue: U, cb: (v: T) => U): U {
    if (this.isOk()) {
      return cb(this.value);
    } else if (this.isErr()) {
      return orValue;
    }
  }

  public mapOrElse<U>(okCb: (v: T) => U, errCb: (e: Err<T, E>) => U): U {
    if (this.isOk()) {
      return okCb(this.value);
    } else if (this.isErr()) {
      return errCb(this);
    }
  }

  public ok(): Option<T> {
    if (this.isOk()) {
      return Option.some(this.value);
    } else if (this.isErr()) {
      return Option.none();
    }
  }

  public err(): Option<E> {
    if (this.isOk()) {
      return Option.none();
    } else if (this.isErr()) {
      return Option.some(this.error);
    }
  }

  public inspect(cb: (v: T) => void): this {
    if (this.isOk()) {
      cb(this.value);
    }

    return this;
  }

  public inspectErr(cb: (e: E) => void): this {
    if (this.isErr()) {
      cb(this.error);
    }

    return this;
  }

  public static ok<T, E>(value: T = null): Ok<T, E> {
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

  public static wrapAsync<T>(fn: (...args: unknown[]) => Promise<T>) {
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

export type LazyResult<T> = Result<T, unknown>;
export type PromiseRes<T, E> = Promise<Result<T, E>>;

export class Ok<T, E = undefined> extends Result<T, E> {
  public value: T;

  constructor(value: T = null) {
    super(true);
    this.value = value;
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
}

export function ok<T, E>(v: T = null): Ok<T, E> {
  return Result.ok(v);
}

export function err<T, E>(err: E): Err<T, E>;
export function err<T, E>(err: E, v: T): Err<T, E>;
export function err<T, E>(err: E, v?: T): Err<T, E> {
  return Result.err(err, v);
}
