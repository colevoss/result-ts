import { ok, err, wrap, wrapAsync, Ok, Err } from '../src';
import { ResultType } from '../src/result';

describe('ok', () => {
  test('Returns Ok result', () => {
    const result = ok();

    expect(result.isOk()).toBe(true);
  });
});

describe('err', () => {
  test('Returns Ok result', () => {
    const result = err('err');

    expect(result.isErr()).toBe(true);
  });
});

describe('ok', () => {
  test('Returns Ok value', () => {
    const result = ok();

    expect(result.isOk()).toBe(true);
  });
});

describe('err', () => {
  test('Returns Ok value', () => {
    const result = err('');

    expect(result.isErr()).toBe(true);
  });
});

describe('Ok', () => {
  test('type is Ok', () => {
    const result = new Ok();

    expect(result.type).toBe(ResultType.Ok);
  });

  describe('constructor', () => {
    test('Does not need value', () => {
      const result = new Ok();

      expect(result.isOk()).toBe(true);
    });
  });

  describe('isOk', () => {
    test('isOk is true', () => {
      const result = ok(1);

      expect(result.isOk()).toBe(true);
    });
  });

  describe('isOkAnd', () => {
    test('Is true if predicate matches', () => {
      const result = ok(1);
      const isOne = result.isOkAnd((v) => v === 1);
      const isNotOne = result.isOkAnd((v) => v !== 1);

      expect(isOne).toBe(true);
      expect(isNotOne).toBe(false);
    });
  });

  describe('isErr', () => {
    test('isErr is false', () => {
      const result = ok(1);

      expect(result.isErr()).toBe(false);
    });
  });

  describe('isErrAnd', () => {
    test('Does not call callback', () => {
      expect.assertions(1);

      const result = ok(1);

      const and = result.isErrAnd(() => {
        expect(true).toBe(true);
        return true;
      });

      expect(and).toBe(false);
    });
  });

  describe('unwrap', () => {
    test('Returns value', () => {
      const result = ok('ok value');

      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('unwrapOr', () => {
    test('Returns value', () => {
      const result = ok('ok value');

      expect(result.unwrapOr('not value')).toBe('ok value');
    });
  });

  describe('expect', () => {
    test('Returns value', () => {
      const result = ok('ok value');

      expect(result.expect(`shouldn't trigger`)).toBe('ok value');
    });
  });

  describe('match', () => {
    test('Calls ok callback', () => {
      expect.assertions(2);

      const result = ok('ok value');

      const matchResult = result.match(
        (v) => {
          expect(v).toBe('ok value');
          return v;
        },
        (e) => {
          return e;
        },
      );

      expect(matchResult).toBe('ok value');
    });
  });

  describe('map', () => {
    test('Returns mapped value', () => {
      expect.assertions(3);
      const result = ok('ok');
      const mapped = result.map((v) => {
        expect(v).toBe('ok');
        return v.length;
      });

      expect(mapped.isOk()).toBe(true);
      expect(mapped.unwrap()).toBe(2);
    });
  });

  describe('mapOr', () => {
    test('Returns mapped value', () => {
      const result = ok('ok');
      const mapped = result.mapOr((v) => v.length, 0);

      expect(mapped).toBe(2);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      const result = ok('ok');
      const mapped = result.mapOrElse(
        (v) => v.length,
        () => 0,
      );

      expect(mapped).toBe(2);
    });
  });

  describe('ok', () => {
    test('Returns Option<T>', () => {
      const result = ok('ok');
      const okResult = result.ok();

      expect(okResult.isSome()).toBe(true);
      expect(okResult.unwrap()).toBe('ok');
    });
  });

  describe('err', () => {
    test('Returns None', () => {
      const result = ok('ok');
      const err = result.err();

      expect(err.isNone()).toBe(true);
    });
  });

  describe('inspect', () => {
    test('Calls inspect callback', () => {
      expect.assertions(2);
      const result = ok('ok');

      expect(
        result
          .inspect((v) => {
            expect(v).toBe('ok');
          })
          .unwrap(),
      ).toBe('ok');
    });
  });

  describe('inspectErr', () => {
    test('Does not call callback', () => {
      expect.assertions(1);

      const result = ok('ok');

      result.inspectErr(() => {
        expect(true).toBe(true);
      });

      expect(1).toBe(1);
    });
  });

  describe('or', () => {
    test('returns self if is Ok and given Ok', () => {
      const res = new Ok('value');
      const other = new Ok(1);

      const orValue = res.or(other);

      expect(orValue.unwrap()).toBe('value');
    });

    test('returns self if is Ok and given Err', () => {
      const res = new Ok('value');
      const other = new Err(1);

      const orValue = res.or(other);

      expect(orValue.unwrap()).toBe('value');
    });
  });

  describe('and', () => {
    test('returns and value if it is Ok', () => {
      const res = new Ok('original');
      const and = new Ok('and');

      const andValue = res.and(and);

      expect(andValue.unwrap()).toBe('and');
    });

    test('returns and value if it is Err', () => {
      const res = new Ok('original');
      const andErr = new Err('err');

      const andValue = res.and(andErr);
      expect.assertions(1);

      andValue.inspectErr((err) => {
        expect(err).toBe('err');
      });
    });
  });
});

describe('Err', () => {
  test('type is Err', () => {
    const result = new Err('');

    expect(result.type).toBe(ResultType.Err);
  });

  describe('isErr', () => {
    test('is true', () => {
      const result = err('Err');

      expect(result.isErr()).toBe(true);
    });
  });

  describe('isOk', () => {
    test('is false', () => {
      const result = err('Err');

      expect(result.isOk()).toBe(false);
    });
  });

  describe('unwrap', () => {
    test('throws error', () => {
      const result = err('err');

      expect(() => result.unwrap()).toThrow('err');
    });

    test('Throws error with default message', () => {
      const result = err(1);

      expect(() => result.unwrap()).toThrow('Result Error');
    });
  });

  describe('unwrapOr', () => {
    test('Returns or value', () => {
      const result = err('err');

      expect(result.unwrapOr('or value')).toBe('or value');
    });
  });

  describe('expect', () => {
    test('Returns throws reason error', () => {
      const result = err('ok value');

      const expectThrow = () => {
        result.expect('Should throw');
      };

      expect(expectThrow).toThrowError('Should throw');
    });
  });

  describe('match', () => {
    test('Calls err callback', () => {
      expect.assertions(2);

      const result = err('err value');

      const matchResult = result.match(
        (v) => {
          return v;
        },
        (e) => {
          expect(e.error).toBe('err value');
          return 'error callback value';
        },
      );

      expect(matchResult).toBe('error callback value');
    });
  });

  describe('map', () => {
    test('Returns error', () => {
      const result = err('err');
      const mapped = result.map(() => 'not called');

      expect(mapped.isErr()).toBe(true);
      /* expect(mapped.unwrap()).toBe(2); */
    });
  });

  describe('mapOr', () => {
    test('Returns mapped value', () => {
      const result = err('err');
      const mapped = result.mapOr(() => 2, 0);

      expect(mapped).toBe(0);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      expect.assertions(2);
      const result = err('ok');
      const mapped = result.mapOrElse(
        () => 1,
        () => {
          expect(true).toBe(true);
          return 0;
        },
      );

      expect(mapped).toBe(0);
    });
  });

  describe('ok', () => {
    test('Returns None', () => {
      const result = err('');
      const okResult = result.ok();

      expect(okResult.isNone()).toBe(true);
    });
  });

  describe('err', () => {
    test('Returns Option with Err result', () => {
      const result = err('err');
      const testErr = result.err();

      expect(testErr.isSome()).toBe(true);
      expect(testErr.unwrap()).toBe('err');
    });
  });

  describe('isOkAnd', () => {
    test('Returns false', () => {
      const result = err('doesnt matter');
      const isOk = result.isOkAnd((v) => v === 1);

      expect(isOk).toBe(false);
    });
  });

  describe('isErrAnd', () => {
    test('Returns result from callback', () => {
      expect.assertions(2);

      const result = err(1);

      const and = result.isErrAnd((err) => {
        expect(err).toBe(1);
        return err === 1;
      });

      expect(and).toBe(true);
    });
  });

  describe('inspect', () => {
    test('Does not call inspect callback', () => {
      expect.assertions(1);
      const result = err('ok');

      result.inspect((v) => {
        expect(v).toBe('ok');
      });

      expect(result.isErr()).toBe(true);
    });
  });

  describe('inspectErr', () => {
    test('Calls callback', () => {
      expect.assertions(1);

      const result = err('err');

      result.inspectErr((err) => {
        expect(err).toBe('err');
      });
    });
  });

  describe('or', () => {
    test('Returns or value if it is Ok', () => {
      const err = new Err('err');
      const ok = new Ok('ok');

      const or = err.or(ok);

      expect(or.unwrap()).toBe('ok');
    });

    test('Returns or value if it is Err', () => {
      const err = new Err('err');
      const otherErr = new Err('or');
      expect.assertions(1);

      const orErr = err.or(otherErr);

      orErr.inspectErr((err) => expect(err).toBe('or'));
    });
  });

  describe('and', () => {
    test('Returns self', () => {
      const err = new Err('err');
      const ok = new Ok('ok');

      const andValue = err.and(ok);

      expect.assertions(1);

      andValue.inspectErr((err) => expect(err).toBe('err'));
    });
  });
});

describe('Result.wrap', () => {
  const testFn = (pass: boolean) => {
    if (!pass) {
      throw new Error('error');
    }

    return 1;
  };

  test('Wrapped function returns Result (ok)', () => {
    const wrapped = wrap(testFn);
    const result = wrapped(true);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(1);
  });

  test('Wrapped function returns Result (err)', () => {
    const wrapped = wrap(testFn);
    const result = wrapped(false);

    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError('error');
  });
});

describe('Result.wrapAsync', () => {
  const testFn = async (pass: boolean) => {
    if (pass) {
      return 1;
    }

    throw new Error('rejected');
  };

  test('Wrapped async function returns result (ok)', async () => {
    const wrapped = wrapAsync(testFn);
    const result = await wrapped(true);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(1);
  });

  test('Wrapped async function returns result (err)', async () => {
    const wrapped = wrapAsync(testFn);
    const result = await wrapped(false);

    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError('rejected');
  });
});
