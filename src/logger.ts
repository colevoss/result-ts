import { Result } from './result';

export const LOG_LEVEL = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
  silent: 100,
} as const;

export type LogLevelName = keyof typeof LOG_LEVEL;
export type LogLevel = (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];

export interface LogFn {
  (data: unknown, message: string, ...args: any): void;
}

let __log_level__: LogLevel = LOG_LEVEL.info;

export type Logger = {
  [K in LogLevelName]: LogFn;
};

export function setLogLevel(level: LogLevel) {
  __log_level__ = level;
}

export function setLogger(logger: Logger) {
  __currentLogger__ = logger;
}

export function resetLogger() {
  __currentLogger__ = defaultLogger;
}

export const defaultLogger: Logger = {
  debug: generateLogFn('debug'),
  info: generateLogFn('info'),
  warn: generateLogFn('warn'),
  error: generateLogFn('error'),
  fatal: generateLogFn('fatal'),
  trace: generateLogFn('trace'),
  silent: () => {},
};
export let __currentLogger__: Logger = defaultLogger;

function log<T, E>(level: LogLevelName, result: Result<T, E>, message: string) {
  if (LOG_LEVEL[level] < __log_level__) {
    return;
  }

  const args = [];

  args.push(`[${level.toUpperCase()}]`);

  args.push(message);

  args.push(result);

  console.log(...args);
}

function generateLogFn(level: LogLevelName): LogFn {
  return (result: Result<unknown, unknown>, message: string) => {
    log(level, result, message);
  };
}
