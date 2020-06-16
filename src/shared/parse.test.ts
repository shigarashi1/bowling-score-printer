import { readTextFile } from '../lib/utils';
import { parseFileLines } from './parse';

describe('parseData', () => {
  const fileLines = readTextFile('src/test/test1.txt', 'utf8');
  const data = parseFileLines(fileLines);
  it('propertyに値が設定されて返却', () => {
    const ExpectedRootProperties: [string, string | number][] = [
      ['numberOfLane', '15'], //
      ['numberOfPlayer', 4], //
      ['numberOfGame', 3], //
      ['playDate', '2016-06-26'], //
    ];
    ExpectedRootProperties.forEach(([key, value]) => {
      expect(data).toHaveProperty(key, value);
    });
  });
});
