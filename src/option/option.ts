import { None } from './none';
import { Some } from './some';
import { Result } from '../result';

export enum OptionType {
  Some,
  None,
}

export interface IOption<T> {
  type: OptionType;

  /**
   * Returns `true` if Option is `Some`
   *
   * @returns boolean
   */
  isSome(): this is Some<T>;

  /**
   * Returns `true` if Option is `None`
   *
   * @returns boolean
   */
  isNone(): this is None<T>;

  /**
   * If type is `Some<T>` returns value returned by the given callback.
   * If type is `None`, returns false
   *
   * @example
   * const someValue = Option.some(1);
   * const is = someValue.isSomeAnd((v) => v === 1);
   * assert.ok(is);
   *
   * const isNot = someValue.isSomeAnd((v) => v !== 1);
   * assert.ok(!isNot);
   *
   * @param cb Predicate function called when type is `Some<T>`.
   * @returns boolean
   */
  isSomeAnd(cb: (v: T) => boolean): boolean;

  /**
   * If value is `Some<T>` returns `T`. Throws error if value is `None`
   *
   * @returns T
   * @throws
   */
  unwrap(): T;

  /**
   * If value is `Some<T>` returns `T`.
   * If value is `None` returns given `orValue`
   *
   * @example
   * const some = Option.some('value');
   *
   * const someValue = some.unwrapOr('or value');
   * assert.equal(someValue, 'value');
   *
   * const none = Option.none();
   *
   * const noneValue = none.unwrapOr('or value');
   * assert.equal(noneValue, 'or value');
   *
   * @param {T} orValue - Value returned if type is `None`
   * @returns
   */
  unwrapOr(orValue: T): T;

  /**
   * Returns the contained `Some` value or computes it from the given callback
   *
   * @param someCb
   * @param noneCb
   */
  unwrapOrElse(cb: () => T): T;

  match<U>(someCb: (value: T) => U, noneCb: () => U): U;

  /**
   * Returns the contained valued `T` if value is `Some`
   *
   * @throws Throws error is Option is `None` with provided reason as message.
   *
   * @param reason Description of expected Option
   * @returns `T`
   */
  expect(reason: string): T;

  /**
   * Maps `Option<T>` to `Option<U>` by applying a function to a contained
   * `Option` value and ignores `None`
   *
   * @param cb Function to apply to `Option`
   * @returns `Option<U>`
   */
  map<U>(cb: (value: T) => U): Option<U>;

  /**
   * Returns the provided default if Option is `None` otherwise applies a function
   * to the contained `Option` value (if `Some`)
   *
   * @param orValue Default value returned if Option is `None`
   * @param cb Function to apply to `Some` value
   *
   * @returns `U`
   */
  mapOr<U>(cb: (value: T) => U, orValue: U): U;

  /**
   * Maps an `Option<T>` to `U` by calling a fallback function `noneCb`, or `someCb`
   * to a contained `Some` value
   *
   * @param someCb Function to apply if Option is `Some`
   * @param noneCb Function to call if Option is `None`
   *
   * @returns `U`
   */
  mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U;

  /**
   * Transforms the `Option<T>` into `Result<T, E>`, mapping `Some<T>` to `Ok<T>`
   * and `None` to `Err<E>`.
   *
   * @param errValue Value to provide to `Err` if Option is `None`
   */
  okOr<E>(errValue: E): Result<T, E>;

  /**
   * Transforms the `Option<T>` into `Result<T, E>`, mapping `Some<T>` to `Ok<T>`
   * and `None` to `Err<errCb()>`
   *
   * @param errCb Function to call that will provide error value if Option is `None`
   */
  okOrElse<E>(errCb: () => E): Result<T, E>;

  /**
   * Calls the provided `cb` with contained value (if `Some`)
   *
   * @param cb Function to call if value is `Some`
   */
  inspect(cb: (v: T) => void): this;

  /**
   * Returns `None` if the option is `None`, otherwise returns `andValue`
   *
   * @param andValue Option to return if this Option is `None`
   */
  and<U>(andValue: Option<U>): Option<U>;

  /**
   * Returns `None` if Option is `None`, otherwise calls `cb` with contained
   * value and returns result.
   *
   * @param cb
   */
  andThen<U>(cb: (v: T) => Option<U>): Option<U>;

  /**
   * Returns the option if it contains a value, otherwise returns `orValue`
   *
   * @param orValue
   */
  or(orValue: Option<T>): Option<T>;

  /**
   * Returns the option if it contains a value, otherwise calls `cb` and returns
   * the result
   *
   * @param cb
   */
  orElse(cb: () => Option<T>): Option<T>;

  /**
   * Returns `Some` if exactly one of `this` or `xorValue` is `Some`, otherwise
   * returns `None`
   *
   * @param xorValue
   */
  xor(xorValue: Option<T>): Option<T>;

  /**
   * Returns `None` if the option is `None`, otherwise calls `predicate` with
   * the contained value and returns:
   *
   * * `Some<T>` if `predicate` returns `true`.
   * * `None` if `predicate` returns `false`.
   *
   * @param predicate
   */
  filter(predicate: (v: T) => boolean): Option<T>;
}

export type Option<T> = Some<T> | None<T>;

export namespace Option {
  export function some<T>(value: T): Some<T> {
    return new Some(value);
  }

  export function none<T>(): None<T> {
    return new None<T>();
  }

  export function isOption<T = any>(val: unknown): val is Option<T> {
    return val instanceof Some || val instanceof None;
  }
}
