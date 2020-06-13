import { ELogLevel, __formatLogMessage } from './logger';
import toPairs from 'ramda/src/toPairs';

describe('_formatLogMessage', () => {
  it('LogLevelに応じた`[xxx]`設定したmessageを返却', () => {
    const levels = toPairs(ELogLevel);
    levels.forEach(([, level]) => {
      const logMessage = __formatLogMessage(level, 'dummy');
      const tmp = logMessage.split(' ');
      expect(tmp[0]).toBe(`[${level}]`);
    });
  });
  it('引数として渡したmessageを設定して返却', () => {
    const message = 'dummy';
    const logMessage = __formatLogMessage(ELogLevel.debug, message);
    const tmp = logMessage.split(' ');
    expect(tmp[3]).toBe(message);
  });
});
