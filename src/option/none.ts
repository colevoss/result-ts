import { IOption, Option, OptionType } from './option';
import { Some } from './some';
import { Result, Err } from '../result';

export class None<T> implements IOption<T> {
  public type = OptionType.None;

  public isSome(): this is Some<T> {
    return false;
  }

  public isNone(): this is None<T> {
    return true;
  }

  public isSomeAnd(cb: (v: T) => boolean): boolean {
    return false;
  }

  public unwrap(): never {
    // throw Result.err('Option value is None');
    throw this;
  }

  public unwrapOr(orValue: T): T {
    return orValue;
  }

  public unwrapOrElse(cb: () => T): T {
    return cb();
  }

  public match<U>(someCb: (value: T) => U, noneCb: () => U): U {
    return noneCb();
  }

  public expect(reason: string): never {
    throw Result.err(reason);
  }

  public map<U>(cb: (value: T) => U): Option<U> {
    return new None<U>() as unknown as Option<U>;
  }

  public mapOr<U>(cb: (value: T) => U, orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U {
    return noneCb();
  }

  public okOr<E>(errValue: E): Result<T, E> {
    return Result.err(errValue);
  }

  public okOrElse<E>(errCb: () => E): Result<T, E> {
    return Result.err(errCb());
  }

  public inspect(cb: (v: T) => void): this {
    return this;
  }

  public and<U>(andValue: Option<U>): Option<U> {
    return this as unknown as Option<U>;
  }

  public andThen<U>(cb: (v: T) => Option<U>): Option<U> {
    return this as unknown as Option<U>;
  }

  public or<T>(orValue: Option<T>): Option<T> {
    return orValue;
  }

  public xor(xorValue: Option<T>): Option<T> {
    if (xorValue.isSome()) {
      return xorValue;
    }

    return this as unknown as Option<T>;
  }

  public orElse<T>(cb: () => Option<T>): Option<T> {
    return cb();
  }

  public filter(predicate: (v: T) => boolean): Option<T> {
    return this as unknown as Option<T>;
  }

  public flatten(): Option<T> {
    return this;
  }
}
