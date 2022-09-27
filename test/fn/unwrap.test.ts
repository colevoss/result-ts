import { unwrap, unwrapOr, ok, err } from '../../src/fn';

describe('unwrap', () => {
  test('Returns value if result is Ok', () => {
    const result = ok('value');
    const unwrapped = unwrap(result);

    expect(unwrapped).toBe('value');
  });

  test('Throws error if result is Err', () => {
    const result = err('error string');

    const unwrappResult = () => {
      unwrap(result);
    };

    expect(unwrappResult).toThrow();
  });
});

describe('unwrapOr', () => {
  test('Returns result value if Ok', () => {
    const result = ok('value');
    const unwrapped = unwrapOr(result, 'orValue');

    expect(unwrapped).toBe('value');
  });

  test('Returns result value if Ok', () => {
    const result = err<string, string>('value');
    const unwrapped = unwrapOr(result, 'orValue');

    expect(unwrapped).toBe('orValue');
  });
});
