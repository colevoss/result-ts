/* export interface Matcher<T, E, A, B> { */
/*   ok(value: T): A; */
/*   err(err: E): B; */
/* } */

export interface ResultOption<T, E> {
  unwrap(): T;
  unwrapOr(orValue: T): T;
  expect(reason: string): T;
}
