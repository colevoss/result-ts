import { Result, ok, err } from './result';

export enum OptionType {
  Some,
  None,
}

export interface Option<T> {
  type: OptionType;

  isSome(): this is Some<T>;

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

  match<A, B>(someCb: (value: T) => A, noneCb: () => B): A | B;

  expect(reason: string): T;

  map<U>(cb: (value: T) => U): Option<U>;

  mapOr<U>(orValue: U, cb: (value: T) => U): U;

  mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U;

  okOr<E>(errValue: E): Result<T, E>;

  okOrElse<E>(errCb: () => E): Result<T, E>;

  inspect(cb: (v: T) => void): this;
}

// export type Option<T> = Some<T> | None<T>;

export class Some<T> implements Option<T> {
  public type = OptionType.Some;
  public value: T;

  constructor(value: T) {
    this.value = value;
  }

  public isSome(): this is Some<T> {
    return true;
  }

  public isNone(): this is None<T> {
    return false;
  }

  public isSomeAnd(cb: (v: T) => boolean): boolean {
    return cb(this.value);
  }

  public unwrap(): T {
    return this.value;
  }

  public unwrapOr(_orValue: T): T {
    return this.value;
  }

  public match<A, B>(someCb: (value: T) => A, _noneCb: () => B): A {
    return someCb(this.value);
  }

  public expect(_reason: string): T {
    return this.value;
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    return new Some(cb(this.value));
  }

  public mapOr<U>(_orValue: U, cb: (value: T) => U): U {
    return cb(this.value);
  }

  public mapOrElse<U>(someCb: (v: T) => U, _noneCb: () => U): U {
    return someCb(this.value);
  }

  public okOr<E>(_errValue: E): Result<T, E> {
    return ok(this.value);
  }

  public okOrElse<E>(_errCb: () => E): Result<T, E> {
    return ok(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);

    return this;
  }
}

export class None<T> implements Option<T> {
  public type = OptionType.None;

  public isSome(): this is Some<never> {
    return false;
  }

  public isNone(): this is None<T> {
    return true;
  }

  public isSomeAnd(_cb: (v: T) => boolean): boolean {
    return false;
  }

  public unwrap(): never {
    throw err('Option value is None');
  }

  public unwrapOr(orValue: T): T {
    return orValue;
  }

  public match<A, B>(_someCb: (value: never) => A, noneCb: () => B): B {
    return noneCb();
  }

  public expect(reason: string): never {
    throw err(reason);
  }

  public map<U>(_cb: (value: T) => U): Option<U> {
    return new None<U>();
  }

  public mapOr<U>(orValue: U, _cb: (value: T) => U): U {
    return orValue;
  }

  public mapOrElse<U>(_someCb: (v: T) => U, noneCb: () => U): U {
    return noneCb();
  }

  public okOr<E>(errValue: E): Result<T, E> {
    return err(errValue);
  }

  public okOrElse<E>(errCb: () => E): Result<T, E> {
    return err(errCb());
  }

  public inspect(_cb: (v: T) => void): this {
    return this;
  }
}

export function some<T>(value: T): Some<T> {
  return new Some(value);
}

export function none<T>(): None<T> {
  return new None();
}
