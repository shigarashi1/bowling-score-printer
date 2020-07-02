import { readFileSync } from 'fs';
import { pipe, split } from 'ramda';

const toString = (v: unknown) => String(v);

type Params = Parameters<typeof readFileSync>;
type Path = Params[0];
type Options = Params[1];

/**
 * テキストファイルを読み込み、行を文字列の配列として返却する
 * @param linefeedStr 改行コード
 */
export const readTextFile = (linefeedStr: string): ((path: Path, options: Options) => string[]) =>
  pipe(readFileSync, toString, split(linefeedStr));
