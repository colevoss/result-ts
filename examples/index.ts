import { err, ok, Result, wrapAsync, wrap } from '../src';

function myProm(msg: string): Promise<{ hi: string }> {
  return Promise.resolve({ hi: msg });
  // return Promise.reject({ hi: msg });
}

function myFunc(a: string, b: number) {
  return {
    a: 'asdf',
  };
}

const wrappedAsync = wrapAsync(myProm);
const wrapped = wrap(myFunc);

function testResult(): Result<string, string> {
  // return ok('test');
  return err('test');
}

function testMatch() {
  const res = testResult();

  const y = res.andThen((v) => {
    return ok(1);
  });

  const or = res.or(ok('asdf'));
  const and = res.and(ok('asdf'));

  const z = res.orElse((e) => {
    return ok('asdf');
  });

  const x = res.map((v) => {
    return v.length;
  });

  res.inspect((v) => {
    console.log(v.toUpperCase());
  });
}

async function main() {
  const asyncRes = await wrappedAsync('asdf');
  const res = wrapped('adf', 1);

  testMatch();

  // console.log({ res, asyncRes });
}

main();
