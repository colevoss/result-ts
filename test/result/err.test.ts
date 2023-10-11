import { Err, Ok } from '../../src';

describe('Err', () => {
  describe('isErr', () => {
    test('is true', () => {
      const result = new Err('Err');

      expect(result.isErr()).toBe(true);
    });
  });

  describe('isOk', () => {
    test('is false', () => {
      const result = new Err('Err');

      expect(result.isOk()).toBe(false);
    });
  });

  describe('unwrap', () => {
    test('throws error', () => {
      const result = new Err('err');

      expect(() => result.unwrap()).toThrow('err');
    });
  });

  describe('unwrapErr', () => {
    test('returns error value', () => {
      const result = new Err('error value');

      expect(result.unwrapErr()).toBe('error value');
    });
  });

  describe('unwrapOr', () => {
    test('Returns or value', () => {
      const result = new Err('err');

      expect(result.unwrapOr('or value')).toBe('or value');
    });
  });

  describe('unwrapOrElse', () => {
    test('returns value returned from callback', () => {
      const result = new Err('err');

      expect.assertions(2);

      const cb = (errValue: string) => {
        expect(errValue).toBe('err');
        return `${errValue} value`;
      };

      expect(result.unwrapOrElse(cb)).toBe('err value');
    });
  });

  describe('expect', () => {
    test('Returns throws reason error', () => {
      const result = new Err('ok value');

      const expectThrow = () => {
        result.expect('Should throw');
      };

      expect(expectThrow).toThrowError('Should throw');
    });
  });

  describe('expectErr', () => {
    test('Returns error value', () => {
      const error = new Err('error value');
      expect(error.expectErr('should be err')).toBe('error value');
    });
  });

  describe('match', () => {
    test('Calls err callback', () => {
      expect.assertions(2);

      const result = new Err('err value');

      const matchResult = result.match(
        (v) => {
          return v;
        },
        (e) => {
          expect(e).toBe('err value');
          return 'error callback value';
        },
      );

      expect(matchResult).toBe('error callback value');
    });
  });

  describe('map', () => {
    test('Returns error', () => {
      const result = new Err('err');
      const mapped = result.map(() => 'not called');

      expect(mapped.isErr()).toBe(true);
      /* expect(mapped.unwrap()).toBe(2); */
    });
  });

  describe('mapErr', () => {
    test('Returns Result with new error value', () => {
      const result = new Err('err');
      const mapped = result.mapErr((e) => e.length);

      expect(mapped.isErr()).toBe(true);
      expect(mapped.unwrapErr()).toBe(3);
    });
  });

  describe('mapOr', () => {
    test('Returns mapped value', () => {
      const result = new Err('err');
      const mapped = result.mapOr(() => 2, 0);

      expect(mapped).toBe(0);
    });
  });

  describe('mapOrElse', () => {
    test('Returns mapped value', () => {
      expect.assertions(2);
      const result = new Err('ok');
      const mapped = result.mapOrElse(
        () => {
          expect(true).toBe(true);
          return 0;
        },
        () => 1,
      );

      expect(mapped).toBe(0);
    });
  });

  describe('ok', () => {
    test('Returns None', () => {
      const result = new Err('');
      const okResult = result.ok();

      expect(okResult.isNone()).toBe(true);
    });
  });

  describe('err', () => {
    test('Returns Option with Err result', () => {
      const result = new Err('err');
      const testErr = result.err();

      expect(testErr.isSome()).toBe(true);
      expect(testErr.unwrap()).toBe('err');
    });
  });

  describe('isOkAnd', () => {
    test('Returns false', () => {
      const result = new Err('doesnt matter');
      const isOk = result.isOkAnd((v) => v === 1);

      expect(isOk).toBe(false);
    });
  });

  describe('isErrAnd', () => {
    test('Returns result from callback', () => {
      expect.assertions(2);

      const result = new Err(1);

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
      const result = new Err('ok');

      result.inspect((v) => {
        expect(v).toBe('ok');
      });

      expect(result.isErr()).toBe(true);
    });
  });

  describe('inspectErr', () => {
    test('Calls callback', () => {
      expect.assertions(1);

      const result = new Err('err');

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
      const ok = new Ok<string, string>('ok');

      const andValue = err.and(ok);

      expect.assertions(1);

      andValue.inspectErr((err) => expect(err).toBe('err'));
    });
  });

  describe('andThen', () => {
    test('Does not call callback and returns self', () => {
      const err = new Err('err');
      expect.assertions(1);

      const res = err.andThen(() => {
        expect(1).toBe(1);
        return new Ok('andThen');
      });

      expect(res).toBe(err);
    });
  });

  describe('orElse', () => {
    test('calls callback and returns result', () => {
      const err = new Err('err');

      expect.assertions(2);

      const res = err.orElse((err) => {
        expect(err).toBe(err);
        return new Ok('orElse');
      });

      expect(res.unwrap()).toBe('orElse');
    });
  });
});
