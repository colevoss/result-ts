interface IResult<T, E> {
  ok: boolean;
  // value: T;
  // error: E;
}

interface Ok<T, E = undefined> extends IResult<T, E> {
  ok: true;
  value: T;
  error?: E;
}

interface Err<T, E> extends IResult<T, E> {
  ok: false;
  error: E;
  value?: T;
}

type Result<T, E> = Ok<T> | Err<T, E>;

class R {
  static Ok<T>(v: T): Ok<T> {
    return {
      ok: true,
      value: v,
      error: undefined,
    };
  }

  static Err<T, E>(err: E): Err<T, E>;
  static Err<T, E>(err: E, v: T): Err<T, E>;
  static Err<T, E>(err: E, v?: T): Err<T, E> {
    const e: Err<T, E> = {
      ok: false,
      error: err,
    };

    if (v) {
      e.value = v;
    }

    return e;
  }
}

function Ok<T>(v: T): Ok<T> {
  return {
    ok: true,
    value: v,
    error: undefined,
  };
}

function Err<T, E>(err: E): Err<T, E>;
function Err<T, E>(err: E, v: T): Err<T, E>;
function Err<T, E>(err: E, v?: T): Err<T, E> {
  const e: Err<T, E> = {
    ok: false,
    error: err,
  };

  if (v) {
    e.value = v;
  }

  return e;
}

interface Matcher<T, E, A, B> {
  ok(value: T): A;
  err(err: Err<T, E>): B;
}

function match<T, E, A, B>(res: Result<T, E>, matches: Matcher<T, E, A, B>) {
  if (IsOk(res)) {
    return matches.ok(res.value);
  } else {
    return matches.err(res);
  }
}

function unwrap<T, E>(res: Result<T, E>): T {
  if (IsOk(res)) {
    return res.value;
  } else {
    throw res.error;
  }
}

function wrap<T, A extends any[]>(fn: (...args: A) => T) {
  return (...args: A) => {
    try {
      const value = fn(...args);

      return Ok(value);
    } catch (e) {
      return Err(e);
    }
  };
}

function IsOk<T, E>(result: IResult<T, E>): result is Ok<T, E> {
  return result.ok;
}

function IsErr<T, E>(result: IResult<T, E>): result is Err<T, E> {
  return !result.ok;
}

const zz = () => new Test('hwody');

class Test {
  constructor(public value: string) {}
}

const x = (): Result<Test, string> => {
  return Ok(new Test('my test value'));
};

const y = (): Result<string, String> => {
  return Err('NOPE');
};

class MyTest<T, E> {
  ok(v: E) {
    return v;
  }

  err(res: Err<T, E>) {
    return res.error;
  }
}

const z = async () => {
  const res = x();

  // const a = await match(res, {
  //   async ok(value) {
  //     return value;
  //   },
  //   err: ({ error }) => {
  //     return error;
  //   },
  // });
  const wrapped = wrap(zz)();

  console.log(wrapped);
  const unwrapped = unwrap(wrapped);

  const c = match(res, new MyTest());

  const b = unwrap(res);
};

z();
