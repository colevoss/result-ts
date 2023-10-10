import { pino } from 'pino';
import { Ok, Err, None, Result, Option } from '../src';

const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
  },
});

// Result.setLogger(logger);

// Result.setLogger(
//   <T, E>(result: Result<T, E>, options: Result.LoggerOptions) => {
//     console.log('YEAH RESULT', result);
//   },
// );

Result.setLogLevel(Result.LogLevel.debug);

const test = (): Result<string, string> => {
  return new Ok('test');
  // return new Err('test');
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
  const t = test();
  const t2 = otherTest();
  const t3 = otherOtherTest();

  // const y = t.map(x => x)

  // t2.okInfo('Good thing').errError('bad thing');
  t.debug('Hello');
}

main();
