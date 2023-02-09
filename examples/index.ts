import {
  err,
  ok,
  Result,
  wrapAsync,
  wrap,
  Option,
  some,
  Some,
  Ok,
  None,
  Res,
} from '../src';

const test = (): Result<string, string> => {
  return new Ok('test');
};

function main() {}

main();
