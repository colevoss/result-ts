import { Result } from '../result';
import { ResultType } from '../result/result';

export type LogData<T, E> = {
  value?: T;
  error?: E;
  type: ResultType;
};

export interface ResultLoggable<T, E> {
  debug(msg?: string): this;
  info(msg?: string): this;
  warn(msg?: string): this;
  errorLog(msg?: string): this;

  okDebug(msg?: string): this;
  okInfo(msg?: string): this;
  okWarn(msg?: string): this;
  okError(msg?: string): this;

  errDebug(msg?: string): this;
  errInfo(msg?: string): this;
  errWarn(msg?: string): this;
  errError(msg?: string): this;

  toJSON(): LogData<T, E>;
}

// export const levelsMap = {
//   debug: 2,
//   info: 3,
//   warn: 4,
//   error: 5,
//   fatal: 6,
// } as const;

// export type LogLevel = keyof typeof levelsMap;
//
// export const LogLevel = {
//   debug: 'debug',
//   info: 'info',
//   warn: 'warn',
//   error: 'error',
//   fatal: 'fatal',
// } as const;
//
// export type LogLevelNumber = (typeof levelsMap)[LogLevel];
