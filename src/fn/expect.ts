import { Result, isOk } from './result';

export function expect<T, E>(res: Result<T, E>, reason: string): T {
  if (isOk(res)) {
    return res.value;
  } else {
    if (res.error instanceof Error) {
      throw new Error(`${reason}: ${res.error.name} ${res.error.message}`);
    }

    throw new Error(reason);
  }
}
