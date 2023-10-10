import { Result, ResultType } from './result';
import { Logger } from '../logger';

export type LogData<T, E> = {
  value?: T;
  error?: E;
  type: ResultType;
};

export interface ResultLoggable<T, E> {
  debug(msg: string, logger?: Logger): this;
  info(msg: string, logger?: Logger): this;
  warn(msg: string, logger?: Logger): this;
  errorLog(msg: string, logger?: Logger): this;
  fatal(msg: string, logger?: Logger): this;

  okDebug(msg: string, logger?: Logger): this;
  okInfo(msg: string, logger?: Logger): this;
  okWarn(msg: string, logger?: Logger): this;
  okError(msg: string, logger?: Logger): this;
  okFatal(msg: string, logger?: Logger): this;

  errDebug(msg: string, logger?: Logger): this;
  errInfo(msg: string, logger?: Logger): this;
  errWarn(msg: string, logger?: Logger): this;
  errError(msg: string, logger?: Logger): this;
  errFatal(msg: string, logger?: Logger): this;

  toJSON(): LogData<T, E>;
}
