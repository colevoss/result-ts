import { Result, ResultType } from './result';
import { Err } from './err';
import * as Option from '../option';

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

  public unwrapErr(): never {
    throw new Err(this.value);
  }

  public unwrapOrElse(_cb: (e: never) => T): T {
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

  public expectErr(reason: string): never {
    throw new Error(reason, { cause: this.value });
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
