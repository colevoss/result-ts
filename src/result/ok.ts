import { IResult, Result, ResultType } from './result';
import { Err } from './err';
import { Option } from '../option';
import { LogData, ResultLoggable } from './logging';
import { Logger, __currentLogger__ } from '../logger';

export class Ok<T, E> implements IResult<T, E>, ResultLoggable<T, E> {
  public readonly t = ResultType.Ok;
  public readonly v: T;

  constructor(value: T = null) {
    this.v = value;
  }
  public isOk(): this is Ok<T, never> {
    return true;
  }

  public isErr(): this is Err<T, never> {
    return false;
  }

  public isOkAnd(cb: (v: T) => boolean): boolean {
    return cb(this.v);
  }

  public isErrAnd(_cb: (v: never) => boolean): boolean {
    return false;
  }

  public unwrap(): T {
    return this.v;
  }

  public unwrapErr(): never {
    throw this.v;
  }

  public unwrapOrElse(_cb: (e: never) => T): T {
    return this.v;
  }

  public unwrapOr(orValue: T): T {
    return this.v;
  }

  public match<U>(okCb: (value: T) => U, errCb: (e: E) => U): U {
    return okCb(this.v);
  }

  public expect(_reason: string): T {
    return this.v;
  }

  public expectErr(reason: string): never {
    throw new Error(reason, { cause: this.v });
  }

  public map<U>(cb: (value: T) => U): Result<U, E> {
    return new Ok(cb(this.v));
  }

  public mapOr<U>(cb: (v: T) => U, _orValue: U): U {
    return cb(this.v);
  }

  // public mapOrElse<U>(okCb: (v: T) => U, _errCb: (e: Err<U, E>) => U): U {
  //   return okCb(this.value);
  // }

  public mapOrElse<U>(errCb: (e: E) => U, okCb: (v: T) => U): U {
    return okCb(this.v);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.v);
    return this;
  }

  public inspectErr(_cb: (e: never) => void): this {
    return this;
  }

  public ok(): Option<T> {
    return Option.some(this.v);
  }

  public err(): Option<never> {
    return Option.none();
  }

  public and<U, E>(andValue: Result<U, E>): Result<U, E> {
    return andValue;
  }

  public andThen<U, E>(cb: (v: T) => Result<U, E>): Result<U, E> {
    return cb(this.v);
  }

  public or<F>(_orValue: Result<T, F>): Result<T, F> {
    return this as unknown as Result<T, F>;
  }

  public orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F> {
    return this as unknown as Result<T, F>;
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

  public okDebug(msg: string, logger: Logger = __currentLogger__): this {
    return this.debug(msg, logger);
  }

  public okInfo(msg: string, logger: Logger = __currentLogger__): this {
    return this.info(msg, logger);
  }

  public okWarn(msg: string, logger: Logger = __currentLogger__): this {
    return this.warn(msg, logger);
  }

  public okError(msg: string, logger: Logger = __currentLogger__): this {
    return this.errorLog(msg, logger);
  }

  public okFatal(msg: string, logger: Logger = __currentLogger__): this {
    return this.fatal(msg, logger);
  }

  public errDebug(msg: string, logger: Logger): this {
    return this;
  }

  public errInfo(msg: string, logger: Logger): this {
    return this;
  }

  public errWarn(msg: string, logger: Logger): this {
    return this;
  }

  public errError(msg: string, logger: Logger): this {
    return this;
  }

  public errFatal(msg: string, logger: Logger): this {
    return this;
  }

  public toJSON(): LogData<T, never> {
    return {
      value: this.v,
      type: this.t,
    };
  }
}
