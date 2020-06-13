import { readTextFileLines } from './text-reader';

describe('readTextFileLines', () => {
  it('行を文字列の配列として返却', () => {
    const lines = readTextFileLines('src/lib/utils/text-reader-test.txt', 'utf8');
    lines.forEach((line) => {
      expect(typeof line === 'string').toBeTruthy();
    });
  });
});
