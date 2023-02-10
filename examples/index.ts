import { Ok, Err, None, Result, Option } from '../src';

// Result.setLogger(
//   <T, E>(result: Result<T, E>, options: Result.LoggerOptions) => {
//     console.log('YEAH RESULT', result);
//   },
// );

Result.setLogLevel(Result.LogLevel.warn);

const test = (): Result<string, string> => {
  // return new Ok('test');
  return new Err('test');
};

const otherTest = (): Result<string, number> => {
  // return new Ok('asdf');
  return new Err(1);
};

const otherOtherTest = (): Result<number, string> => {
  // return new Ok(1);
  return new Err('other other');
};

const opt = (): Option<number> => {
  return Option.some(1);
};

const otherOpt = (): Option<number> => {
  return Option.none();
};

const otherOtherOpt = (): Option<string> => {
  return Option.some('opt');
};

function main() {
  const t = test().debug('Fetched thing');
  const t2 = otherTest();
  const t3 = otherOtherTest();

  // type Y = Result.OkTypes<[Result<number, string>, Result<string, number>]>;
  // type EY = Result.ErrTypes<[Result<number, string>, Result<string, number>]>;

  const x = t.or(t2);
  const y = t.and(t3);

  const o = opt();
  const o2 = otherOpt();
  const o3 = otherOtherOpt();

  const oOr = o.or(o2);
  const oAnd = o.and(o3);

  const all = Result.all(t, t3);

  const any = Result.any(t, t3);

  t.info('hello');
  t.warn('warning');
  // Result.resetLogger();
  /* t2.pretty('hello'); */

  // const x = Result.or(t, t2);
  // const y = Result.and(t, t2);
}

main();
