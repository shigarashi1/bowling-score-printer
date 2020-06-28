import { isNumber, isNumberStr } from '../utils';
import { add, path, toPairs, map, reduce, split, all, pipe, prop, filter } from 'ramda';

type CellIndex = [number, number];
type ItereterTypeValue = number | CellIndex | CellIndex[];
type ItereterType = {
  start: ItereterTypeValue;
  end?: ItereterTypeValue;
};
type NormarizeFormat = CellIndex | ItereterType;
export type NormarizeConfig<T> = Record<keyof T, NormarizeFormat>;

const isCellIndex = (x: unknown): x is CellIndex => Array.isArray(x) && x.length === 2 && all(isNumber, x);

/**
 * 設定値のCellIndexを元に分解した行からIndexNumberに変換する
 * @param separatedLines 分解した行
 */
const indexNumber2CellIndexBySeparatedLines = (separatedLines: string[][]) => (cellIndex: CellIndex): number => {
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
  if (isCellIndex(conf)) {
    return fn(conf);
  }
  return reduce((acc, cur) => add(acc, fn(cur)), 0, conf);
};

const takeCondition = (startIndex: number, endIndex?: number) => (index: number): boolean => {
  return endIndex ? startIndex <= index && index <= endIndex : startIndex <= index;
};
const _takeLines = (separatedLines: string[][], startIndex: number, endIndex?: number): unknown[] => {
  const indexesLines = separatedLines.map((line, index) => ({ line, index }));
  return filter(pipe(prop('index'), takeCondition(startIndex, endIndex)), indexesLines).map(prop('line'));
};
const takeLines = (separatedLines: string[][], config: ItereterType): unknown[] => {
  const { start, end } = config;
  const startIndex = getIndexNumber(separatedLines, start);
  const endIndex = typeof end === 'undefined' ? end : getIndexNumber(separatedLines, end);
  return _takeLines(separatedLines, startIndex, endIndex);
};

/**
 * 改行コードで行を分解した文字列の配列からデータを取得する
 * @param lines 改行コードで行を分解した文字列の配列
 * @param separator 1行をさらに分解する文字列
 */
const pickDataByLines = (lines: string[], separator: string) => (config: NormarizeFormat) => {
  const separatedLines = map(split(separator), lines);
  if (isCellIndex(config)) {
    return path(config, separatedLines);
  }
  return takeLines(separatedLines, config);
};

/**
 * テキストファイルから改行コードで行を分解した文字列の配列を渡された設定を元にobjectに変換して返却する
 * @param config 設定
 * @param separator 1行を分解する文字列
 */
export const normarizeLines = <T>(config: NormarizeConfig<T>, separator: string) => (
  lines: string[],
): Record<keyof T, unknown> => {
  const pickData = pickDataByLines(lines, separator);
  const pairs = map(([key, conf]) => [key, conf] as [keyof T, NormarizeFormat], toPairs(config));
  const obj = reduce(
    (acc, [key, conf]) => ({ ...acc, [key]: pickData(conf) }),
    {} as { [P in keyof T]: T[P] }, //
    pairs,
  );
  return obj as T;
};
