import { IResult, Result, ResultType, logResult } from './result';
import { Ok } from './ok';
import { Option } from '../option';
import { ResultLoggable, LogData } from './logging';

export class Err<E>
  extends Error
  implements IResult<never, E>, ResultLoggable<never, E>
{
  public readonly type = ResultType.Err;
  public readonly error: E;

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

  public unwrapErr(): E {
    return this.error;
  }

  public unwrapOrElse<T>(cb: (e: E) => T): T {
    return cb(this.error);
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

  public expectErr(_reason: string): E {
    return this.error;
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

  public ok<T>(): Option<T> {
    return Option.none();
  }

  public err(): Option<E> {
    return Option.some(this.error);
  }

  public and<U, F>(andValue: Result<U, E>): Result<U, E> {
    return this;
  }

  public andThen<U, F>(cb: (v: never) => IResult<U, E>): Err<E> {
    return this;
  }

  public or<T, F>(orValue: Result<T, F>): Result<T, F> {
    return orValue;
  }

  public orElse<T, F>(cb: (e: E) => Result<T, F>): Result<T, F> {
    return cb(this.error);
  }

  public debug(msg?: string): this {
    logResult(this, Result.LogLevel.debug, msg);
    return this;
  }

  public info(msg?: string): this {
    logResult(this, Result.LogLevel.info, msg);
    return this;
  }

  public warn(msg?: string): this {
    logResult(this, Result.LogLevel.warn, msg);
    return this;
  }

  public errorLog(msg?: string): this {
    logResult(this, Result.LogLevel.error, msg);
    return this;
  }

  public okDebug(msg?: string): this {
    return this;
  }

  public okInfo(msg?: string): this {
    return this;
  }

  public okWarn(msg?: string): this {
    return this;
  }

  public okError(msg?: string): this {
    return this;
  }

  public errDebug(msg?: string): this {
    return this.debug(msg);
  }

  public errInfo(msg?: string): this {
    return this.info(msg);
  }

  public errWarn(msg?: string): this {
    return this.warn(msg);
  }

  public errError(msg?: string): this {
    return this.errorLog(msg);
  }

  public toJSON(): LogData<never, E> {
    return {
      error: this.error,
      type: this.type,
    };
  }
}
