import { Err, Result } from '../src';
import { HttpErrors, HttpError } from '../src/http-errors';

type HttpResult<T> = Result<T, HttpError>;

// interface TestErr {
const test = (): HttpResult<string> => {
  return Result.err(
    HttpErrors.NotFound({ msg: 'user not found', data: { hello: 'test' } }),
  );
};

function main() {
  const t = test();

  const res = t.unwrap();
  // t.expect('balls');
}

// main();

try {
  main();
} catch (e) {
  if (HttpError.isHttpError(e)) {
    console.log('YEAP', e);
    console.log(JSON.stringify(e, null, 2));
  } else if (HttpError.causedByHttpError(e)) {
    // console.log('error casued', e.message, e.cause);
    console.log('error casued', e.cause);
  } else {
    console.log('nope', e.message, e.cause);
  }
}
