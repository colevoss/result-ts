import { match, ok } from '../src';

const example = async () => {
  const result = ok('value');

  const value = await match(result, {
    ok: (res) => {
      return Promise.resolve(res);
    },
    err: (err) => {
      console.error(err.error);
      return 'default';
    },
  });

  console.log({ value, test: 'asdf' });
};

example();
