import { Option, some, none } from '../../src/oop';

describe('Option.some', () => {
  test('Returns Some', () => {
    const option = Option.some('');

    expect(option.isSome()).toBe(true);
  });
});

describe('Option.none', () => {
  test('Returns None', () => {
    const option = Option.none();

    expect(option.isNone()).toBe(true);
  });
});

describe('some())', () => {
  test('Returns Some', () => {
    const option = some(1);

    expect(option.isSome()).toBe(true);
  });
});

describe('none())', () => {
  test('Returns None', () => {
    const option = none();

    expect(option.isNone()).toBe(true);
  });
});

describe('Some', () => {
  test('type is Some', () => {
    const option = Option.some(1);

    expect(option.type).toBe(Option.Some);
  });

  describe('isSomeAnd', () => {
    const option = Option.some(1);
    const isOne = option.isSomeAnd((v) => v === 1);
    const isNotOne = option.isSomeAnd((v) => v !== 1);

    expect(isOne).toBe(true);
    expect(isNotOne).toBe(false);
  });

  describe('unwrap', () => {
    test('Returns value', () => {
      const option = Option.some('some value');

      expect(option.unwrap()).toBe('some value');
    });
  });

  describe('unwrapOr', () => {
    test('Returns value', () => {
      const option = Option.some('some value');

      expect(option.unwrapOr('not value')).toBe('some value');
    });
  });

  describe('expect', () => {
    test('Returns value', () => {
      const option = Option.some('some value');

      expect(option.expect(`shouldn't trigger`)).toBe('some value');
    });
  });

  describe('match', () => {
    test('Calls some callback', () => {
      expect.assertions(2);

      const option = Option.some('some value');

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
      const option = Option.some('some');

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
      const option = Option.some(true);

      const mapped = option.mapOr(0, () => 1);

      expect(mapped).toBe(1);
    });
  });

  describe('mapOrElse', () => {
    test('Returns some mapped value', () => {
      const option = Option.some('some');

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
      const option = Option.some('ok value');
      const result = option.okOr('err value');

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('okOrElse', () => {
    test('Returns Ok with value', () => {
      const option = Option.some('ok value');
      const result = option.okOrElse(() => 'err value');

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('ok value');
    });
  });

  describe('inspect', () => {
    test('Calls inspect cb', () => {
      expect.assertions(1);
      const option = Option.some(1);

      option.inspect((v) => {
        expect(v).toBe(1);
      });
    });

    test('Returns this', () => {
      const option = Option.some(1);
      expect(
        option
          .inspect(() => {
            //
          })
          .isSome(),
      ).toBe(true);
    });
  });
});

describe('None', () => {
  test('type is Some', () => {
    const option = Option.none();

    expect(option.type).toBe(Option.None);
  });

  describe('isSomeAnd', () => {
    const option = Option.none();
    const isOne = option.isSomeAnd((v) => v === 1);
    const isNotOne = option.isSomeAnd((v) => v !== 1);

    expect(isOne).toBe(false);
    expect(isNotOne).toBe(false);
  });

  describe('unwrap', () => {
    test('Throws error', () => {
      const option = Option.none();

      expect(() => option.unwrap()).toThrowError('Value is None');
    });
  });

  describe('unwrapOr', () => {
    test('Returns or value', () => {
      const option = Option.none();

      expect(option.unwrapOr('or value')).toBe('or value');
    });
  });

  describe('expect', () => {
    test('Throws error', () => {
      const option = Option.none();

      expect(() => option.expect(`expected value`)).toThrow();
    });
  });

  describe('match', () => {
    test('Calls none callback', () => {
      expect.assertions(2);

      const option = Option.none();

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
      const option = Option.none();

      const mapped = option.map((v) => 1);

      expect(mapped.isNone()).toBe(true);
    });
  });

  describe('mapOr', () => {
    test('Returns or value mapped value', () => {
      const option = Option.none();

      const mapped = option.mapOr(0, () => 1);

      expect(mapped).toBe(0);
    });
  });

  describe('mapOrElse', () => {
    test('Returns none mapped value', () => {
      const option = Option.none();

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
      const option = Option.none();
      const result = option.okOr('err value');

      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrow();
    });
  });

  describe('okOrElse', () => {
    test('Returns Ok with value', () => {
      const option = Option.none();
      const result = option.okOrElse(() => 'err value');

      expect(result.isErr()).toBe(true);
      expect(() => result.unwrap()).toThrow();
    });
  });

  describe('inspect', () => {
    test('Does not call inspect cb', () => {
      expect.assertions(1);
      const option = Option.none();

      option.inspect((v) => {
        expect(v).toBe(1);
      });

      expect(option.isNone()).toBe(true);
    });

    test('Returns this', () => {
      const option = Option.none();
      expect(
        option
          .inspect(() => {
            //
          })
          .isNone(),
      ).toBe(true);
    });
  });
});
