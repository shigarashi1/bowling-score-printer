import { path, pipe, split, map, nth, includes, prop, inc } from 'ramda';
import { filterIndexed, getOrElse } from '../lib/utils';

type IndexedType<T> = { value: T; index: number };
const toIndexedType = <T>(value: T, index: number): IndexedType<T> => ({ value, index });

// プレイヤーの情報の行か？
const isPlayerLines = (numberOfPlayer: number) => <T>(_: T[], index: number) => 0 < index && index <= numberOfPlayer;

/** ゲームの開始時間の行か？ */
const isGameStartAtLines = (numberOfPlayer: number, numberOfGame: number) => <T>(_: T[], index: number) =>
  numberOfPlayer < index && index <= numberOfPlayer + numberOfGame;

/** プレイヤーの投球結果が入った行か？ */
const isThrowResultLines = (numberOfPlayer: number, numberOfGame: number) => <T>(_: T[], index: number) =>
  numberOfPlayer + numberOfGame < index;

/** プレイヤー名の行か？ */
const isPlayerNameLines = (playerNames: string[]) => (value?: string) => includes(value, playerNames);

/**
 * 読み込んだデータをparseする
 * @param rows 読み込んだファイルの行
 */
// MEMO: ReturnTypeで型を取得したいので、eslintを切る
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const parseFileLines = (fileLines: string[]) => {
  const lines = map(split(' '), fileLines);
  const playDate = path(['0', '1'], lines);
  const numberOfLane = path(['0', '0'], lines);
  const numberOfPlayer = Number(path(['0', '2'], lines) || 0);
  const numberOfGame = Number(path(['0', '3'], lines) || 0);

  // プレイヤー情報の配列を作る
  const players = pipe(
    filterIndexed<string[]>(isPlayerLines(numberOfPlayer)),
    map((line) => ({
      name: getOrElse('', nth(0, line)),
      hdcp: getOrElse('', nth(1, line)),
      age: getOrElse('', nth(2, line)),
      sex: getOrElse('', nth(3, line)),
    })),
  )(lines);

  // ゲームの開始時間の配列を作る
  const gameStartTimes = pipe(
    filterIndexed<string[]>(isGameStartAtLines(numberOfPlayer, numberOfGame)),
    map((line) => ({
      no: getOrElse('', nth(0, line)),
      startAt: getOrElse('', nth(1, line)),
    })),
  )(lines);

  // プレイヤー情報の配列からプレイヤー名の一覧を作る
  const playerNames = map(pipe(prop('name')), players);

  // ユーザー名と投球結果が入った行のみに絞り込む
  const resultLines = filterIndexed(isThrowResultLines(numberOfPlayer, numberOfGame))(lines);

  // プレイヤーごとの投球結果を作る
  const playerResults = resultLines
    // 行とその行のIndexを保持するObjectを作る
    .map(toIndexedType)
    // プレイヤー名が入った行のみを抽出する
    .filter(pipe(prop('value'), nth(0), isPlayerNameLines(playerNames)))
    // プレイヤー名をkeyとして、プレイヤーの投球結果をvalueとするObjectを作成する
    .reduce((acc, cur, i, arr) => {
      const playerName = getOrElse('', nth(0, cur.value));
      const next = nth(inc(i), arr);
      if (typeof next === 'undefined') {
        // 次の行がない場合 = 最終行
        return { ...acc, [playerName]: filterIndexed<string[]>((_, i) => 0 < i && cur.index < i)(resultLines) };
      }
      return {
        ...acc,
        [playerName]: filterIndexed<string[]>((_, i) => 0 < i && cur.index < i && i < next.index)(resultLines),
      };
    }, {} as { [playerName: string]: string[][] });

  return {
    numberOfLane,
    players,
    playDate,
    numberOfPlayer,
    numberOfGame,
    gameStartTimes,
    playerResults,
  };
};

export type ParsedData = ReturnType<typeof parseFileLines>;
