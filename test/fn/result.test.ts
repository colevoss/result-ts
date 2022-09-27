import { isOk, isErr, ok, err, expect as resultExpect } from '../../src/fn';

describe('ok', () => {
  test('ok property is true', () => {
    const result = ok(1);
    expect(result.ok).toBe(true);
  });

  test('Value is what is passed', () => {
    const result = ok(1);

    expect(result.value).toBe(1);
  });

  test('Error is undefined', () => {
    const result = ok(1);
    expect(result.error).toBeUndefined();
  });
});

describe('err', () => {
  test('ok property is false', () => {
    const result = err('error string');
    expect(result.ok).toBe(false);
  });

  test('error is passed value', () => {
    const result = err('error string');
    expect(result.error).toBe('error string');
  });

  test('error can take a value', () => {
    const result = err('error string', 'value string');
    expect(result.value).toBe('value string');
  });
});

describe('isOk', () => {
  test('true if given Ok result', () => {
    const okResult = ok(1);

    expect(isOk(okResult)).toBe(true);
  });

  test('false if given Err result', () => {
    const errResult = err('error result');

    expect(isOk(errResult)).toBe(false);
  });
});

describe('isErr', () => {
  test('true if given Err result', () => {
    const errResult = err('error result');

    expect(isErr(errResult)).toBe(true);
  });

  test('isOk is false if given Err result', () => {
    const okResult = ok(1);

    expect(isErr(okResult)).toBe(false);
  });
});
