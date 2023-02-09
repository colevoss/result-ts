import { None, Some } from '../../src';

describe('None', () => {
  describe('isSome', () => {
    test('isSome is false', () => {
      const option = new None();

      expect(option.isSome()).toBe(false);
    });
  });

  describe('isSomeAnd', () => {
    const option = new None();
    const isOne = option.isSomeAnd((v) => v === 1);
    const isNotOne = option.isSomeAnd((v) => v !== 1);

    expect(isOne).toBe(false);
    expect(isNotOne).toBe(false);
  });

  describe('unwrap', () => {
    test('Throws error', () => {
      const option = new None();

      expect(() => option.unwrap()).toThrowError('Option value is None');
    });
  });

  describe('unwrapOr', () => {
    test('Returns or value', () => {
      const option = new None();

      expect(option.unwrapOr('or value')).toBe('or value');
    });
  });

  describe('unwrapOrElse', () => {
    test('Returns value from callback', () => {
      const option = new None();
      expect.assertions(2);
      const cb = () => {
        expect(1).toBe(1);
        return 'unwrapOrElse test';
      };

      expect(option.unwrapOrElse(cb)).toBe('unwrapOrElse test');
    });
  });

  describe('expect', () => {
    test('Throws error', () => {
      const option = new None();

      expect(() => option.expect(`expected value`)).toThrow();
    });
  });

  describe('match', () => {
    test('Calls none callback', () => {
      expect.assertions(2);

      const option = new None();

      const matched = option.match(
        (val) => {
          return val;
        },
        () => {
          expect(true).toBe(true);
          return 'should call';
        },
      );

      expect(matched).toBe('should call');
    });
  });

  describe('map', () => {
    test('Returns none', () => {
      const option = new None();

      const mapped = option.map(() => 1);

      expect(mapped.isNone()).toBe(true);
    });
  });

  describe('mapOr', () => {
    test('Returns or value mapped value', () => {
      const option = new None();

      const mapped = option.mapOr(() => 1, 0);

      expect(mapped).toBe(0);
    });
  });

  describe('mapOrElse', () => {
    test('Returns none mapped value', () => {
      const option = new None();

      expect.assertions(2);
      const mapped = option.mapOrElse(
        () => {
          return 1;
        },
        () => {
          expect(true).toBe(true);
          return 0;
        },
      );

      expect(mapped).toBe(0);
    });
  });

  describe('okOr', () => {
    test('Returns with provided error', () => {
      const option = new None();
      const result = option.okOr('err value');

      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrow();
    });
  });

  describe('okOrElse', () => {
    test('Returns Ok with value', () => {
      const option = new None();
      const result = option.okOrElse(() => 'err value');

      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrow();
    });
  });

  describe('inspect', () => {
    test('Does not call inspect cb', () => {
      expect.assertions(1);
      const option = new None();

      option.inspect((v) => {
        expect(v).toBe(1);
      });

      expect(option.isNone()).toBe(true);
    });

    test('Returns this', () => {
      const option = new None();
      expect(
        option
          .inspect(() => {
            //
          })
          .isNone(),
      ).toBe(true);
    });
  });

  describe('and', () => {
    test('return self', () => {
      const opt = new None();

      const res = opt.and(new Some('some'));

      expect(res).toBe(opt);
    });
  });

  describe('andThen', () => {
    test('does not call callback returns self', () => {
      const opt = new None();

      expect.assertions(1);

      const res = opt.andThen(() => {
        expect(1).toBe(1);
        return new Some('some');
      });

      expect(res).toBe(opt);
    });
  });

  describe('or', () => {
    test('returns other value if given Some', () => {
      const opt = new None();
      const other = new Some('other');

      const res = opt.or(other);

      expect(res).toBe(other);
    });
  });

  describe('orElse', () => {
    test('calls callback and returns Option', () => {
      const opt = new None();

      expect.assertions(2);

      const res = opt.orElse(() => {
        expect(1).toBe(1);
        return new Some('some');
      });

      expect(res.unwrap()).toBe('some');
    });
  });

  describe('xor', () => {
    test('returns given option if is Some', () => {
      const opt = new None();
      const other = new Some('some');

      const res = opt.xor(other);

      expect(res).toBe(other);
    });

    test('returns self if given None', () => {
      const opt = new None();
      const other = new None();

      const res = opt.xor(other);

      expect(res).toBe(opt);
    });
  });

  describe('filter', () => {
    test('does not call predicate and returns self', () => {
      const opt = new None();

      expect.assertions(1);

      const res = opt.filter(() => {
        return true;
      });

      expect(res).toBe(res);
    });
  });
});
