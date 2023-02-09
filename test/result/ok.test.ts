import { Err, Ok } from '../../src';

describe('Ok', () => {
  describe('constructor', () => {
    test('Does not need value', () => {
      const result = new Ok();

      expect(result.isOk()).toBe(true);
    });
  });

  describe('isOk', () => {
    test('isOk is true', () => {
      const result = new Ok(1);

      expect(result.isOk()).toBe(true);
    });
  });

  describe('isOkAnd', () => {
    test('Is true if predicate matches', () => {
      const result = new Ok(1);
      const isOne = result.isOkAnd((v) => v === 1);
      const isNotOne = result.isOkAnd((v) => v !== 1);

      expect(isOne).toBe(true);
      expect(isNotOne).toBe(false);
    });
  });

  describe('isErr', () => {
    test('isErr is false', () => {
      const result = new Ok(1);

      expect(result.isErr()).toBe(false);
    });
  });

  describe('isErrAnd', () => {
    test('Does not call callback', () => {
      expect.assertions(1);

      const result = new Ok(1);

      const and = result.isErrAnd(() => {
        expect(true).toBe(true);
        return true;
      });

      expect(and).toBe(false);
    });
  });

  describe('unwrap', () => {
    test('Returns value', () => {
      const result = new Ok('ok value');

      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('unwrapErr', () => {
    test('throws value', () => {
      const result = new Ok('1');

      expect(() => result.unwrapErr()).toThrow(new Error('1'));
    });
  });

  describe('unwrapOrElse', () => {
    test('Returns contained value', () => {
      const result = new Ok(1);
      const cb = (v: number) => v * 2;
      expect(result.unwrapOrElse(cb)).toBe(1);
    });
  });

  describe('unwrapOr', () => {
    test('Returns value', () => {
      const result = new Ok('ok value');

      expect(result.unwrapOr('not value')).toBe('ok value');
    });
  });

  describe('expect', () => {
    test('Returns value', () => {
      const result = new Ok('ok value');

      expect(result.expect(`shouldn't trigger`)).toBe('ok value');
    });
  });

  describe('expectErr', () => {
    const result = new Ok(1);
    expect(() => result.expectErr('should be error')).toThrow(
      'should be error',
    );
  });

  describe('match', () => {
    test('Calls ok callback', () => {
      expect.assertions(2);

      const result = new Ok('ok value');

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

      const result = new Ok('ok');
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
      const result = new Ok('ok');
      const mapped = result.mapOr((v) => v.length, 0);

      expect(mapped).toBe(2);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      const result = new Ok('ok');
      const mapped = result.mapOrElse(
        (v) => v.length,
        () => 0,
      );

      expect(mapped).toBe(2);
    });
  });

  describe('ok', () => {
    test('Returns Option<T>', () => {
      const result = new Ok('ok');
      const okResult = result.ok();

      expect(okResult.isSome()).toBe(true);
      expect(okResult.unwrap()).toBe('ok');
    });
  });

  describe('err', () => {
    test('Returns None', () => {
      const result = new Ok('ok');
      const err = result.err();

      expect(err.isNone()).toBe(true);
    });
  });

  describe('inspect', () => {
    test('Calls inspect callback', () => {
      expect.assertions(2);
      const result = new Ok('ok');

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

      const result = new Ok('ok');

      result.inspectErr(() => {
        expect(true).toBe(true);
      });

      expect(1).toBe(1);
    });
  });

  describe('or', () => {
    test('returns self if is Ok and given Ok', () => {
      const res = new Ok('value');
      const other = new Ok('or');

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

  describe('andThen', () => {
    test('calls callback if result is Ok and returns result', () => {
      const ok = new Ok('ok');

      expect.assertions(2);

      const res = ok.andThen((val) => {
        expect(val).toBe('ok');

        return new Ok('andThen');
      });

      expect(res.unwrap()).toBe('andThen');
    });
  });

  describe('orElse', () => {
    test('returns self', () => {
      const ok = new Ok('ok');

      expect.assertions(1);

      const res = ok.orElse(() => {
        expect(1).toBe(1);
        return new Ok('orElse');
      });

      expect(res).toBe(ok);
    });
  });
});
