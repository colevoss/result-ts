import { Option } from './option';
import { Some } from './some';
import { None } from './none';

export function some<T>(value: T): Some<T> {
  return new Some(value);
}

export function none(): None {
  return new None();
}

export { Option, Some, None };
