import { Option, OptionType } from './option';
import { Some } from './some';
import { Err, err } from '../result';

export class None implements Option<never> {
  public type = OptionType.None;

  public isSome(): this is Some<never> {
    return false;
  }

  public isNone(): this is None {
    return true;
  }

  public isSomeAnd(_cb: (v: never) => boolean): boolean {
    return false;
  }

  public unwrap(): never {
    throw err('Option value is None');
  }

  public unwrapOr<T>(orValue: T): T {
    return orValue;
  }

  public unwrapOrElse<T>(cb: () => T): T {
    return cb();
  }

  public match<A, B>(_someCb: (value: never) => A, noneCb: () => B): B {
    return noneCb();
  }

  public expect(reason: string): never {
    throw err(reason);
  }

  public map<U>(_cb: (value: never) => U): Option<U> {
    return new None();
  }

  public mapOr<U>(_cb: (value: never) => U, orValue: U): U {
    return orValue;
  }

  public mapOrElse<U>(_someCb: (v: never) => U, noneCb: () => U): U {
    return noneCb();
  }

  public okOr<E>(errValue: E): Err<E> {
    return err(errValue);
  }

  public okOrElse<E>(errCb: () => E): Err<E> {
    return err(errCb());
  }

  public inspect(_cb: (v: never) => void): this {
    return this;
  }

  public and<U>(_andValue: Option<U>): Option<U> {
    return this;
  }

  public andThen<U>(_cb: (v: never) => Option<U>): Option<U> {
    return this;
  }

  public or<T>(orValue: Option<T>): Option<T> {
    return orValue;
  }

  public xor<T>(xorValue: Option<T>): Option<T> {
    if (xorValue.isSome()) {
      return xorValue;
    }

    return this;
  }

  public orElse<T>(cb: () => Option<T>): Option<T> {
    return cb();
  }

  public filter(_predicate: (v: never) => boolean): Option<never> {
    return this;
  }
}
