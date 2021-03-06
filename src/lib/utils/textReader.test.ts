import { readTextFile } from './textReader';

describe('readTextFileLines', () => {
  it('行を文字列の配列として返却', () => {
    const lines = readTextFile('\n')('src/lib/utils/textReader.test.txt', 'utf8');
    lines.forEach((line) => {
      expect(typeof line === 'string').toBeTruthy();
    });
  });
});
