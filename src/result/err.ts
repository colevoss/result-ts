import { IResult, Result, ResultType } from './result';
import { Ok } from './ok';
import { Option } from '../option';
import { ResultLoggable, LogData } from './logging';
import { Logger, __currentLogger__ } from '../logger';

export class Err<T, E> implements IResult<T, E>, ResultLoggable<T, E> {
  public readonly t = ResultType.Err;
  private readonly e: E;

  constructor(err: E) {
    this.e = err;
  }

  public isOk(): this is Ok<T, E> {
    return false;
  }

  public isErr(): this is Err<T, E> {
    return true;
  }

  public isOkAnd(cb: (v: never) => boolean): boolean {
    return false;
  }

  public isErrAnd(cb: (v: E) => boolean): boolean {
    return cb(this.e);
  }

  public unwrap(): never {
    throw this.e;
  }

  public unwrapErr(): E {
    return this.e;
  }

  public unwrapOrElse<T>(cb: (e: E) => T): T {
    return cb(this.e);
  }

  public unwrapOr<T>(orValue: T): T {
    return orValue;
  }

  public match<U>(okCb: (value: T) => U, errCb: (e: E) => U): U {
    return errCb(this.e);
  }

  public expect(reason: string): never {
    throw new Error(reason, { cause: this.e });
  }

  public expectErr(reason: string): E {
    return this.e;
  }

  public map<U>(cb: (value: T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  public mapErr<F>(cb: (err: E) => F): Result<T, F> {
    return new Err(cb(this.e));
  }

  public mapOr<U>(cb: (v: T) => U, orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(errCb: (e: E) => U, okCb: (v: T) => U): U {
    return errCb(this.e);
  }

  public inspect(cb: (v: T) => void): this {
    return this;
  }

  public inspectErr(cb: (e: E) => void): this {
    cb(this.e);

    return this;
  }

  public ok<T>(): Option<T> {
    return Option.none();
  }

  public err(): Option<E> {
    return Option.some(this.e);
  }

  public and<U, E>(andValue: Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  public andThen<U>(cb: (v: T) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  public or<T, F>(orValue: Result<T, F>): Result<T, F> {
    return orValue;
  }

  public orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F> {
    return cb(this.e);
  }

  public debug(msg: string, logger: Logger = __currentLogger__): this {
    // logResult(this, Result.LogLevel.debug, msg);
    logger.debug(this, msg);
    return this;
  }

  public info(msg: string, logger: Logger = __currentLogger__): this {
    logger.info(this, msg);
    return this;
  }

  public warn(msg: string, logger: Logger = __currentLogger__): this {
    logger.warn(this, msg);
    return this;
  }

  public errorLog(msg: string, logger: Logger = __currentLogger__): this {
    logger.error(this, msg);
    return this;
  }

  public fatal(msg: string, logger: Logger = __currentLogger__): this {
    logger.fatal(this, msg);
    return this;
  }

  public okDebug(msg: string): this {
    return this;
  }

  public okInfo(msg: string): this {
    return this;
  }

  public okWarn(msg: string): this {
    return this;
  }

  public okError(msg: string): this {
    return this;
  }

  public okFatal(msg: string): this {
    return this;
  }

  public errDebug(msg: string, logger: Logger = __currentLogger__): this {
    return this.debug(msg, logger);
  }

  public errInfo(msg: string, logger: Logger = __currentLogger__): this {
    return this.info(msg, logger);
  }

  public errWarn(msg: string, logger: Logger = __currentLogger__): this {
    return this.warn(msg, logger);
  }

  public errError(msg: string, logger: Logger = __currentLogger__): this {
    return this.errorLog(msg, logger);
  }

  public errFatal(msg: string, logger: Logger = __currentLogger__): this {
    return this.fatal(msg, logger);
  }

  public toJSON(): LogData<never, E> {
    return {
      error: this.e,
      type: this.t,
    };
  }
}
