import { Result } from '../../src';

describe('ok', () => {
  test('Returns new Ok with passed value', () => {
    const testOk = Result.ok('ok');

    expect(testOk.unwrap()).toBe('ok');
  });

  test('Returns new Ok with default null', () => {
    const testOk = Result.ok();

    expect(testOk.unwrap()).toBeNull();
  });
});

describe('err', () => {
  test('Returns new Err with passed value', () => {
    const testErr = Result.err('err');

    expect.assertions(2);

    expect(testErr.isErr()).toBe(true);
    testErr.inspectErr((e) => {
      expect(e).toBe('err');
    });
  });
});

describe('wrap', () => {
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

describe('wrapAsync', () => {
  const testFn = async (pass: boolean) => {
    if (pass) {
      return 1;
    }

    throw new Error('rejected');
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
