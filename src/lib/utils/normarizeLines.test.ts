import { normarizeLines, NormarizeConfig } from './normarizeLines';
import { times, inc, map, add, repeat, join, prop, toPairs } from 'ramda';

/**
 * 渡した数字に+1づつ加算した4つの数字の配列を返却する
 */
const number4Array = (num: number) => map(add(num), times(inc, 4));

/**
 * テスト用のデータ
 * 1 2 3 4
 * 2 3 4 5
 * 3 4 5 6
 * ...
 * 10 11 12 13
 */
const TEST_LINES = repeat(inc, 10)
  .map((_v, i) => number4Array(i))
  .map(join(' '));

type TestProps = 'cellIndex1' | 'cellIndex2' | 'itereter1' | 'itereter2' | 'itereter3' | 'itereter4';

const TEST_NORMARIZED_CONFIG: NormarizeConfig<Record<TestProps, unknown>> = {
  cellIndex1: [0, 0],
  cellIndex2: [0, 1],
  itereter1: { start: 0, end: 1 },
  itereter2: { start: [0, 0], end: [0, 1] },
  itereter3: {
    start: [
      // 3
      [0, 0], // 1
      [0, 1], // 2
    ],
    end: [
      // 6
      [0, 0], // 1
      [0, 1], // 2
      [0, 2], // 3
    ],
  },
  itereter4: {
    start: [
      [3, 3], // 7
    ],
  },
};

const TEST_EXPECTS: Record<TestProps, string | string[][]> = {
  cellIndex1: '1',
  cellIndex2: '2',
  itereter1: [
    ['1', '2', '3', '4'],
    ['2', '3', '4', '5'],
  ],
  itereter2: [
    ['2', '3', '4', '5'],
    ['3', '4', '5', '6'],
  ],
  itereter3: [
    ['4', '5', '6', '7'],
    ['5', '6', '7', '8'],
    ['6', '7', '8', '9'],
    ['7', '8', '9', '10'],
  ],
  itereter4: [
    ['8', '9', '10', '11'],
    ['9', '10', '11', '12'],
    ['10', '11', '12', '13'],
  ],
};

describe('normarizeLines', () => {
  const normarize = normarizeLines(TEST_NORMARIZED_CONFIG, ' ');
  const actuals = normarize(TEST_LINES);
  it('all props equal', () => {
    toPairs(TEST_EXPECTS)
      .map(([key]) => key as TestProps)
      .forEach((key) => {
        expect(prop(key, TEST_EXPECTS)).toEqual(prop(key, actuals));
      });
  });
});
