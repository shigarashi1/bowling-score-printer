import { normarizeLines, NormarizeConfig } from './normarizeLines';
import { times, inc, map, add, repeat, join, prop, reduce, path, keys } from 'ramda';

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

type TestType = {
  cellIndex1: string;
  cellIndex2: string;
  itereter1: string;
  itereter2: string;
  itereter3: string;
  itereter4: {
    a: string;
    b: string;
    c: string;
    d: string;
  }[];
  itereter5: string[];
};
const TEST_NORMARIZED_CONFIG: NormarizeConfig<TestType> = {
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
    convert: {
      a: 0,
      b: 1,
      c: 2,
      d: 3,
    },
  },
  itereter5: {
    start: 8,
    convert: 1,
  },
};

const toItereter4 = (values: string[][]) =>
  reduce(
    (acc, cur) => [
      ...acc,
      {
        a: path([0], cur),
        b: path([1], cur),
        c: path([2], cur),
        d: path([3], cur),
      },
    ],
    [] as unknown[],
    values,
  );

const TEST_EXPECTS: Record<keyof TestType, unknown> = {
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
  itereter4: toItereter4([
    ['8', '9', '10', '11'],
    ['9', '10', '11', '12'],
    ['10', '11', '12', '13'],
  ]),
  itereter5: ['10', '11'],
};

describe('normarizeLines', () => {
  const normarize = normarizeLines(TEST_NORMARIZED_CONFIG, ' ');
  const actuals = normarize(TEST_LINES);
  it('all props equal', () => {
    keys(TEST_EXPECTS).forEach((key) => {
      expect(prop(key, TEST_EXPECTS)).toEqual(prop(key, actuals));
    });
  });
});
