/* eslint-disable no-console */
import { format } from 'date-fns/fp';

export const ELogLevel = {
  debug: 'DEBUG',
  info: 'INFO',
  log: 'LOG',
  warn: 'WARN',
  error: 'ERROR',
} as const;
type TLogLevel = typeof ELogLevel[keyof typeof ELogLevel];

const getTimeStamp = () => format('yyyy-MM-dd HH:mm:ss.SSS', new Date());

export const __formatLogMessage = (logLevel: TLogLevel, message: string): string =>
  `[${logLevel}] ${getTimeStamp()}: ${message}`;

const Console = {
  [ELogLevel.error]: console.error,
  [ELogLevel.warn]: console.warn,
  [ELogLevel.info]: console.info,
  [ELogLevel.log]: console.log,
  [ELogLevel.debug]: console.debug,
} as const;

export const logger = (logLevel: TLogLevel, message: string, ...optionalParams: any[]): void =>
  Console[logLevel](__formatLogMessage(logLevel, message), ...optionalParams);
