import { map, addIndex, toPairs, find, propEq, inc } from 'ramda';
import isValid from 'date-fns/fp/isValid';
import parseISO from 'date-fns/fp/parseISO';
import parse from 'date-fns/fp/parse';

import { TLane, ESexInput, ESex, TPlayer, TGame, TFrame } from './type';
import { ParsedData } from './parse';
import { enum2enum, isEnum, getOrElse } from '../lib/utils';
import { isNumber } from '.';

const mapIndexes = addIndex<string[], TGame>(map);
const isSexInput = isEnum(ESexInput);
const toSex = enum2enum(ESexInput, ESex, ESex.female);

const toFrames = (result: string[]): TFrame[] => {
  return [];
};
const toGame = (gameStartTimes: ParsedData['gameStartTimes']) => (result: string[], index: number): TGame => {
  const no = inc(index);
  const startAtStr = getOrElse('', find(propEq('no', String(no)), gameStartTimes)?.no);
  const startAt = parse(new Date(), startAtStr, 'HH:mm');
  if (!isValid(startAt)) {
    throw Error('');
  }
  const frames = toFrames(result);
  return {
    no,
    startAt,
    frames,
  };
};
const toPlayerNameWithGames = (
  gameStartTimes: ParsedData['gameStartTimes'],
  playerResults: ParsedData['playerResults'],
) =>
  map(([name, results]) => {
    const games = mapIndexes(toGame(gameStartTimes), results);
    return { name, games };
  }, toPairs(playerResults));

const toPlayer = (playerNameWithGames: ReturnType<typeof toPlayerNameWithGames>) => (
  player: ParsedData['players'][0],
): TPlayer => {
  if (!isNumber(player.hdcp)) {
    throw Error('');
  }
  const handicap = Number(player.hdcp);
  if (!isNumber(player.age)) {
    throw Error('');
  }
  const age = Number(player.age);
  if (!isSexInput(player.sex)) {
    throw Error('');
  }
  const sex = toSex(player.sex);
  const name = player.name;
  const playerGames = find(propEq('name', name), playerNameWithGames);
  const games = getOrElse([], playerGames?.games);
  return {
    name,
    sex,
    handicap,
    age,
    games,
  };
};

// TODO: parseとnormailze役割逆でしょ...
export const normalize = (parsedData: ParsedData): TLane => {
  // lane
  if (!isNumber(parsedData.numberOfLane)) {
    throw Error('');
  }
  const no = Number(parsedData.numberOfLane);
  // date
  const date = parseISO(parsedData.playDate as string);
  if (!isValid(date)) {
    throw Error('');
  }
  const playerNameWithGames = toPlayerNameWithGames(parsedData.gameStartTimes, parsedData.playerResults);
  const players = map(toPlayer(playerNameWithGames), parsedData.players);
  return {
    no,
    date,
    players,
  };
};
