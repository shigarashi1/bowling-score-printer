import { allPass, path, includes } from 'ramda';
import { TKnockedDownPin, TLastFrame, TThrowResult, EScoreMark, TFrame } from './type';

/**
 * number型か?
 * @param x 型検定したい値
 */
export const isNumber = (x: unknown): x is number => !Number.isNaN(x);

/**
 * 倒したピンの数の型か？
 * @param x 型検定したい値
 */
export const isKnockedDownPin = (x: unknown): x is TKnockedDownPin => allPass([isNumber, (v) => 0 < v && v <= 10])(x);

/**
 * 投球結果の内、0本とする型か？
 * @param x 型検定したい値
 */
export const isZeroKnockedDownPin = (
  x: TThrowResult,
): x is Extract<TThrowResult, typeof EScoreMark.foul | typeof EScoreMark.gutter | typeof EScoreMark.noThrow> =>
  includes(x, [EScoreMark.foul, EScoreMark.gutter, EScoreMark.noThrow]);

/**
 * 最終フレームの型か？
 * @param x 型検定したい値
 */
export const isLastFrame = (x: TFrame): x is TLastFrame =>
  path(['no'], x) === 10 && typeof path(['box3rd'], x) !== 'undefined';
