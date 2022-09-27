import { Result, isOk } from './result';

/**
 * If result is Ok, return the value of the result. Otherwise throw
 * the error of the Err type
 */
export function unwrap<T, E>(res: Result<T, E>): T {
  if (isOk(res)) {
    return res.value;
  } else {
    throw res.error;
  }
}

/**
 * If result is Ok return result value. Otherwise return the given
 * orValue
 */
export function unwrapOr<T, E>(res: Result<T, E>, orValue: T): T {
  if (isOk(res)) {
    return res.value;
  } else {
    return orValue;
  }
}
