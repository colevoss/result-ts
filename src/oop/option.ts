import { ResultOption } from './types';

abstract class IOption<T> implements ResultOption<T, never> {
  protected hasValue: boolean;

  constructor(hasValue: boolean) {
    this.hasValue = hasValue;
  }

  public isSome(): this is Some<T> {
    return this.hasValue;
  }

  public isNone(): this is None<T> {
    return !this.hasValue;
  }

  public unwrap(): T {
    if (this.isSome()) {
      return this.value;
    } else if (this.isNone()) {
      throw new Error('Value is None');
    }
  }

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

  public map<U>(cb: (value: T) => U): Some<U> {
    if (this.isSome()) {
      return some(cb(this.value));
    } else if (this.isNone()) {
      throw new Error('Value is None');
    }
  }
}

export class Some<T> extends IOption<T> {
  public value: T;

  constructor(value: T) {
    super(true);
    this.value = value;
  }
}

export class None<T> extends IOption<T> {
  constructor() {
    super(false);
  }
}

export type Option<T> = Some<T> | None<T>;

export function some<T>(value: T): Some<T> {
  return new Some(value);
}

export function none<T>(): None<T> {
  return new None();
}
