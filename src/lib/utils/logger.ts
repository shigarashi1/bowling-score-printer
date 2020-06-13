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

/* eslint-disable no-console */
// eslint-disable-next-line complexity
const getConsole = (logLevel: TLogLevel) => {
  switch (logLevel) {
    case ELogLevel.error:
      return console.error;
    case ELogLevel.warn:
      return console.warn;
    case ELogLevel.info:
      return console.info;
    case ELogLevel.log:
      return console.log;
    default:
      return console.debug;
  }
};

export const logger = (logLevel: TLogLevel, message: string, ...optionalParams: any[]): void => {
  const _console = getConsole(logLevel);
  _console(__formatLogMessage(logLevel, message), ...optionalParams);
};
