import { Result, Res } from './result';
import { Ok } from './ok';
import { Err } from './err';

export function ok<T>(v: T = null): Ok<T> {
  return new Ok(v);
}

export function err<E>(err: E): Err<E> {
  return new Err(err);
}

export function wrap<F extends (...args: any[]) => any>(fn: F) {
  return (...args: Parameters<typeof fn>): Result<ReturnType<F>, unknown> => {
    try {
      const value = fn(...args);
      return ok(value);
    } catch (e) {
      return err(e.message);
    }
  };
}

export function wrapAsync<F extends (...args: any[]) => Promise<any>>(
  fn: F,
): (
  ...args: Parameters<typeof fn>
) => Promise<Result<Awaited<ReturnType<F>>, unknown>> {
  return async (
    ...args: Parameters<typeof fn>
  ): Promise<Result<Awaited<ReturnType<F>>, unknown>> => {
    try {
      const value = await fn(...args);
      return ok(value);
    } catch (e) {
      return err(e.message);
    }
  };
}

export { Result, Ok, Err, Res };
