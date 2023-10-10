import { Option } from '../option';
import { Err } from './err';
import { Ok } from './ok';
import { LogData } from './logging';
import * as Logger from '../logger';

export enum ResultType {
  Ok = 'Ok',
  Err = 'Error',
}

export interface IResult<T, E> {
  t: ResultType;

  /**
   * Returns `true` if Result is `Ok`
   *
   * @returns boolean
   */
  isOk(): this is Ok<T, E>;

  /**
   * Returns `false` if Result is `Err`
   *
   * @returns boolean
   */
  isErr(): this is Err<T, E>;

  /**
   * Returns `true` when Result is Ok and the contained value matches predicate
   *
   * @param cb  Predicate function called when type is `Ok`
   * @returns boolean
   */
  isOkAnd(cb: (v: T) => boolean): boolean;

  /**
   * Returns `true` when Result is `Err` and the contained error matches predicate
   *
   * @param cb Predicate function called when type is `Err
   */
  isErrAnd(cb: (v: E) => boolean): boolean;

  /**
   * If value is `Ok<T>` returns `T`. Throws error if value is `Err`
   */
  unwrap(): T;

  /**
   * If Result is `Err` returns E. Throws error if value is Ok;
   */
  unwrapErr(): E;

  /**
   * Returns the contained `Ok` value or provided default
   *
   * @param orValue T
   * @returns T
   */
  unwrapOr(orValue: T): T;

  /**
   * Returns the contained `Ok` value or computes it from callback
   *
   * @param cb Callback to return a default value if Result is `Err`
   */
  unwrapOrElse(cb: (e: E) => T): T;

  /**
   * If Result is `Ok` calls provided `okCb` with contained value, otherwise calls
   * provided `errCb` with contained error value.
   *
   * The two provided functions do not need to have the same return type
   *
   * @param okCb Function called when this Result is `Ok`
   * @param errCb Function called when this Result is `Err`
   */
  match<U>(okCb: (value: T) => U, errCb: (e: E) => U): U;

  /**
   * Returns the contained value `T` if value is `Ok`.
   *
   * @throws Throws error if Result is `Err` with provided reason as message
   * and `cause` as `self`
   *
   * @param reason Description of expected result.
   * @returns `T`
   */
  expect(reason: string): T;

  /**
   * Returns the contained `Err` value.
   *
   * @throws Throws contained value `T` if Result is `Ok<T>`
   *
   * @param reason
   * @returns Contained error value
   */
  expectErr(reason: string): E;

  /**
   * Maps `Result<T, E>` to `Result<U, E>` by applying a function to a contained
   * `Ok` value and ignores if `Err`.
   *
   * @param cb Function to apply to Result
   * @returns `Result<U, E>`
   */
  map<U>(cb: (value: T) => U): Result<U, E>;

  /**
   * Returns the provided default if Result is `Err` otherwise applies a function
   * to the contained `Ok` value (if `Ok`)
   *
   * @param cb Function to apply to `Ok` value
   * @param orValue Default value returned if Result is `Err`
   *
   * @returns `U`
   */
  mapOr<U>(cb: (v: T) => U, orValue: U): U;

  /**
   * Maps a `Result<T, E>` to `U` by applying fallback function `errCb` to a contained
   * `Err` value, or function `okCb` to a contained `Ok` value.
   *
   * @param okCb Function to apply if Result `Ok`
   * @param errCb  Function to apply if Result is `Err`
   *
   * @returns `U`
   */
  // mapOrElse<U>(okCb: (v: T) => U, errCb: (e: Err<U, E>) => U): U;
  mapOrElse<U>(errCb: (e: E) => U, okCb: (v: T) => U): U;

  /**
   * Calls the provided function with contained value if Result is `Ok`.
   *
   * Ignores callback if Result is `Err`
   *
   * @param cb Function called if value is `Ok`
   * @returns `this`
   */
  inspect(cb: (v: T) => void): this;

  /**
   * Calls the provided function with contained error if Result is `Err`
   *
   * Ignores callback if Result is `Ok`
   *
   * @param cb Function called if value is `Err`
   * @returns `this`
   */
  inspectErr(cb: (e: E) => void): this;

  /**
   * Converts from `Result<T, E>` to `Option<T>`
   *
   * @returns `Option<T>`
   */
  ok(): Option<T>;

  /**
   * Converts from `Result<T, E>` to `Option<E>`
   *
   * @returns `Option<E>`
   */
  err(): Option<E>;

  /**
   * Returns `andValue` if the Result is `Ok`, otherwise returns `Err` value.
   *
   * @param andValue value to return if this Result is `Ok`
   */
  // and<U>(andValue: IResult<U, E>): IResult<U, E>;
  and<U>(andValue: Result<U, E>): Result<U, E>;

  /**
   * Calls `cb` if Result is `Ok`, otherwise returns `Err<E>`.
   *
   * @param cb Function to call if Result is `Ok`. Should return `Result<U, E>`
   * @returns `Result<U, E>`
   */
  andThen<U>(cb: (v: T) => Result<U, E>): Result<U, E>;

  /**
   * Returns `orValue` if Result is `Err` otherwise returns `Ok`
   *
   * @param orValue Value to return if this Result is `Err`
   */
  or<F>(orValue: Result<T, F>): Result<T, F>;
  // or<U, F>(orValue: Result<U, F>): Result<T, E> | Result<U, F>;

