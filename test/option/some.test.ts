import { None, Some, some } from '../../src';

describe('Some', () => {
  describe('isSome', () => {
    const option = new Some(1);

    expect(option.isNone()).toBe(false);
  });

  describe('isSomeAnd', () => {
    const option = new Some(1);
    const isOne = option.isSomeAnd((v) => v === 1);
    const isNotOne = option.isSomeAnd((v) => v !== 1);

    expect(isOne).toBe(true);
    expect(isNotOne).toBe(false);
  });

  describe('unwrap', () => {
    test('Returns value', () => {
      const option = new Some('some value');

      expect(option.unwrap()).toBe('some value');
    });
  });

  describe('unwrapOr', () => {
    test('Returns value', () => {
      const option = new Some('some value');

      expect(option.unwrapOr('not value')).toBe('some value');
    });
  });

  describe('unwrapOrElse', () => {
    test('Returns contined value', () => {
      const option = new Some('some');
      expect.assertions(1);
      const cb = () => {
        expect(1).toBe(1);
        return 'unwrapOrElse test';
      };

      expect(option.unwrapOrElse(cb)).toBe('some');
    });
  });

  describe('expect', () => {
    test('Returns value', () => {
      const option = new Some('some value');

      expect(option.expect(`shouldn't trigger`)).toBe('some value');
    });
  });

  describe('match', () => {
    test('Calls some callback', () => {
      expect.assertions(2);

      const option = new Some('some value');

      const matched = option.match(
        (val) => {
          expect(val).toBe('some value');
          return val;
        },
        () => {
          return 'should call';
        },
      );

      expect(matched).toBe('some value');
    });
  });

  describe('map', () => {
    test('Returns mapped value', () => {
      const option = new Some('some');

      expect.assertions(2);
      const mapped = option.map((v) => {
        expect(v).toBe('some');
        return v.length;
      });

      expect(mapped.unwrap()).toBe(4);
    });
  });

  describe('mapOr', () => {
    test('Returns mapped value', () => {
      const option = new Some(true);

      const mapped = option.mapOr(() => 1, 0);

      expect(mapped).toBe(1);
    });
  });

  describe('mapOrElse', () => {
    test('Returns some mapped value', () => {
      const option = new Some('some');

      expect.assertions(2);
      const mapped = option.mapOrElse(
        (v) => {
          expect(v).toBe('some');
          return v.length;
        },
        () => 0,
      );

      expect(mapped).toBe(4);
    });
  });

  describe('okOr', () => {
    test('Returns Ok with value', () => {
      const option = new Some('ok value');
      const result = option.okOr('err value');

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('okOrElse', () => {
    test('Returns Ok with value', () => {
      const option = new Some('ok value');
      const result = option.okOrElse(() => 'err value');

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('inspect', () => {
    test('Calls inspect cb', () => {
      expect.assertions(1);
      const option = new Some(1);

      option.inspect((v) => {
        expect(v).toBe(1);
      });
    });

    test('Returns this', () => {
      const option = new Some(1);

      expect(
        option
          .inspect(() => {
            //
          })
          .isSome(),
      ).toBe(true);
    });
  });

  describe('and', () => {
    const opt = new Some('opt');
    const other = new Some(1);
    const non = new None();

    test('returns other value if its Some', () => {
      const res = opt.and(other);

      expect(res.unwrap()).toBe(1);
    });

    test('returns other if its none', () => {
      const res = opt.and(non);

      expect(res.isNone()).toBe(true);
    });
  });

  describe('andThen', () => {
    test('calls callback and returns Option', () => {
      const opt = new Some('opt');
      expect.assertions(2);

      const res = opt.andThen((v) => {
        expect(v).toBe('opt');
        return new Some(v.length);
      });

      expect(res.unwrap()).toBe(3);
    });
  });

  describe('or', () => {
    test('returns self', () => {
      const opt = new Some('some');

      const res = opt.or(new None());

      expect(res).toBe(opt);
      expect(res.unwrap()).toBe('some');
    });
  });

  describe('orElse', () => {
    test('does not call callback and returns self', () => {
      const opt = new Some('opt');
      expect.assertions(1);

      const res = opt.orElse(() => {
        expect(1).toBe(1);
        return new Some('other');
      });

      expect(res).toBe(opt);
    });
  });

  describe('xor', () => {
    test('returns None if Some is given', () => {
      const opt = new Some('some');
      const other = new Some('other');
      const res = opt.xor(other);

      expect(res.isNone()).toBe(true);
    });

    test('returns self if None is given', () => {
      const opt = new Some('some');

      const res = opt.xor(new None());

      expect(res).toBe(opt);
    });
  });

  describe('filter', () => {
    test('returns self if predicate passes', () => {
      const opt = new Some('some');

      const res = opt.filter((val) => {
        return val === 'some';
      });

      expect(res).toBe(opt);
    });

    test('returns None if predicate does not pass', () => {
      const opt = new Some('some');

      const res = opt.filter((val) => {
        return val !== 'some';
      });

      expect(res.isNone()).toBe(true);
    });
  });

  describe('flatten', () => {
    test('Unwraps one level of an Some option', () => {
      const deepOption = some(some(1));
      const flattened = deepOption.flatten();
      expect(flattened.isSome()).toBe(true);
      expect(flattened.unwrap()).toBe(1);
    });

    test("Returns this option if it doesn't contain an option", () => {
      const flatOption = some('not option');
      const flattened = flatOption.flatten();

      expect(flattened.isSome()).toBe(true);
      expect(flattened.unwrap()).toBe('not option');
    });
  });
});
