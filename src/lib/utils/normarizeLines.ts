import { isNumber, isNumberStr } from '../utils';
import { add, path, map, reduce, split, all, pipe, prop, filter, keys, toPairs, assoc } from 'ramda';

/**
 * 行数と列数を指定して、特定の値を取得
 */
type Indexes = [number, number];
/**
 * 複数行取得する、かつ、特定の列をkeyとして指定したい場合、{key: 列番}で指定
 */
type ItereterTypeConverterConfig<T, P extends keyof T> = { [K in keyof T[P]]: number };
/**
 * 繰り返し行を取得したい場合に指定
 * 特定の行数と列数を指定することや複数指定することで加算した行間を取得できる
 */
type ItereterTypeValue = number | Indexes | (number | Indexes)[];
type ItereterType<T, P extends keyof T> = {
  start: ItereterTypeValue;
  end?: ItereterTypeValue;
  convert?: ItereterTypeConverterConfig<T, P>;
};
type NormarizeFormat<T, P extends keyof T> = Indexes | ItereterType<T, P>;
export type NormarizeConfig<T> = { [P in keyof T]: NormarizeFormat<T, P> };

const isIndexes = (x: unknown): x is Indexes => Array.isArray(x) && x.length === 2 && all(isNumber, x);

/**
 * 設定値のCellIndexを元に分解した行からIndexNumberに変換する
 * @param separatedLines 分解した行
 */
const indexNumber2CellIndexBySeparatedLines = (separatedLines: string[][]) => (cellIndex: Indexes): number => {
  const cellValue = path(cellIndex, separatedLines);
  if (!isNumberStr(cellValue)) {
    throw Error('Not Number CellIndex.');
  }
  return Number(cellValue);
};

/**
 * IndexNumberを取得する
 * @param separatedLines 分解した行
 * @param conf 設定値
 */
const getIndexNumber = (separatedLines: string[][], conf: ItereterTypeValue): number => {
  if (isNumber(conf)) {
    return conf;
  }
  const fn = indexNumber2CellIndexBySeparatedLines(separatedLines);
  if (isIndexes(conf)) {
    return fn(conf);
  }
  return reduce((acc, cur) => add(acc, typeof cur === 'number' ? cur : fn(cur)), 0, conf);
};

const itereterConditionFn = (startIndex: number, endIndex?: number) => (index: number): boolean => {
  return endIndex ? startIndex <= index && index <= endIndex : startIndex <= index;
};

const _gatLines = (separatedLines: string[][], startIndex: number, endIndex?: number): string[][] => {
  const indexesLines = separatedLines.map((line, index) => ({ line, index }));
  return filter(pipe(prop('index'), itereterConditionFn(startIndex, endIndex)), indexesLines).map(prop('line'));
};

const convertFn = <T, P extends keyof T>(convertConfig: ItereterTypeConverterConfig<T, P>) => (line: string[]) =>
  reduce(
    (acc, [key, index]) => assoc(key, path([index], line), acc),
    {} as { [K in keyof T[P]]: T[P][K] },
    toPairs<number>(convertConfig),
  );

const _getDataByLines = <T, P extends keyof T>(separatedLines: string[][], config: ItereterType<T, P>): unknown[] => {
  const { start, end, convert } = config;
  const startIndex = getIndexNumber(separatedLines, start);
  const endIndex = typeof end === 'undefined' ? end : getIndexNumber(separatedLines, end);
  const lines = _gatLines(separatedLines, startIndex, endIndex);
  if (typeof convert === 'undefined') {
    return lines;
  }
  return map(convertFn(convert), lines);
};

/**
 * 改行コードで行を分解した文字列の配列からデータを取得する
 * @param lines 改行コードで行を分解した文字列の配列
 * @param separator 1行をさらに分解する文字列
 */
const getDataByLines = (lines: string[], separator: string) => <T, P extends keyof T>(
  config: NormarizeFormat<T, P>,
) => {
  const separatedLines = map(split(separator), lines);
  if (isIndexes(config)) {
    return path(config, separatedLines);
  }
  return _getDataByLines(separatedLines, config);
};

/**
 * テキストファイルから改行コードで行を分解した文字列の配列を渡された設定を元にobjectに変換して返却する
 * @param config 設定
 * @param separator 1行を分解する文字列
 */
export const normarizeLines = <T>(config: NormarizeConfig<T>, separator: string) => (lines: string[]): T => {
  const fn = getDataByLines(lines, separator);
  const pairs = map((key) => ({ key, conf: config[key] }), keys(config));
  return reduce(
    (acc, { key, conf }) => ({ ...acc, [key]: fn(conf) }),
    {} as { [P in keyof T]: T[P] }, //
    pairs,
  );
};
