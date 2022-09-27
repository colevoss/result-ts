import { isOk, isErr, Result, Err } from './result';

interface Matcher<T, E, A, B> {
  ok(value: T): A;
  err(err: Err<T, E>): B;
}

export function match<T, E, A, B>(
  res: Result<T, E>,
  matches: Matcher<T, E, A, B>,
) {
  if (isOk(res)) {
    return matches.ok(res.value);
  } else {
    return matches.err(res);
  }
}
