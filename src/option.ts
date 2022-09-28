import { Result } from './result';
import { ResultOption } from './types';

export enum OptionType {
  Some,
  None,
}

/**
 * Class representing an optional value. Every option is either `Some` and contains
 * a value, or `None` and contains no value.
 *
 * This type is inspired by Rust's `Option` type.
 *
 * @see {@link https://doc.rust-lang.org/std/option/|Rust Option Docs}
 */
export class Option<T> implements ResultOption<T> {
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
  public isSomeAnd(cb: (v: T) => boolean): boolean {
    if (this.isSome()) {
      return cb(this.value);
    }

    return false;
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
   * If value is `Some<T>` returns `T`. Throws error if value is `None`
   *
   * @returns T
   * @throws
   */
  public unwrap(): T {
    if (this.isSome()) {
      return this.value;
    } else if (this.isNone()) {
      throw new Error('Value is None');
    }
  }

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
  public unwrapOr(orValue: T): T {
    if (this.isSome()) {
      return this.value;
    } else if (this.isNone()) {
      return orValue;
    }
  }

  public match<A, B>(some: (value: T) => A, none: () => B): A | B {
    if (this.isSome()) {
      return some(this.value);
    } else if (this.isNone()) {
      return none();
    }
  }

  public expect(reason: string): T {
    if (this.isSome()) {
      return this.value;
    } else if (this.isNone()) {
      throw new Error(reason);
    }
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    if (this.isSome()) {
      return some(cb(this.value));
    } else if (this.isNone()) {
      return Option.none();
    }
  }

  public mapOr<U>(orValue: U, cb: (value: T) => U): U {
    if (this.isSome()) {
      return cb(this.value);
    } else if (this.isNone()) {
      return orValue;
    }
  }

  public mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U {
    if (this.isSome()) {
      return someCb(this.value);
    } else if (this.isNone()) {
      return noneCb();
    }
  }

  public okOr<E>(errValue: E): Result<T, E> {
    if (this.isSome()) {
      return Result.ok(this.value);
    } else if (this.isNone()) {
      return Result.err(errValue);
    }
  }

  public okOrElse<E>(errCb: () => E): Result<T, E> {
    if (this.isSome()) {
      return Result.ok(this.value);
    } else if (this.isNone()) {
      return Result.err(errCb());
    }
  }

  public inspect(cb: (v: T) => void): this {
    if (this.isSome()) {
      cb(this.value);
    }

    return this;
  }

  public static some<T>(value: T): Some<T> {
    return new Some(value);
  }

  public static none<T>(): None<T> {
    return new None();
  }
}

/**
 * A variance of the `Option` type containing a value `T`
 */
export class Some<T> extends Option<T> {
  public value: T;

  constructor(value: T) {
    super(true);
    this.value = value;
  }
}

/**
 * A variance of the `Option` type that does not contain any value
 */
export class None<T> extends Option<T> {
  constructor() {
    super(false);
  }
}

export function some<T>(value: T): Some<T> {
  return Option.some(value);
}

export function none<T>(): None<T> {
  return Option.none();
}
