import { wrap, unwrap, isOk, isErr, asyncWrap } from '../../src/fn';

const testFn = (shouldThrow: boolean) => {
  if (shouldThrow) {
    throw new Error('Error');
  }

  return 'testFn';
};

describe('wrap', () => {
  test('Returns result when calling given fucntion', () => {
    const wrappedFn = wrap(testFn);
    const result = wrappedFn(false);

    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe('testFn');
  });

  test('Returns Err type when wrapped fn throws', () => {
    const wrappedFn = wrap(testFn);
    const result = wrappedFn(true);

    expect(isErr(result)).toBe(true);
  });
});

describe('asyncWrap', () => {
  const asyncTestFn = async (shouldThrow: boolean) => {
    if (shouldThrow) {
      return Promise.reject('Error');
    }

    return Promise.resolve('success');
  };

  test('Wraps async function and returns ok with promise result', async () => {
    const wrapped = asyncWrap(asyncTestFn);
    const result = await wrapped(false);

    expect(isOk(result)).toBe(true);
    expect(unwrap(result)).toBe('success');
  });

  test('Wraps async function and returns Err with promise reject', async () => {
    const wrapped = asyncWrap(asyncTestFn);
    const result = await wrapped(true);

    expect(isErr(result)).toBe(true);
  });
});
