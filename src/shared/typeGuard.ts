import { allPass, path, includes, hasPath } from 'ramda';
import { TKnockedDownPin, TLastFrame, TThrowResult, EScoreMark, TFrame, ESexInput, TSexInput } from './type';

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
export const isLastFrame = (x: TFrame): x is TLastFrame => path(['no'], x) === 10 && hasPath(['throwResult3rd'], x);

/**
 * 性別の入力値か？
 * @param x 型検定したい値
 */
export const isSexInputType = (x: unknown): x is TSexInput => includes(x, [ESexInput.female, ESexInput.male]);
