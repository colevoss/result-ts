import { IResult, LogData, Result, ResultType, resultLogger } from './result';
import { Err } from './err';
import { Option } from '../option';

export class Ok<T> implements IResult<T, never> {
  public readonly type = ResultType.Ok;
  public readonly value: T;

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

  public ok(): Option<T> {
    return Option.some(this.value);
  }

  public err(): Option<never> {
    return Option.none();
  }

  public and<U, E>(andValue: Result<U, E>): Result<U, E> {
    return andValue;
  }

  public andThen<U, E>(cb: (v: T) => Result<U, E>): Result<U, E> {
    return cb(this.value);
  }

  public or<U, F>(orValue: Result<T, F>): Result<T, never> {
    return this;
  }

  public orElse<U, F>(cb: (e: never) => Result<T, F>): Result<T, F> {
    return this;
  }

  public debug(msg?: string): this {
    resultLogger(this, { msg, level: Result.LogLevel.Debug });
    return this;
  }

  public info(msg?: string): this {
    resultLogger(this, { msg, level: Result.LogLevel.Info });
    return this;
  }

  public warn(msg?: string): this {
    resultLogger(this, { msg, level: Result.LogLevel.Warn });
    return this;
  }

  public logError(msg?: string): this {
    resultLogger(this, { msg, level: Result.LogLevel.Error });
    return this;
  }

  public pretty(msg?: string): this {
    resultLogger(this, { msg, pretty: true });
    return this;
  }

  public toJSON(): LogData<T, never> {
    return {
      value: this.value,
      type: this.type,
    };
    // return this.log();
  }
}
