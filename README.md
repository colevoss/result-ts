# Result TS

This package provides [`Result<T, E>`](https://doc.rust-lang.org/std/result/) and [`Option<T>`](https://doc.rust-lang.org/std/option/) classes heavily inspired by
Rust's standard library equivalents.

## Why

After writing some Rust code, I realized how nice the `Result` and `Option` types
are to use. I wanted to have the same powerful types in my TypeScript code.
I have no idea if these types will actually be usable, but creating this package
allowed me to learn Rust's types even better as well as improving my TypeScript skills.

Rust has some very helpful language primitives like `match` and `?` that empower
these types even further, and I've tried to capture some of the value of those
language features in this library as well.

## `Result<T, E>`

```ts
import { Result } from 'result-ts';

// Ok
const result = Result.ok(1); // Creates an Ok<number> type
assert.ok(result.isOk());

// unwrap
const unwrappedValue = result.unwrap();
assert.equal(unwrappedValue, 1);

// expect
const expectedValue = result.expect('Should be 1');
assert.equal(expectedValue, 1);

// Err
const errResult = Result.err('Big bad error'); // Creates an Err<string> value

assert.ok(errResult.isErr()); // Passes
assert.ok(errResult.isOk()); // Fails

// unwrap
errResult.unwrap(); // Throws error
errResult.expect('Should be something'); // Throws descriptive error
```

## `Option<T>`

```ts
import { Opiton } from 'result-ts';

const some = Option.some(1);
assert.ok(some.isSome());

// unwrap
const unwrapped = some.unwrap();
assert.equal(unwrapped, 1);

// expect
const expected = some.expect('Should be some 1');
assert.equal(expected, 1);

const none = Option.none();
assert.ok(none.isNone()); // Passes
assert.ok(none.isSome()); // Fails

none.unwrap(); // Throws
none.expect('Should be some 1'); // Throws more descriptive error
```

## Todo

- [ ] More Docs
