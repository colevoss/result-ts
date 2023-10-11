import { IOption, Option, OptionType } from './option';
import { Result } from '../result';
import { None } from './none';

export class Some<T> implements IOption<T> {
  public readonly type = OptionType.Some;

  // value
  private v: T;

  constructor(value: T) {
    this.v = value;
  }
  public isSome(): this is Some<T> {
    return true;
  }

  public isNone(): this is None<T> {
    return false;
  }

  public isSomeAnd(cb: (v: T) => boolean): boolean {
    return cb(this.v);
  }

  public unwrap(): T {
    return this.v;
  }

  public unwrapOr(_orValue: T): T {
    return this.v;
  }

  public unwrapOrElse(_cb: () => T): T {
    return this.v;
  }

  public match<U>(someCb: (value: T) => U, noneCb: () => U): U {
    return someCb(this.v);
  }

  public expect(_reason: string): T {
    return this.v;
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    return new Some(cb(this.v));
  }

  public mapOr<U>(cb: (value: T) => U, _orValue: U): U {
    return cb(this.v);
  }

  public mapOrElse<U>(someCb: (v: T) => U, _noneCb: () => U): U {
    return someCb(this.v);
  }

  public okOr<E>(errValue: E): Result<T, E> {
    return Result.ok(this.v);
  }

  public okOrElse<E>(_errCb: () => E): Result<T, E> {
    return Result.ok(this.v);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.v);

    return this;
  }

  public and<U>(andValue: Option<U>): Option<U> {
    return andValue;
  }

  public andThen<U>(cb: (v: T) => Option<U>): Option<U> {
    return cb(this.v);
  }

  public or(_orValue: Option<T>): Option<T> {
    return this;
  }

  public xor(xorValue: Option<T>): Option<T> {
    if (xorValue.isNone()) {
      return this;
    }

    return new None<T>() as unknown as Option<T>;
  }

  public orElse(_cb: () => Option<T>): Option<T> {
    return this;
  }

  public filter(predicate: (v: T) => boolean): Option<T> {
    const result = predicate(this.v);

    if (result) {
      return this;
    }

    return new None<T>() as unknown as Option<T>;
  }

  public flatten(): Option<T> {
    if (Option.isOption(this.v)) {
      return this.v;
    }

    return this;
  }
}
