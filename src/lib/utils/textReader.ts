import { readFileSync } from 'fs';
import { pipe, split } from 'ramda';

const toString = (v: unknown) => String(v);

/**
 * テキストファイルを読み込み、行を文字列の配列として返却する
 * @param path テキストファイルのパス（絶対パス）
 * @param encode エンコード
 */
export const readTextFile = pipe(readFileSync, toString, split('\n'));
