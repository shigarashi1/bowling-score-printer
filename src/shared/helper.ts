import { find, pipe, propEq, inc, equals, reduce, sort, ascend, prop, descend, map, add, prepend } from 'ramda';
import { TThrowResult, TFrame, TFrameNumber, ExtendScore, TLastFrame, TBasicFrame, TGame, TPlayer } from './type';
import { isZeroKnockedDownPin, isLastFrame } from './typeGuard';

/**
 * 投球結果から倒したピンの数を返却する
 * @param throwResult 投球結果
 */
const countPinThrowResult = (throwResult: TThrowResult): number =>
  isZeroKnockedDownPin(throwResult) ? 0 : throwResult;

/**
 * 2つの投球結果の倒したピンの数を合算して返却する
 * @param throwResult1st 投球結果1
 * @param throwResult2nd 投球結果2
 */
const countPin2ThrowResult = (throwResult1st: TThrowResult, throwResult2nd: TThrowResult): number => {
  const firstPins = countPinThrowResult(throwResult1st);
  const secondPins = countPinThrowResult(throwResult2nd);
  return firstPins + secondPins;
};

/**
 * ストライクか？（投球結果 === 10の場合、trueを返却する）
 * @param throwResult 投球結果
 */
const isStrike = (throwResult: TThrowResult): boolean => throwResult === 10;

/**
 * スペアか？（1投球目の投球結果 + 2投球目の投球結果 === 10の場合、trueを返却する）
 * @param throwResult1st 1投球目の投球結果
 * @param throwResult2nd 2投球目の投球結果
 */
const isSpare: (throwResult1st: TThrowResult, throwResult2nd: TThrowResult) => boolean = pipe(
  countPin2ThrowResult,
  equals(10),
);

/**
 * 指定したフレーム以降から1投目で倒したピンの数を返却する
 * @param frames フレーム
 * @param frameNumber 指定したフレームno
 */
const countPinNext1ThrowResult = (frames: TFrame[], frameNumber: TFrameNumber): number => {
  const nextFrame = find(pipe(propEq('no', inc(frameNumber))), frames);
  return !nextFrame ? 0 : countPinThrowResult(nextFrame.throwResult1st);
};

/**
 * 指定したフレーム以降から2投目までの倒したピンの数を返却する
 * NOTICE: 次以降のフレームがある前提である
 * @param frames フレーム
 * @param frameNumber 指定したフレームno
 */
const countPinNext2ThrowResult = (frames: TFrame[], frameNumber: TFrameNumber): number => {
  const nextFrame = find(pipe(propEq('no', inc(frameNumber))), frames);
  if (!nextFrame) {
    return 0;
  }
  // ストライクでない場合、2投目までを加算して返却
  if (!isStrike(nextFrame.throwResult1st)) {
    return countPin2ThrowResult(nextFrame.throwResult1st, nextFrame.throwResult2nd);
  }
  // 最終フレームの場合、2投目を加算して返却
  if (isLastFrame(nextFrame)) {
    return 10 + countPinThrowResult(nextFrame.throwResult2nd);
  }
  // 次のフレームの1投目から取得した値を加算する
  return 10 + countPinNext1ThrowResult(frames, prop('no', nextFrame));
};

/**
 * フレームのスコアを取得する
 * @param nextFrames 計算対象より後のフレーム
 * @param frame 計算対象となるフレーム
 */
const calcBasicFrameScore = (nextFrames: TFrame[], frame: TBasicFrame): ExtendScore<TBasicFrame> => {
  if (isStrike(frame.throwResult1st)) {
    return {
      ...frame,
      // ストライクの場合、次の2投目までを加算する
      score: 10 + countPinNext2ThrowResult(nextFrames, frame.no),
    };
  }
  if (isSpare(frame.throwResult1st, frame.throwResult2nd)) {
    return {
      ...frame,
      // スペアの場合、次の1投目までを加算する
      score: 10 + countPinNext1ThrowResult(nextFrames, frame.no),
    };
  }
  // 上記以外の場合、自フレームの数のみ加算する
  return {
    ...frame,
    score: countPin2ThrowResult(frame.throwResult1st, frame.throwResult2nd),
  };
};

/**
 * 最終フレームのスコアを計算したTypeを返却する
 * @param lastFrame
 */
const calcLastFrameScore = (lastFrame: TLastFrame): ExtendScore<TLastFrame> => {
  // FIXME: 未実装 ・・・
  if (isStrike(lastFrame.throwResult1st)) {
    // 第1投目でストライクまたは第2投目でスペアでない場合、
    // 通常のフレームと同じなので、倒したピンの数を設定
    return {
      ...lastFrame,
      score: 0,
    };
  }
  // 1投目でストライクの場合
  return {
    ...lastFrame,
    score: 0,
  };
};

/**
 * フレームのスコアを計算して返却する
 * @param nextFrames 計算対象より後のフレーム
 * @param frame 計算対象となるフレーム
 */
const calcFrameScore = (nextFrames: TFrame[], frame: TFrame): ExtendScore<TFrame> =>
  isLastFrame(frame) ? calcLastFrameScore(frame) : calcBasicFrameScore(nextFrames, frame);

// TODO: libに移動
const sortByNumberAsc = <T extends { no: number }>(): ((v: T[]) => T[]) => sort<T>(ascend(prop('no')));
const sortByNumberDesc = <T extends { no: number }>(): ((v: T[]) => T[]) => sort<T>(descend(prop('no')));

/**
 * 全てのフレームのスコア計算した配列を返却する
 * @param frames 全フレーム
 * @returns スコアが計算されたフレームの配列
 */
export const computeAllFrameScore: (frames: TFrame[]) => ExtendScore<TFrame>[] = pipe(
  sortByNumberDesc<TFrame>(),
  reduce((acc, cur) => prepend(calcFrameScore(acc, cur), acc), [] as ExtendScore<TFrame>[]),
  sortByNumberAsc<ExtendScore<TFrame>>(),
);

/**
 * ゲームのスコアを計算して返却する
 * @param game ゲーム
 */
export const computeGameScore: (game: TGame) => number = pipe(
  prop('frames'),
  computeAllFrameScore,
  map(prop('score')),
  reduce(add, 0),
);

/**
 * プレイヤーのゲームのスコアを返却する
 * @param player プレイヤー
 */
export const computePlayerTotalScore: (player: TPlayer) => number = pipe(
  prop('games'),
  map(computeGameScore),
  reduce(add, 0),
);
