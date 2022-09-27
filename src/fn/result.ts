interface IResult<T, E> {
  ok: boolean;
}

export interface Ok<T, E = undefined> extends IResult<T, E> {
  ok: true;
  value: T;
  error?: E;
}

export interface Err<T, E> extends IResult<T, E> {
  ok: false;
  error: E;
  value?: T;
}

export type Result<T, E> = Ok<T> | Err<T, E>;
export type LazyResult<T> = Ok<T> | Err<T, unknown>;

export function ok<T>(v: T): Ok<T> {
  return {
    ok: true,
    value: v,
    error: undefined,
  };
}

export function err<T, E>(err: E): Err<T, E>;
export function err<T, E>(err: E, v: T): Err<T, E>;
export function err<T, E>(err: E, v?: T): Err<T, E> {
  const e: Err<T, E> = {
    ok: false,
    error: err,
  };

  if (v) {
    e.value = v;
  }

  return e;
}

export function isOk<T, E>(result: IResult<T, E>): result is Ok<T, E> {
  return result.ok;
}

export function isErr<T, E>(result: IResult<T, E>): result is Err<T, E> {
  return !result.ok;
}
