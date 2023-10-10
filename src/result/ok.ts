import { IResult, Result, ResultType } from './result';
import { Err } from './err';
import { Option } from '../option';
import { LogData, ResultLoggable } from './logging';
import { Logger, __currentLogger__ } from '../logger';

export class Ok<T> implements IResult<T, never>, ResultLoggable<T, never> {
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
      value: this.value,
      type: this.type,
    };
  }
}
