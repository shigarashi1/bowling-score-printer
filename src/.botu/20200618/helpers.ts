import { pipe, map, prop, reduce, add, anyPass, descend, sort, ascend, inc, find, propEq } from 'ramda';
import { TThrowResult, TFrame } from '.';
import { TFrameNumber, TPlayer, ExtendScore, TLastFrame, TBox, TGame } from './types';
import { isKnockedDownPin, isStrikeMark, isSpareMark, isLastFrame, isCountZeroMark } from './typeGuard';

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
  if (!isKnockedDownPin(secondThrowResult)) {
    return false;
  }
  const fisrtKnockedDownPin = !isKnockedDownPin(firstThrowResult) ? 0 : firstThrowResult;
  return fisrtKnockedDownPin + secondThrowResult === 10;
};

/**
 * 第1投目でストライクまたは第2投目でスペアか？
 * @param frame フレーム
 */
export const is1stStrikeOr2ndSpareFrame: (frame: TFrame | TLastFrame) => boolean = anyPass([
  pipe(prop('box1st'), isStrikeMark),
  pipe(prop('box2nd'), isSpareMark),
]);

/**
 * ボックスから倒したピンの数に変換する
 * @param box 変換したいボックス
 * @param previousBox 1つ前のボックス（スペアの場合、必須）
 */
// eslint-disable-next-line complexity
const box2knockedDownPins = (box: TBox, previousBox?: TBox): number => {
  if (isSpareMark(box)) {
    if (!previousBox) {
      throw Error('');
    }
    return 10 - box2knockedDownPins(previousBox);
  }
  if (isStrikeMark(box)) {
    return 10;
  }
  if (isCountZeroMark(box)) {
    return 0;
  }
  return box;
};

/**
 * フレームの倒したpinの数を数える
 * @param frame フレーム
 */
export const countKnockedDownPinsByFrame = (frame: TFrame): number => {
  if (is1stStrikeOr2ndSpareFrame(frame)) {
    return 10;
  }
  const box1stPins = box2knockedDownPins(frame.box1st);
  const box2stPins = box2knockedDownPins(frame.box2nd);
  return box1stPins + box2stPins;
};

/**
 * 指定したフレーム以降から1投目で倒したピンの数を返却する
 * @param frames フレーム
 * @param frameNumber 指定したフレームno
 */
const getNext1ThrowKnockedDownPins = (frames: (TFrame | TLastFrame)[], frameNumber: TFrameNumber): number => {
  const nextFrame = find(pipe(propEq('no', inc(frameNumber))), frames);
  if (!nextFrame) {
    return 0;
  }
  if (isStrikeMark(nextFrame.box1st)) {
    return 10;
  }
  return box2knockedDownPins(nextFrame.box1st);
};

/**
 * 指定したフレーム以降から2投目までの倒したピンの数を返却する
 * NOTICE: 次以降のフレームがある前提である
 * @param frames フレーム
 * @param frameNumber 指定したフレームno
 */
// eslint-disable-next-line complexity
const getNext2ThrowKnockedDownPins = (frames: (TFrame | TLastFrame)[], frameNumber: TFrameNumber): number => {
  const nextFrame = find(pipe(propEq('no', inc(frameNumber))), frames);
  if (!nextFrame) {
    return 0;
  }
  // ストライクでない場合、2投目までを加算して返却
  if (!isStrikeMark(nextFrame.box1st)) {
    return countKnockedDownPinsByFrame(nextFrame);
  }
  // 最終フレームの場合、2投目を加算して返却
  if (isLastFrame(nextFrame)) {
    return 10 + box2knockedDownPins(nextFrame.box2nd, nextFrame.box1st);
  }
  // 次のフレームが最終フレームでない場合、さらに次のフレームを取得する
  const nextNextFrame = find(pipe(propEq('no', inc(nextFrame.no))), frames);
  // 次のフレームがない場合、1投目のみで終了
  if (!nextNextFrame) {
    return 10;
  }
  return 10 + box2knockedDownPins(nextNextFrame.box1st);
};

/**
 * フレームのスコアを取得する
 * @param frames 計算済みの
 * @param frame
 */
export const calcFrameScore = (frames: ExtendScore<TFrame | TLastFrame>[], frame: TFrame): ExtendScore<TFrame> => {
  if (isStrikeMark(frame.box1st)) {
    return {
      ...frame,
      // ストライクの場合、次の2投目までを加算する
      score: 10 + getNext2ThrowKnockedDownPins(frames, frame.no),
    };
  }
  if (isSpareMark(frame.box2nd)) {
    return {
      ...frame,
      // スペアの場合、次の1投目までを加算する
      score: 10 + getNext1ThrowKnockedDownPins(frames, frame.no),
    };
  }
  // 上記以外の場合、自フレームの数のみ加算する
  return {
    ...frame,
    score: countKnockedDownPinsByFrame(frame),
  };
};

/**
 * 最終フレームのスコアを計算したTypeを返却する
 * @param lastFrame
 */
export const calcLastFrameScore = (lastFrame: TLastFrame): ExtendScore<TLastFrame> => {
  if (!is1stStrikeOr2ndSpareFrame(lastFrame)) {
    // 第1投目でストライクまたは第2投目でスペアでない場合、
    // 通常のフレームと同じなので、倒したピンの数を設定
    return {
      ...lastFrame,
      score: countKnockedDownPinsByFrame(lastFrame),
    };
  }
  // FIXME:
  // 1投目でストライクの場合
  return {
    ...lastFrame,

    score: 0,
  };
};

const sortByFrameNumberAsc = <T extends { no: number }>(): ((v: T[]) => T[]) => sort<T>(ascend(prop('no')));
const sortByNumberDesc = <T extends { no: number }>(): ((v: T[]) => T[]) => sort<T>(descend(prop('no')));

/**
 * 各フレームのスコアの配列を計算して返却する
 * @param frames 全フレーム
 */
export const calcFrameScoreElements: (frames: (TFrame | TLastFrame)[]) => ExtendScore<TFrame | TLastFrame>[] = pipe(
  sortByNumberDesc<TFrame | TLastFrame>(),
  reduce((acc, cur) => {
    if (isLastFrame(cur)) {
      return [...acc, calcLastFrameScore(cur)];
    }
    return [...acc, calcFrameScore(acc, cur)];
  }, [] as ExtendScore<TFrame | TLastFrame>[]),
  sortByFrameNumberAsc<ExtendScore<TFrame | TLastFrame>>(),
);

/**
 * ゲームのスコアを計算して返却する
 */
export const calcGameScore: (game: TGame) => number = pipe(
  prop('frames'),
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
export const calcPlayerTotal: (player: TPlayer) => number = pipe(prop('games'), map(calcGameScore), reduce(add, 0));
