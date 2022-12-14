import { Result, ok, err, Ok } from '../src';

describe('Result.ok', () => {
  test('Returns Ok result', () => {
    const result = Result.ok();

    expect(result.isOk()).toBe(true);
  });
});

describe('Result.err', () => {
  test('Returns Ok result', () => {
    const result = Result.err('err');

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
    const result = Result.ok();

    expect(result.type).toBe(Result.Ok);
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
      const result = Result.ok(1);
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
      const result = Result.ok('ok');
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
      const result = Result.ok('ok');
      const mapped = result.mapOr(0, (v) => v.length);

      expect(mapped).toBe(2);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      const result = Result.ok('ok');
      const mapped = result.mapOrElse(
        (v) => v.length,
        () => 0,
      );

      expect(mapped).toBe(2);
    });
  });

  describe('ok', () => {
    test('Returns Option<T>', () => {
      const result = Result.ok('ok');
      const okResult = result.ok();

      expect(okResult.isSome()).toBe(true);
      expect(okResult.unwrap()).toBe('ok');
    });
  });

  describe('err', () => {
    test('Returns None', () => {
      const result = Result.ok('ok');
      const err = result.err();

      expect(err.isNone()).toBe(true);
    });
  });

  describe('inspect', () => {
    test('Calls inspect callback', () => {
      expect.assertions(1);
      const result = Result.ok('ok');

      result.inspect((v) => {
        expect(v).toBe('ok');
      });
    });

    test('Calls inspect callback', () => {
      const result = Result.ok('ok');

      expect(
        result
          .inspect(() => {
            // something
          })
          .isOk(),
      ).toBe(true);
    });
  });

  /* describe('and', () => { */
  /*   const res1 = Result.ok('ok'); */
  /*   const res2 = Result.ok(1); */
  /*   const andRes = res1.and(res2); */
  /**/
  /*   expect(andRes.isOk()).toBe(true); */
  /*   expect(andRes.unwrap()).toBe(1); */
  /* }); */
});

describe('Err', () => {
  test('type is Err', () => {
    const result = Result.err('');

    expect(result.type).toBe(Result.Err);
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

      expect(() => result.unwrap()).toThrow();
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
      const result = Result.err('err');
      const mapped = result.map(() => 'not called');

      expect(mapped.isErr()).toBe(true);
      /* expect(mapped.unwrap()).toBe(2); */
    });
  });

  describe('mapOr', () => {
    test('Returns mapped value', () => {
      const result = Result.err('err');
      const mapped = result.mapOr(0, () => 2);

      expect(mapped).toBe(0);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      expect.assertions(2);
      const result = Result.err('ok');
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
      const result = Result.err('');
      const okResult = result.ok();

      expect(okResult.isNone()).toBe(true);
    });
  });

  describe('err', () => {
    test('Returns Option with Err result', () => {
      const result = Result.err('err');
      const err = result.err();

      expect(err.isSome()).toBe(true);
      expect(err.unwrap()).toBe('err');
    });
  });

  describe('isOkAnd', () => {
    test('Returns false', () => {
      const result = Result.err('doesnt matter');
      const isOk = result.isOkAnd((v) => v === 1);

      expect(isOk).toBe(false);
    });
  });

  describe('inspect', () => {
    test('Does not call inspect callback', () => {
      expect.assertions(1);
      const result = Result.err('ok');

      result.inspect((v) => {
        expect(v).toBe('ok');
      });

      expect(result.isErr()).toBe(true);
    });

    test('Calls inspect callback', () => {
      const result = Result.err('ok');

      expect(
        result
          .inspect(() => {
            // something
          })
          .isErr(),
      ).toBe(true);
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
    const wrapped = Result.wrap(testFn);
    const result = wrapped(true);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(1);
  });

  test('Wrapped function returns Result (err)', () => {
    const wrapped = Result.wrap(testFn);
    const result = wrapped(false);

    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError('error');
  });
});

describe('Result.wrapAsync', () => {
  const testFn = async (pass: boolean) => {
    if (!pass) {
      return Promise.reject('rejected');
    }

    return Promise.resolve(1);
  };

  test('Wrapped async function returns result (ok)', async () => {
    const wrapped = Result.wrapAsync(testFn);
    const result = await wrapped(true);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(1);
  });

  test('Wrapped async function returns result (err)', async () => {
    const wrapped = Result.wrapAsync(testFn);
    const result = await wrapped(false);

    expect(result.isErr()).toBe(true);
    expect(() => result.unwrap()).toThrowError('rejected');
  });
});
