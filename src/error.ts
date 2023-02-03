import { Err } from './result';

export class ResultError<T, E> extends Error {
  public err: Err<T, E>;
  constructor(message: string, err?: Err<T, E>) {
    super(message);
    this.name = 'ResultError';
    this.err = err;
  }
}
