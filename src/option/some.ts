import { IOption, Option, OptionType } from './option';
import { Result } from '../result';
import { None } from './none';

export class Some<T> implements IOption<T> {
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

  public unwrapOrElse(_cb: () => T): T {
    return this.value;
  }

  public match<U>(someCb: (value: T) => U, noneCb: () => U): U {
    return someCb(this.value);
  }

  public expect(_reason: string): T {
    return this.value;
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    return new Some(cb(this.value));
  }

  public mapOr<U>(cb: (value: T) => U, _orValue: U): U {
    return cb(this.value);
  }

  public mapOrElse<U>(someCb: (v: T) => U, _noneCb: () => U): U {
    return someCb(this.value);
  }

  public okOr<E>(errValue: E): Result<T, E> {
    return Result.ok(this.value);
  }

  public okOrElse<E>(_errCb: () => E): Result<T, E> {
    return Result.ok(this.value);
  }

  public inspect(cb: (v: T) => void): this {
    cb(this.value);

    return this;
  }

  public and<U>(andValue: Option<U>): Option<U> {
    return andValue;
  }

  public andThen<U>(cb: (v: T) => Option<U>): Option<U> {
    return cb(this.value);
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
    const result = predicate(this.value);

    if (result) {
      return this;
    }

    return new None<T>() as unknown as Option<T>;
  }
}
