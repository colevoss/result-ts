import { ok, err } from './result';

export function wrap<T, A extends unknown[]>(fn: (...args: A) => T) {
  return (...args: A) => {
    try {
      const value = fn(...args);
      return ok(value);
    } catch (e) {
      return err(e);
    }
  };
}

export function asyncWrap<T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>,
) {
  return async (...args: A) => {
    try {
      const value = await fn(...args);
      return ok(value);
    } catch (e) {
      return err(e);
    }
  };
}
