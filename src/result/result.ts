import { Option } from '../option';
import { Err } from './err';
import { Ok } from './ok';

export enum ResultType {
  Ok = 'ResultOk',
  Err = 'ResultError',
}

export interface Result<T, E> {
  type: ResultType;

  /**
   * Returns `true` if Result is `Ok`
   *
   * @returns boolean
   */
  isOk(): this is Ok<T>;

  /**
   * Returns `false` if Result is `Err`
   *
   * @returns boolean
   */
  isErr(): this is Err<E>;

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
  match<A, B>(okCb: (value: T) => A, errCb: (e: Err<E>) => B): A | B;

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
  mapOrElse<U>(okCb: (v: T) => U, errCb: (e: Err<E>) => U): U;

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

  /**
   * Calls `cb` if Result is `Err`, otherwise returns `Ok`
   *
   * @param cb Function to call if this Result is `Err`. Should return `Result<T, F>`
   * @returns `Result<T, F>`
   */
  orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F>;
}

export type LazyResult<T> = Result<T, unknown>;
export type PromiseRes<T, E> = Promise<Result<T, E>>;

export type Res<T, E> = Ok<T> | Err<E>;
