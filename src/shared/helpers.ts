import { __, allPass, pipe, multiply, divide, map, prop, reduce, add } from 'ramda';
import { TThrowResult, TKnockedDownPin, TFrame } from '.';
import { TFrameNumber, TPlayer } from './types';

const isNumber = (x: unknown): x is number => !Number.isNaN(x);
/**
 * typeguard: 倒したピンの数か？
 * @param x 型検定したい値
 */
export const isKnockedDownPin = (x: unknown): x is TKnockedDownPin => allPass([isNumber, (v) => 0 < v && v <= 10])(x);

/**
 * ストライクか？（投球結果 === 10の場合、trueを返却する）
 * @param throwResult 投球結果
 */
export const isStrike = (throwResult: TThrowResult): boolean => throwResult === 10;

/**
 * スペアか？（1投球目の投球結果 + 2投球目の投球結果 === 10の場合、trueを返却する）
 * @param firstThrowResult 1投球目の投球結果
 * @param secondThrowResult 2投球目の投球結果
 */
export const isSpare = (firstThrowResult: TThrowResult, secondThrowResult: TThrowResult): boolean => {
  if (!isKnockedDownPin(firstThrowResult) || !isKnockedDownPin(secondThrowResult)) {
    return false;
  }
  return firstThrowResult + secondThrowResult === 10;
};

/**
 * 最終フレームか？
 * @param frameNo フレームno
 */
export const isLastFrame = (frameNo: TFrameNumber): boolean => frameNo === 10;

/**
 * 桁数を指定し、切り捨てを行う
 * @param digits 桁数を指定（1の位の場合:1、小数点第1位の場合:-1を指定）
 */
export const mathFloor = (digits: number): ((n: number) => number) =>
  pipe(multiply(Math.pow(10, digits)), Math.floor, divide(__, Math.pow(10, digits)));

/**
 * 各フレームのスコアの配列を計算して返却する
 * @param frames 全フレーム
 */
export const calcFrameScoreElements = (frames: TFrame[]): { frame: TFrame; score: number }[] => [];

/**
 * 指定したフレームのスコアを返却する
 * @param frames 全フレーム
 * @param frameNumber フレーム数
 */
export const calcFrameScore = (frames: TFrame[], frameNumber: TFrameNumber): number => frameNumber;

/**
 * ゲームのスコアを計算して返却する
 */
export const calcGameTotal: (frames: TFrame[]) => number = pipe(
  calcFrameScoreElements,
  map(prop('score')),
  reduce(add, 0),
);

/**
 * ハンディキャップを加算する
 * @param hdcp ハンディキャップ
 */
export const addHandCap = (hdcp: number): ((score: number) => number) => add(hdcp);

/**
 * プレイヤーの全てのゲームを合算して返却する
 */
export const calcPlayerTotal: (player: TPlayer) => number = pipe(prop('games'), map(prop('frames')), calcGameTotal);
