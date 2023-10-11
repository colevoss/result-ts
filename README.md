# Result TS

This package provides [`Result<T, E>`](https://doc.rust-lang.org/std/result/) and [`Option<T>`](https://doc.rust-lang.org/std/option/) classes heavily inspired by Rust's standard library equivalents.

## Why

After writing some Rust code, I realized how nice the `Result` and `Option` types
are to use. I wanted to have the same powerful types in my TypeScript code.
I have no idea if these types will actually be usable, but creating this package
allowed me to learn Rust's types even better as well as improving my TypeScript skills.

Rust has some very helpful language primitives like `match` and `?` that empower
these types even further, and I've tried to capture some of the value of those
language features in this library as well.


## Docs
- [Result<T, E>](#resultt-e)
  - [and](#and)
  - [andThen](#andthen)
  - [err](#err)
  - [expect](#expect)
  - [expectErr](#expecterr)
  - [inspect](#inspect)
  - [inspectErr](#inspecterr)
  - [isErr](#iserr)
  - [isErrAnd](#iserrand)
  - [isOk](#isok)
  - [isOkAnd](#isokand)
  - [map](#map)
  - [mapOr](#mapor)
  - [mapOrElse](#maporelse)
  - [ok](#ok)
  - [or](#or)
  - [orElse](#orelse)
  - [unwrap](#unwrap)
  - [unwrapErr](#unwraperr)
  - [unwrapOr](#unwrapor)
  - [unwrapOrElse](#unwraporelse)
- [Option<T>](#optiont)
  - [and](#and-1)
  - [andThen](#andthen-1)
  - [expect](#expect-1)
  - [filter](#filter)
  - [inspect](#inspect-1)
  - [isNone](#isnone)
  - [isSome](#issome)
  - [isSomeAnd](#issomeand)
  - [map](#map-1)
  - [mapOr](#mapor-1)
  - [mapOrElse](#maporelse-1)
  - [okOr](#okor)
  - [okOrElse](#okorelse)
  - [or](#or-1)
  - [orElse](#orelse-1)
  - [unwrap](#unwrap-1)
  - [unwrapOr](#unwrapor-1)
  - [unwrapOrElse](#unwraporelse-1)
  - [xor](#xor)


## Result<T, E>

```ts
// Example Results

const okResult = new Ok('ok value');
const errResult = new Err('error value');
```

### and

```ts
and<U>(andValue: Result<U, E>): Result<U, E>;
```

Returns `andValue` if the Result is `Ok`, otherwise returns `Err` value.

**Examples**

```ts
const x = new Ok('x');
const y = new Ok('y')

const xAndY = x.and(y);
assert.equal(xAndY.unwrap(), 'y');

const x = new Err('early error');
const y = new Ok('y');

const xAndY = x.and(y);
assert.equal(x.unwrapErr(), 'early error');

const x = new Ok('x');
const y = new Err('late error');

const xAndY = x.and(y);
assert.equal(xAndY.unwrapErr(), 'late error');

const x = new Err('early error');
const y = new Err('late error');

const xAndY = x.and(y);
assert.equal(xAndY.unwrapErr(), 'early error');
```

### andThen

```ts
andThen<U>(cb: (v: T) => Result<U, E>): Result<U, E>
```

Calls `cb` if Result is `Ok`, otherwise returns `Err<E>`.

**Examples**

```ts
const x = new Ok('x');
const y = x.andThen((xVal) => {
  return new Ok(xVal + ' new')
});
assert.equal(y.unwrap(), 'x new');

const x = new Ok('x');
const y = x.andThen((xVal) => {
  return new Err('error')
});
assert.equal(y.unwrapErr(), 'error');

const x = new Err('early error'):
const y = x.andThen(() => {
  return new Ok('ok')
});
assert.equal(y.unwrapErr(), 'early error');
```

### err

```ts
err(): Option<E>
```

Converts from `Result<T, E>` to `Option<E>`

**Examples**

```ts
const x = new Err('error');
const y = x.err(); // Some('error')

assert.ok(y.isSome());
assert.equal(y.unwrap(), 'error')

const x = new Ok('ok');
const y = x.err(); // None

assert.ok(y.isNone());
```

### expect

```ts
expect(reason: string): T
```

Returns the contained value `T` if value is `Ok`.

**Throws**

Throws error if Result is `Err` with provided reason as message and `cause` as `this`

**Examples**

```ts
// Ok
const x = new Ok('ok value');

const xVal = x.expect('Should be ok value');
assert.equal(xVal, 'ok value')

// Err
const x = new Err('error value');
const xVal = x.expect('should be ok value');

// Throws:
// Error: should be ok value
//   [cause]: 'error value'
// }
```

### expectErr

```ts
expectErr(reason: string): E
```

Returns the contained `Err` value.

**Throws**

Throws contained value `T` if Result is `Ok<T>`

```ts
// Err
const x = new Err('err value');

const xVal = x.expectErr('should be err value');
assert.equal(xVal, 'err value')

// Ok
const x = new Ok('ok value')
const xVal = x.expectErr('should be err value')

// Throws 
// Error: should be error value
//   [cause]: 'ok value'
// }
```

### inspect

```ts
inspect(cb: (v: T) => void): this
```

Calls the provided function with contained value if Result is `Ok`.

Ignores callback if Result is `Err`

**Examples**

```ts
// Ok
const x = new Ok('ok value');
x.inspect((xVal) => {
  // logs "val: ok value"
  console.log("val: ", xVal)
}); // returns x

// Err
const x = new Err('err value');
x.inspect(() => {
  // is not called
});
```

### inspectErr

```ts
inspectErr(cb: (e: E) => void): this
```

Calls the provided function with contained error if Result is `Err`

Ignores callback if Result is `Ok`

**Examples**

```ts
// Err
const x = new Err('error value');
x.inspectErr((xVal) => {
  assert.equal(xVal, 'error value');
}); // returns x

// Ok
const x = new Ok('ok value');
x.inspectErr(() => {
  // is not called
})
```

### isErr

```ts
isErr(): this is Err<E>; // boolean
```

Returns `false` if Result is `Err`

**Example**

```ts
const x = new Ok();
assert.ok(!x.isErr());

const y = new Err('error');
assert.ok(y.isErr())
```

### isErrAnd

```ts
isErrAnd(cb: (v: E) => boolean): boolean
```

Returns `true` when Result is `Err` and the contained error matches predicate

**Examples**

```ts
// Ok
const x = new Err(1);
const y = x.isErrAnd((xVal) => {
  return x === 1;
});

assert.ok(y);

// Err
const x = new Ok(1);
const y = x.isErrAnd((xVal) => {
  // is not called
});
assert.ok(!y);
```

### isOk

```ts
isOk(): this is Ok<T>; // boolean
```

Returns `true` if Result is `Ok`

**Example**

```ts
const x = new Ok();
assert.ok(x.isOk())

const y = new Err('error');
assert.ok(!y.isOk())
```

### isOkAnd

```ts
isOkAnd(cb: (v: T) => boolean): boolean
```

Returns `true` when Result is Ok and the contained value matches predicate

**Examples**

```ts
// Ok
const x = new Ok(1);
const y = x.isOkAnd((xVal) => {
  return x === 1;
});
assert.ok(y);

// Err
const x = new Err(1);
const y = x.isOkAnd((xVal) => {
  // is not called
});
assert.ok(!y);
```

### map

```ts
map<U>(cb: (value: T) => U): Result<U, E>;
```

Maps `Result<T, E>` to `Result<U, E>` by applying a function to a contained `Ok`
value and ignores if `Err`.

**Examples**

```ts
const x = new Ok('ok');
const y = x.map((xVal) => {
  return xVal.length;
});
assert.equal(y.unwrap(), 2);
```

### mapErr

```ts
mapErr<F>(cb: (err: E) => F): Result<T, F>;
```

Maps a `Result<T, E>` to `Result<T, F>` by applying a funciton to a contained
`Err` value and ignores if `Ok`

```ts
// Ok
const x = new Ok('ok')
assert(x.mapErr(e => e.length).unwrap(), 'ok')


// Err
const x = new Err('err')
assert(x.mapErr(e => e.length).unwrapErr(), 3)
```

### mapOr

```ts
mapOr<U>(cb: (v: T) => U, orValue: U): U;
```

Returns the provided default if Result is `Err` otherwise applies a function
to the contained `Ok` value (if `Ok`).

**Examples**

```ts
// Ok
const x = new Ok('ok');
const y = x.mapOr((xVal) => {
  return xVal.length;
}, 10);
assert.equal(y, 2);

// Err
const x = new Err('err');
const y = x.mapOr((xVal) => {
  return xVal.length;
}, 10);
assert.equal(y, 10);
```

### mapOrElse

```ts
mapOrElse<U>(errCb: (e: E) => U, okCb: (v: T) => U): U;
```

Maps a `Result<T, E>` to `U` by applying fallback function `errCb` to a contained
`Err` value, or function `okCb` to a contained `Ok` value.

**Examples**

```ts
// Ok
const cb = (val) => val.length;

const x = new Ok('ok');
const y = x.mapOrElse(cb, cb);
assert.equal(y, 2);

// Err
const x = new Err('err');
const y = x.mapOrElse(cb, cb);
assert.equal(y, 3);
```

### ok

```ts
ok(): Option<T>
```

Converts from `Result<T, E>` to `Option<T>`. `Ok<T>` is converted to `Some<T>` and
`Err<E>` is converted to `None`.

**Examples**

```ts
// Ok
const x = new Ok('ok val');
const y = x.ok();
assert.ok(y.isSome());
assert.equal(y.unwrap(), 'ok val'):

// Err
const x = new Err('err val');
const y = x.ok();
assert.ok(y.isNone());
```

### or

```ts
or<F>(orValue: Result<T, F>): Result<T, F>
```

Returns `orValue` if Result is `Err` otherwise returns `Ok`

**Examples**

```ts
// Ok or Err
const x = new Ok('ok');
const y = new Err('late error');
const xOrY = x.or(y);
assert.ok(xOrY.isOk());
assert.equal(xOrY.unwrap(), 'ok');

// Err or Ok
const x = new Err('early error');
const y = new Ok('ok');
const xOrY = x.or(y);
assert.ok(xOrY.isOk());
assert.equal(xOrY.unwrap(), 'ok');

// Err or Err
const x = new Err('early error');
const y = new Err('late error');
const xOrY = x.or(y);
assert.ok(xOrY.isErr());
assert.equal(xOrY.unwrapErr(), 'late error');

// Ok or Ok
const x = new Ok('ok');
const y = new Ok('late ok');
const xOrY = x.or(y);
assert.ok(xOrY.isOk());
assert.equal(xOrY.unwrap(), 'ok');
```

### orElse

```ts
orElse<F>(cb: (e: E) => Result<T, F>): Result<T, F>;
```

Calls `cb` if Result is `Err`, otherwise returns `Ok`

**Examples**

```ts
const o = new Ok<number, number>(2);
const e = new Err<number, number>(3);
const sq = (x: number) => new Ok<number, number>(x * x);
const createErr = (x: number) => new Err<number, number>(x * 10);

equal(o.orElse(sq).unwrap(), 2);
equal(o.orElse(createErr).unwrap(), 2);
equal(e.orElse(sq).unwrap(), 9);
equal(e.orElse(createErr).unwrapErr(), 30);
```

### unwrap

```ts
unwrap(): T
```

If value is `Ok<T>` returns `T`.

**Throw**

Throws error if value is `Err`

**Examples**

```ts
// Ok
const x = new Ok('ok val');
assert.equal(x.unwrap(), 'ok val');

// Err
const x = new Err('err val');

x.unwrap()
// Throws
// 'err val'
```

### unwrapErr

```ts
unwrapErr(): E
```

If Result is `Err` returns E.

**Throws**

Throws error if value is Ok

**Examples**

```ts
// Err
const x = new Err('err val');
assert.equal(x.unwrapErr(), 'err val');


// Ok
const x = new Ok('ok val')
x.unwrapErr();
// Throws
// 'ok val'
```

### unwrapOr

```ts
unwrapOr(orValue: T): T
```

Returns the contained `Ok` value or provided default

**Examples**

```ts
// Ok
const x = new Ok(1);
assert.equal(x.unwrapOr(0), 1);

// Err
const x = new Err('error');
assert.equal(x.unwrapOr(0), 0);
```

### unwrapOrElse

```ts
unwrapOrElse(cb: (e: E) => T): T
```

Returns the contained `Ok` value or computes it from callback

```ts
const cb = (err) => 'or else';

// Ok
const x = new Ok('ok');
assert.equal(x.unwrapOrElse(cb), 'ok')

// Err
const x = new Err('ok');
assert.equal(x.unwrapOrElse(cb), 'or else')
```

## Option<T>

```ts
// Example Option

const someOption = new Some('some value');
const noneOption = new None();
```

### and

```ts
and<U>(andValue: Option<U>): Option<U>;
```

Returns `andValue` if the Result is `Ok`, otherwise returns `Err` value.

**Examples**

```ts
// Some and None
const x = new Some(1);
const y = new None();
assert.ok(x.and(y).isNone());

// None and Some
const x = new None();
const y = new Some(1);
assert.ok(x.and(y).isNone())

// Some and Some
const x = new Some(1);
const y = new Some(2);
assert.equal(x.and(y).unwrap(), 2);

// None and None
const x = new None();
const y = new None();
assert.ok(x.and(y).isNone());
```

### andThen

```ts
andThen<U>(cb: (v: T) => Option<U>): Option<U>
```

Returns `None` if Option is `None`, otherwise calls `cb` with contained value and
returns result.

**Example**

```ts
// Some and Some
const x = new Some('some');
const y = x.andThen((xVal) => new Some(xVal + 'thing'));
assert.equal(y.unwrap(), 'something');

// Some and None
const x = new Some('some');
const y = x.andThen((xVal) => new None());
assert.ok(y.isNone());

// None and Some
const x = new None();
const y = x.andThen(() => new Some('some'));
assert.ok(y.isNone());

// None and None
const x = new None();
const y = x.andThen(() => new None());
assert.ok(y.isNone());
```

### expect

```ts
expect(reason: string): T
```

Returns the contained valued `T` if value is `Some`

**Throw**

Throws error is Option is `None` with provided reason as message.

**Examples**

```ts
// Ok
const x = new Some('some')
assert.equal(x.expect('should be some'), 'ok');

// Err
const x = new None()
x.expect('should be some'): // Throws
// Err [ResultError]: should be some
//   type: 'ResultError',
//   error: 'should be some'
// }
```

### filter

```ts
filter(predicate: (v: T) => boolean): Option<T>
```

Returns `None` if the option is `None`, otherwise calls `predicate` with the contained
value and returns:
* `Some<T>` if `predicate` returns `true`.
* `None` if `predicate` returns `false`.

**Examples**

```ts
const isEven = (n) => n % 2 === 0

const odd = new Some(1):
assert.ok(odd.filter(isEven).isNone());

const even = new Some(2);
assert.ok(even.filter(isEven).isSome());
assert.equal(even.filter(isEven).unwrap(), 2);

const none = new None();
assert.ok(none.filter(isEven).isNone());
```

### inspect

```ts
inspect(cb: (v: T) => void): this
```

Calls the provided `cb` with contained value (if `Some`)

**Examples**

```ts
// Some
const x = new Some('some val')
x.inspect((someVal) => {
  // logs "val: some val"
  console.log('val:', someVal);
});

// None
const x = new None()
x.inspect((someVal) => {
  // not called
});
```

### isNone

```ts
isNone(): this is None;
```

Returns `true` if Option is `None`

**Examples**

```ts
// Some
const x  = new Some('some');
assert.ok(!x.isNone());

// None
const x = new None();
assert.ok(x.isNone());
```

### isSome

```ts
isSome(): this is Some<T>
```

Returns `true` if Option is `Some`

**Examples**

```ts
// Some
const x = new Some('some');
assert.ok(x.isSome());

// None
const x = new None();
assert.ok(!x.isSome());
```

### isSomeAnd

```ts
isSomeAnd(cb: (v: T) => boolean): boolean
```

If type is `Some<T>` returns value returned by the given callback.
If type is `None`, returns false.

**Examples**

```ts
// Some
const isOne = (n) => n === 1;
const x = new Some(1);
const y = new Some(2);
assert.ok(x.isSomeAnd(isOne));
assert.ok(!y.isSomeAnd(isOne));

// None
const x = new None();
assert.ok(!x.isSomeAnd(isOne));
```

### map

```ts
map<U>(cb: (value: T) => U): Option<U>
```

Maps `Option<T>` to `Option<U>` by applying a function to a contained `Option` value
and ignores `None`.

**Examples**

```ts
const len = (s) => s.length;

// Some
const x = new Some('some');
assert.equal(x.map(len).unwrap(), 4);

// None
const y = new None();
assert.ok(y.map(len).isNone());
```

### mapOr

```ts
mapOr<U>(cb: (value: T) => U, orValue: U): U;
```

Returns the provided default if Option is `None` otherwise applies a function to
the contained `Option` value (if `Some`).

**Examples*

```ts
const len = (s) => s.length;

// Some
const x = new Some('some');
assert.equal(x.mapOr(len, 0), 4);

// None
const x = new None();
assert.equal(x.mapOr(len, 0), 0);
```

### mapOrElse

```ts
mapOrElse<U>(someCb: (v: T) => U, noneCb: () => U): U
```

Maps an `Option<T>` to `U` by calling a fallback function `noneCb`, or `someCb`
to a contained `Some` value

**Examples**

```ts
const len = (s) => s.length;
const noneLen = () => 10000;

// Some
const x = new Some('some');
assert.equal(x.mapOrElse(len, noneLen), 4);

const x = new None();
assert.equal(x.mapOrElse(len, noneLen), 10000);
```

### okOr

```ts
okOr<E>(errValue: E): Result<T, E>
```

Transforms the `Option<T>` into `Result<T, E>`, mapping `Some<T>` to `Ok<T>` and
`None` to `Err<E>`.

**Examples**

```ts
// Some
const x = new Some('some');
const res = x.okOr('bad');
assert.ok(res.isOk());
assert.equal(res.unwrap(), 'some');

// None
const x = new None();
const res = x.okOr('bad')
assert.ok(res.isErr());
assert.equal(res.unwrapErr(), 'bad');
```

### okOrElse

```ts
okOrElse<E>(errCb: () => E): Result<T, E>
```

Transforms the `Option<T>` into `Result<T, E>`, mapping `Some<T>` to `Ok<T>` and
`None` to `Err<errCb()>`.

**Examples**

```ts
const orElseZero = () => 0;

// Some
const x = new Some(1);
const res = x.okOrElse(orElseZero);
assert.ok(x.isOk());
assert.equal(x.unwrap(), 1);

// None
const x = new None();
const res = x.okOrElse(orElseZero);
assert.ok(x.isErr());
assert.equal(x.unwrapErr(), 0);
```

### or

```ts
or(orValue: Option<T>): Option<T>
```

Returns the option if it contains a value, otherwise returns `orValue`.

**Examples**

```ts
// Some or Some
const x = new Some(1);
const y = new Some(2);
const or = x.or(y);

assert.equal(x.unwrap(), 1);

// Some or None
const x = new Some(1);
const y = new None();
const or = x.or(y);

assert.equal(x.unwrap(), 1);

// None or Some
const x = new None();
const y = new Some(2);
const or = x.or(y);

assert.equal(x.unwrap(), 2);

// None or None
const x = new None();
const y = new None();
const or = x.or(y);

assert.ok(x.isNone());
```

### orElse

```ts
orElse(cb: () => Option<T>): Option<T>
```

Returns the option if it contains a value, otherwise calls `cb` and returns the result.

**Examples**

```ts
const orNone = () => new None();
const orSome = () => new Some(10);

// Some or Some
const x = new Some(1);
const orElse = x.orElse(orSome);
assert.equal(x.unwrap(), 1);

// Some or None
const x = new Some(1);
const orElse = x.orElse(orNone);
assert.equal(x.unwrap(), 1);

// None or Some
const x = new None(1);
const orElse = x.orElse(orSome);
assert.equal(x.unwrap(), 10);

// None or Some
const x = new None(1);
const orElse = x.orElse(orNone);
assert.ok(x.isNone());
```

### unwrap

```ts
unwrap(): T
```

If value is `Some<T>` returns `T`.

**Throws**

Throws error if Option is `None`

**Examples**

```ts
// Some
const x = new Some('some value');
assert.equal(x.unwrap(), 'some value');

// None
const x = new None();
x.unwrap(); // Throws
// Err [ResultError]: Option value is None
//   type: 'ResultError',
//   error: 'Option value is None'
// }
```

### unwrapOr

```ts
unwrapOr(orValue: T): T;
```

If value is `Some<T>` returns `T`.
If value is `None` returns given `orValue`

**Examples**

```ts
// Some
const x = new Some('some value');
assert.equal(x.unwrapOr('none value'), 'some value');

// None
const x = new None();
assert.equal(x.unwrapOr('none value'), 'none value');
```

### unwrapOrElse

```ts
unwrapOrElse(cb: () => T): T
```

Returns the contained `Some` value or computes it from the given callback.

**Examples**

```ts
const orElse = () => 'or else';

// Some
const x = new Some('some');
assert.equal(x.unwrapOrElse(orElse), 'some')

// None
const x = new None();
assert.equal(x.unwrapOrElse(orElse), 'or else')
```

### xor

```ts
xor(xorValue: Option<T>): Option<T>
```

Returns `Some` if exactly one of `this` or `xorValue` is `Some`, otherwise returns
`None`

```ts
// Some xor Some
const x = new Some(1);
const y = new Some(2);
const xor = x.xor(y);
assert.ok(x.isNone());

// Some xor None
const x = new Some(1);
const y = new None();
const xor = x.xor(y);
assert.ok(x.isSome());
assert.equal(x.unwrap(), 1);

// Some xor None
const x = new None();
const y = new Some(2);
const xor = x.xor(y);
assert.ok(x.isSome());
assert.equal(x.unwrap(), 2);

// None xor None
const x = new None();
const y = new Some(2);
const xor = x.xor(y);
assert.ok(x.isNone());
```
