import { isNumber, isNumberStr } from '../utils';
import { add, path, map, reduce, split, all, pipe, prop, filter, keys, toPairs, assoc } from 'ramda';
import { getOrElse } from './getOrElse';

/**
 * 行数と列数を指定して、特定の値を取得
 */
type Indexes = [number, number];
type IndexedNumber<T> = { [K in keyof T]: number };

/**
 * 複数行取得する、かつ、特定の列をkeyとして指定したい場合、{key: 列番}で指定
 * 列の内、１つしか使わない場合は列番で指定できる
 */
type ItereterTypeConverterConfig<T, P extends keyof T> = T[P] extends Array<infer R>
  ? T[P][0] extends Record<string, unknown>
    ? IndexedNumber<T[P][0]>
    : number
  : never;

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
type NormarizeReturnType<T> = {
  [K in keyof T]: T[K] extends Array<infer R>
    ? R extends Record<string, unknown>
      ? Array<Record<keyof R, unknown>>
      : unknown[]
    : unknown;
};

const isIndexes = (x: unknown): x is Indexes => Array.isArray(x) && x.length === 2 && all(isNumber, x);

const getPathStr = (paths: number[], obj: string[] | string[][]): string => getOrElse('', path(paths, obj));

/**
 * 設定値のCellIndexを元に分解した行からIndexNumberに変換する
 * @param separatedLines 分解した行
 */
const indexNumber2CellIndexBySeparatedLines = (separatedLines: string[][]) => (cellIndex: Indexes): number => {
  const value = getPathStr(cellIndex, separatedLines);
  if (!isNumberStr(value)) {
    throw Error('Not Number CellIndex.');
  }
  return Number(value);
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

const convertFn = <T, P extends keyof T>(convertConfig: IndexedNumber<T> | number) => (line: string[]) => {
  if (isNumber(convertConfig)) {
    return getPathStr([convertConfig], line);
  }
  return reduce(
    (acc, [key, index]) => assoc(key, getPathStr([index], line), acc),
    {} as { [K in keyof T[P]]: T[P][K] },
    toPairs<number>(convertConfig),
  );
};

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
    return getPathStr(config, separatedLines);
  }
  return _getDataByLines(separatedLines, config);
};

/**
 * テキストファイルから改行コードで行を分解した文字列の配列を渡された設定を元にobjectに変換して返却する
 * @param config 設定
 * @param separator 1行を分解する文字列
 */
export const normarizeLines = <T>(config: NormarizeConfig<T>, separator: string) => (
  lines: string[],
): NormarizeReturnType<T> => {
  const fn = getDataByLines(lines, separator);
  const pairs = map((key) => ({ key, conf: config[key] }), keys(config));
  return reduce(
    (acc, { key, conf }) => ({ ...acc, [key]: fn(conf) }),
    {} as { [P in keyof T]: T[P] }, //
    pairs,
  ) as NormarizeReturnType<T>;
};
