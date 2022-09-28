export interface ResultOption<T> {
  unwrap(): T;
  unwrapOr(orValue: T): T;
  expect(reason: string): T;
}
