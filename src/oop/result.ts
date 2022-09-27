import { ResultOption } from './types';

abstract class IResult<T, E> implements ResultOption<T, E> {
  protected ok: boolean;

  constructor(ok: boolean) {
    this.ok = ok;
  }

  public isOk(): this is Ok<T> {
    return this.ok;
  }

  public isErr(): this is Err<T, E> {
    return !this.ok;
  }

  public unwrap(): T {
    if (this.isOk()) {
      return this.value;
    } else if (this.isErr()) {
      throw this.error;
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
      err(this);
    }
  }

  public expect(reason: string): T {
    if (this.isOk()) {
      return this.value;
    } else if (this.isErr()) {
      throw new Error(reason);
    }
  }
}

export class Ok<T> extends IResult<T, undefined> {
  public value: T;

  constructor(value: T) {
    super(true);
    this.value = value;
  }
}

export class Err<T, E> extends IResult<T, E> {
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

export function ok<T>(v: T): Ok<T> {
  return new Ok(v);
}

export function err<T, E>(err: E): Err<T, E>;
export function err<T, E>(err: E, v: T): Err<T, E>;
export function err<T, E>(err: E, v?: T): Err<T, E> {
  return new Err(err, v);
}

export type Result<T, E> = Ok<T> | Err<T, E>;

/* const test = async (res: Result<string, string>) => { */
/*   const x = await res.match( */
/*     async (value) => value, */
/*     (e) => console.log(e.error), */
/*   ); */
/* }; */
