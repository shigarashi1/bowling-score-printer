import { logger, ELogLevel } from './lib/utils';

const main = (): void => {
  logger(ELogLevel.debug, 'hello world!');
};
main();
