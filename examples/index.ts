// import './err';
// import { pino } from 'pino';
import { Ok, Err, None, Result, Option } from '../src';

// const logger = pino({
//   level: 'debug',
//   transport: {
//     target: 'pino-pretty',
//   },
// });

// Result.setLogger(logger);

// Result.setLogger(
//   <T, E>(result: Result<T, E>, options: Result.LoggerOptions) => {
//     console.log('YEAH RESULT', result);
//   },
// );

// Result.setLogLevel(Result.LogLevel.debug);

const testVoid = (): Result.Void<number> => {
  // return new Ok()
  return new Err(1);
};

const test = (): Result<string, string> => {
  // return Result.ok('test');
  // return new Ok('test');
  return new Err('test');
};

const otherTest = (): Result<string, number> => {
  const t = test();

  if (t.isErr()) {
    return t.mapErr((e) => e.length);
  }

  return new Ok('otherTest');
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

const myFunc = (a: string) => {
  throw 'balls';
};

async function main() {
  const res = Result.call(myFunc, '1');

  console.log(res);
}

main();
