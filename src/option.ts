import { ResultOption } from './result';
import { Result } from './result';

export enum OptionType {
  Some,
  None,
}

export abstract class Option<T> implements ResultOption<T> {
  public _type: OptionType;
  protected hasValue: boolean;

  static Some = OptionType.Some;
  static None = OptionType.None;

  protected constructor(hasValue: boolean) {
    this.hasValue = hasValue;
    this._type = hasValue ? OptionType.Some : OptionType.None;
  }

  public get type(): OptionType {
    return this._type;
  }

  /**
   * Returns true if value is `Some<T>`
   *
   * @returns boolean
   */
  public isSome(): this is Some<T> {
    return this.hasValue;
  }

  /**
   * Returns true if value is `None`
   *
   * @returns
   */
  public isNone(): this is None<T> {
    return !this.hasValue;
  }

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
  public abstract isSomeAnd(cb: (v: T) => boolean): boolean;

  /**
   * If value is `Some<T>` returns `T`. Throws error if value is `None`
   *
   * @returns T
   * @throws
   */
  public abstract unwrap(): T;

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
  public abstract unwrapOr(orValue: T): T;

  public abstract match<A, B>(someCb: (value: T) => A, noneCb: () => B): A | B;

  public abstract expect(reason: string): T;

  public abstract map<U>(cb: (value: T) => U): Option<U>;

  public abstract mapOr<U>(orValue: U, cb: (value: T) => U): U;

  public abstract mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U;

  public abstract okOr<E>(errValue: E): Result<T, E>;

  public abstract okOrElse<E>(errCb: () => E): Result<T, E>;

  public abstract inspect(cb: (v: T) => void): this;

  public static some<T>(value: T): Some<T> {
    return new Some(value);
  }

  public static none<T>(): None<T> {
    return new None();
  }
}

export class Some<T> extends Option<T> {
  public value: T;

  constructor(value: T) {
    super(true);
    this.value = value;
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
    return Result.ok(this.value);
  }

  public okOrElse<E>(_errCb: () => E): Result<T, E> {
    return Result.ok(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);

    return this;
  }
}

export class None<T> extends Option<T> {
  constructor() {
    super(false);
  }

  public isSomeAnd(_cb: (v: T) => boolean): boolean {
    return false;
  }

  public unwrap(): T {
    // TODO: Use Better error
    throw new Error('Option value is None');
  }

  public unwrapOr(orValue: T): T {
    return orValue;
  }

  public match<A, B>(_someCb: (value: T) => A, noneCb: () => B): B {
    return noneCb();
  }

  public expect(reason: string): T {
    // TODO: Use beter errors
    throw new Error(reason);
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
    return Result.err(errValue);
  }

  public okOrElse<E>(errCb: () => E): Result<T, E> {
    return Result.err(errCb());
  }

  public inspect(_cb: (v: T) => void): this {
    return this;
  }
}

export function some<T>(value: T): Some<T> {
  return Option.some(value);
}

export function none<T>(): None<T> {
  return Option.none();
}
