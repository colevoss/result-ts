import { Option } from '../../src';

describe('some', () => {
  test('returns Some with provided value', () => {
    const testSome = Option.some('some');

    expect(testSome.isSome()).toBe(true);
  });
});

describe('none', () => {
  test('returns None', () => {
    const testNone = Option.none();

    expect(testNone.isNone()).toBe(true);
  });
});
