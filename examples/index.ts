import {
  err,
  ok,
  Result,
  wrapAsync,
  wrap,
  Option,
  some,
  Some,
  None,
} from '../src';

function myProm(msg: string): Promise<{ hi: string }> {
  return Promise.resolve({ hi: msg });
  // return Promise.reject({ hi: msg });
}

function myFunc(a: string, b: number) {
  return {
    a: 'asdf',
  };
}

function optFunc(): Option<number> {
  return some(1);
}

const wrappedAsync = wrapAsync(myProm);
const wrapped = wrap(myFunc);

function testResult(): Result<string, string> {
  return ok('ok val');
  // return err('err val');
}

function testMatch() {
  const res = testResult();

  res.unwrapErr();

  if (res.isErr()) {
    return;
  }

  const a = res.unwrap();

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

function main() {
  // const opt = optFunc();
  //
  // opt.filter;
  // const x = new None('some')
  const x = new None();
  x.unwrap();
}

main();
