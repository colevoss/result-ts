import { some, none } from '../../src';

describe('some', () => {
  test('returns Some with provided value', () => {
    const testSome = some('some');

    expect(testSome.isSome()).toBe(true);
  });
});

describe('none', () => {
  test('returns None', () => {
    const testNone = none();

    expect(testNone.isNone()).toBe(true);
  });
});