  /**
   * Calls `cb` if Result is `Err`, otherwise returns `Ok`
   *
   * @param cb Function to call if this Result is `Err`. Should return `Result<T, F>`
   * @returns `Result<T, F>`
   */
  // orElse<F>(cb: (e: E) => IResult<T, F>): IResult<T, F>;
  // TODO: Figure out return type inference
  orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F>;

  // debug(msg?: string): this;
  // info(msg?: string): this;
  // warn(msg?: string): this;
  // logError(msg?: string): this;

  // pretty(msg?: string): this;

  // toJSON(): LogData<T, E>;
}

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export namespace Result {
  export type Lazy<T> = Result<T, unknown>;
  export type Prom<T, E> = Promise<Result<T, E>>;

  export type OkType<T extends Result<any, any>> = T extends Ok<infer U, never>
    ? U
    : never;

  export type ErrType<T extends Result<any, any>> = T extends Err<
    never,
    infer E
  >
    ? E
    : never;

  export type OkTypes<T extends Result<any, any>[]> = {
    [key in keyof T]: T[key] extends Result<infer U, any> ? U : never;
  };

  export type ErrTypes<T extends Result<any, any>[]> = {
    [key in keyof T]: T[key] extends Result<any, infer E> ? E : never;
  };

  export function ok<T>(value: T = null): Ok<T, never> {
    return new Ok(value);
  }

  export function err<E>(error: E): Err<never, E> {
    return new Err(error);
  }

  export function wrap<F extends (...args: any[]) => any>(fn: F) {
    return (...args: Parameters<typeof fn>): Result<ReturnType<F>, unknown> => {
      try {
        const value = fn(...args);
        return ok(value);
      } catch (e) {
        return err(e.message);
      }
    };
  }

  export function wrapAsync<F extends (...args: any[]) => Promise<any>>(
    fn: F,
  ): (
    ...args: Parameters<typeof fn>
  ) => Promise<Result<Awaited<ReturnType<F>>, unknown>> {
    return async (
      ...args: Parameters<typeof fn>
    ): Promise<Result<Awaited<ReturnType<F>>, unknown>> => {
      try {
        const value = await fn(...args);
        return ok(value);
      } catch (e) {
        return err(e.message);
      }
    };
  }

  export function all<T extends Result<any, any>[]>(
    ...results: T
  ): Result<OkTypes<T>, ErrTypes<T>[number]> {
    const okValues = [];

    for (const result of results) {
      if (result.isErr()) {
        return result;
      }

      okValues.push(result.v);
    }

    return new Ok(okValues as OkTypes<T>);
  }

  export function any<T extends Result<any, any>[]>(
    ...results: T
  ): Result<OkTypes<T>[number], ErrTypes<T>> {
    const errValues = [];

    for (const result of results) {
      if (result.isOk()) {
        return result as Ok<OkTypes<T>[number], any>;
      }

      errValues.push(result.e);
    }

    return new Err(errValues as ErrTypes<T>);
  }

  export function isResult<T = any, E = any>(
    val: unknown,
  ): val is Result<T, E> {
    return val instanceof Ok || val instanceof Err;
  }

  export const setLogLevel = Logger.setLogLevel;
  export const LogLevel = Logger.LOG_LEVEL;
  export const setLogger = Logger.setLogger;
}

// function defaultLogger<T, E>({ msg, data, level }: Result.LoggerData<T, E>) {
//   const args = [];
//
//   args.push(`${level.toUpperCase()}:`);
//
//   if (msg) {
//     args.push(msg);
//   }
//
//   args.push(data);
//
//   console.log(...args);
// }
//
// const levelsMap = {
//   debug: 2,
//   info: 3,
//   warn: 4,
//   error: 5,
//   fatal: 6,
//   trace: 7,
//   silent: 8,
// } as const;
//
// let __log_level__: Result.LogLevel = Result.LogLevel.info;
// let resultLogger: Result.Logger = defaultLogger;
//
// export function logResult<T, E>(
//   result: Result<T, E>,
//   level: Result.LogLevel,
//   msg?: string,
// ) {
//   if (levelsMap[level] < levelsMap[__log_level__]) {
//     return;
//   }
//
//   resultLogger({
//     msg,
//     data: result.toJSON(),
//     level: level,
//     levelVal: levelsMap[level],
//   });
// }

// let originalLogger: Result.Logger;
// const levelToName = (level: Result.LogLevel) => {
//   switch (level) {
//     case Result.LogLevel.Debug:
//       return '[DEBUG]';
//     case Result.LogLevel.Info:
//       return '[INFO] ';
//     case Result.LogLevel.Warn:
//       return '[WARN] ';
//     case Result.LogLevel.Error:
//       return '[ERROR] ';
//     case Result.LogLevel.Fatal:
//       return '[FATAL]';
//     default:
//       return '';
//   }
// };
//
// export let resultLogger: Result.Logger = <T, E>(
//   result: Result<T, E>,
//   options: Result.LoggerOptions = {},
// ) => {
//   const level = options.level || Result.LogLevel.Info;
//
//   if (__log_level__ === Result.LogLevel.None || __log_level__ > level) {
//     return;
//   }
//
//   const args = [];
//   let message = levelToName(level) + ' ';
//
//   if (options.msg !== undefined) {
//     message += options.msg;
//   }
//
//   args.push(message);
//
//   if (options.pretty) {
//     args.push(
//       `${options.msg ? '\n' : ''}${result.type} ${JSON.stringify(
//         result,
//         null,
//         2,
//       )}`,
//     );
//   } else {
//     args.push(result.toJSON());
//   }
//
//   const log = result.isOk() ? console.log : console.error;
//
//   log(...args);
// };
