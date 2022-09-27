import { Err, match, ok, err, isErr } from '../../src/fn';

describe('match', () => {
  test('Match calls ok branch if ok', () => {
    // Expect the assertion in the ok branch to be called
    expect.assertions(2);

    const matches = {
      ok: (val: string) => {
        expect(val).toBe('test');
        return val;
      },
      err: (err: Err<unknown, unknown>) => err,
    };

    const res = ok('test');

    expect(match(res, matches)).toBe('test');
  });

  test('Calls err branch if err', () => {
    // Expect the assertion in the err branch to be called
    expect.assertions(1);

    const matches = {
      ok: (val: string) => val,
      err: (err: Err<unknown, string>) => {
        expect(err.error).toBe('error test');
        return err;
      },
    };

    const res = err('error test');
    match(res, matches);
  });
});
