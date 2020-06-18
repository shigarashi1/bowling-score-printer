import { allPass, path, includes, toPairs } from 'ramda';

import { TKnockedDownPin, TLastFrame, EScoreMark, TScoreMark } from './types';

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
 * 最終フレームの型か？
 * @param x 型検定したい値
 */
export const isLastFrame = (x: unknown): x is TLastFrame =>
  path(['no'], x) === 10 && typeof path(['box3rd'], x) !== 'undefined';

export const isStrikeMark = (x: unknown): x is typeof EScoreMark.strike => x === EScoreMark.strike;

export const isSpareMark = (x: unknown): x is typeof EScoreMark.spare => x === EScoreMark.spare;

export const isScoreMark = (x: unknown): x is TScoreMark => includes(x, toPairs(EScoreMark));

export const isCountZeroMark = (
  x: unknown,
): x is Extract<
  TScoreMark,
  typeof EScoreMark.foul | typeof EScoreMark.gutter | typeof EScoreMark.miss | typeof EScoreMark.noThrow
> => includes(x, [EScoreMark.foul, EScoreMark.gutter, EScoreMark.miss, EScoreMark.noThrow]);
